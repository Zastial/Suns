"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { usePlayer } from "./PlayerProvider";
import { PauseIcon, PlayIcon } from "@/components/icons";
import { spotify } from "@/lib/spotify";

export function MiniPlayer() {
  const { current, playing, toggle, step, audio } = usePlayer();
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = audio();
    if (!el) return;
    const onTime = () => {
      const p = el.duration ? el.currentTime / el.duration : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
    };
    el.addEventListener("timeupdate", onTime);
    return () => el.removeEventListener("timeupdate", onTime);
  }, [audio]);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = audio();
    if (!el?.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.currentTime = ((e.clientX - r.left) / r.width) * el.duration;
  };

  return (
    <aside
      className={`player${current ? " is-visible" : ""}${playing ? " is-playing" : ""}`}
      aria-label="Lecteur"
      aria-hidden={!current}
    >
      {current && (
        <>
          <Image className="player__cover" src={current.cover} alt="" width={48} height={48} />
          <div className="player__info">
            <strong>{current.title}</strong>
            <span>Extrait 30 s{current.feat ? ` · feat. ${current.feat}` : ""}</span>
            <div className="player__bar" onClick={seek}>
              <div className="player__progress" ref={progressRef} />
            </div>
          </div>
          <div className="player__eq" aria-hidden="true"><i /><i /><i /><i /></div>
          <button className="player__btn" id="p-prev" aria-label="Titre précédent" onClick={() => step(-1)}>⏮</button>
          <button className="player__btn player__btn--main" aria-label={playing ? "Pause" : "Lecture"} onClick={() => toggle()}>
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="player__btn" aria-label="Titre suivant" onClick={() => step(1)}>⏭</button>
          <a className="player__spotify" href={spotify.track(current.trackId)} target="_blank" rel="noopener">
            En entier ↗
          </a>
        </>
      )}
    </aside>
  );
}
