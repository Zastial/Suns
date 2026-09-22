"use client";

import Image from "next/image";
import { useState } from "react";
import type { Release } from "@/data/discography";
import { usePlayer } from "@/components/player/PlayerProvider";
import { PauseIcon, PlayIcon } from "@/components/icons";
import { useInView } from "@/lib/useInView";
import { spotify } from "@/lib/spotify";

export function Chapter({ release: t, index }: { release: Release; index: number }) {
  const { current, playing, toggle, pause } = usePlayer();
  const [ref, inView] = useInView<HTMLElement>();
  const [embedOpen, setEmbedOpen] = useState(false);
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const isPlaying = playing && current?.id === t.id;

  const toggleEmbed = () => {
    if (!embedOpen) pause(); // évite deux sons en même temps
    setEmbedLoaded(true);
    setEmbedOpen(!embedOpen);
  };

  // inclinaison 3D de la pochette (souris uniquement)
  const tilt = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    e.currentTarget.style.setProperty("--ry", `${(px - 0.5) * 12}deg`);
    e.currentTarget.style.setProperty("--rx", `${(0.5 - py) * 12}deg`);
  };
  const resetTilt = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.removeProperty("--rx");
    e.currentTarget.style.removeProperty("--ry");
  };

  const reveal = `reveal${inView ? " is-in" : ""}`;

  return (
    <article
      ref={ref}
      className={`chapter${inView ? " is-in" : ""}${isPlaying ? " is-playing" : ""}`}
      id={`titre-${t.id}`}
      style={{ "--accent": t.accent } as React.CSSProperties}
    >
      <div className={`chapter__visual ${reveal}`}>
        <div className="disc" aria-hidden="true">
          <div className="disc__spin" />
          <Image src={t.cover} alt="" width={160} height={160} />
        </div>
        <div className="cover" onPointerMove={tilt} onPointerLeave={resetTilt}>
          <Image src={t.cover} alt={`Pochette de ${t.title}`} width={640} height={640} sizes="(max-width: 900px) 92vw, 460px" />
          <button
            className="cover__play"
            onClick={() => toggle(t.id)}
            aria-label={isPlaying ? `Mettre en pause ${t.title}` : `Écouter l'extrait de ${t.title}`}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>
      </div>

      <div className={`chapter__text ${reveal}`}>
        <span className="chapter__num">{String(index + 1).padStart(2, "0")}</span>
        <h3 className="chapter__title">{t.title}</h3>
        <p className="chapter__line">{t.line}</p>
        <ul className="chapter__meta mono">
          {t.isNew && <li><span className="badge-new">Nouveau</span></li>}
          <li>Single</li>
          <li>{t.date}</li>
          <li>{t.duration}</li>
          {t.feat && <li>feat. {t.feat}</li>}
        </ul>
        <div className="chapter__actions">
          <button className="btn btn--solid" onClick={() => toggle(t.id)}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
            <span>Extrait</span>
          </button>
          <button className="btn" onClick={toggleEmbed} aria-expanded={embedOpen}>Lecteur Spotify</button>
          <a className="btn" href={spotify.album(t.albumId)} target="_blank" rel="noopener">Ouvrir ↗</a>
        </div>
        <div className={`chapter__embed${embedOpen ? " is-open" : ""}`}>
          {embedLoaded && (
            <iframe
              src={spotify.embedTrack(t.trackId)}
              height={152}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              title={`Lecteur Spotify — ${t.title}`}
            />
          )}
        </div>
      </div>
    </article>
  );
}
