"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { DISCOGRAPHY, type Release } from "@/data/discography";

export type Levels = { level: number; bands: [number, number, number, number] };

type PlayerContextValue = {
  current: Release | null;
  playing: boolean;
  /** lance un titre (ou le met en pause s'il est déjà en cours) */
  toggle: (id?: string) => void;
  step: (delta: 1 | -1) => void;
  pause: () => void;
  audio: () => HTMLAudioElement | null;
  /** niveau audio + 4 bandes, null quand rien ne joue (lu à chaque frame par SceneController) */
  levels: () => Levels | null;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer doit être utilisé dans <PlayerProvider>");
  return ctx;
}

/* Extraits 30 s Spotify. Pas d'enchaînement automatique : à la fin, l'extrait s'arrête. */
export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<{ ctx: AudioContext; node: AnalyserNode; data: Uint8Array<ArrayBuffer> } | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.preload = "none";
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => { audio.currentTime = 0; setPlaying(false); };
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      analyserRef.current?.ctx.close();
      analyserRef.current = null;
      audioRef.current = null;
    };
  }, []);

  const ensureAnalyser = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || analyserRef.current) return;
    try {
      const ctx = new AudioContext();
      const node = ctx.createAnalyser();
      node.fftSize = 256;
      node.smoothingTimeConstant = 0.8;
      ctx.createMediaElementSource(audio).connect(node);
      node.connect(ctx.destination);
      analyserRef.current = { ctx, node, data: new Uint8Array(node.frequencyBinCount) };
    } catch {
      /* pas d'analyse audio : les visuels restent statiques */
    }
  }, []);

  const playIndex = useCallback((i: number) => {
    const audio = audioRef.current;
    const track = DISCOGRAPHY[i];
    if (!audio || !track) return;
    ensureAnalyser();
    analyserRef.current?.ctx.resume();
    if (!audio.src.endsWith(track.preview)) audio.src = track.preview;
    setCurrentId(track.id);
    audio.play().catch(() => {});
  }, [ensureAnalyser]);

  const value = useMemo<PlayerContextValue>(() => {
    const index = DISCOGRAPHY.findIndex((t) => t.id === currentId);
    return {
      current: index >= 0 ? DISCOGRAPHY[index] : null,
      playing,
      toggle: (id) => {
        const audio = audioRef.current;
        const target = id ? DISCOGRAPHY.findIndex((t) => t.id === id) : index >= 0 ? index : DISCOGRAPHY.length - 1;
        if (audio && target === index && !audio.paused) audio.pause();
        else playIndex(target);
      },
      step: (delta) => playIndex((Math.max(index, 0) + delta + DISCOGRAPHY.length) % DISCOGRAPHY.length),
      pause: () => audioRef.current?.pause(),
      audio: () => audioRef.current,
      levels: () => {
        const a = analyserRef.current;
        if (!a || !audioRef.current || audioRef.current.paused) return null;
        a.node.getByteFrequencyData(a.data);
        const band = (from: number, to: number) => {
          let s = 0;
          for (let k = from; k < to; k++) s += a.data[k];
          return s / ((to - from) * 255);
        };
        return { level: band(1, 12), bands: [band(1, 6), band(6, 18), band(18, 40), band(40, 90)] };
      },
    };
  }, [currentId, playing, playIndex]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
