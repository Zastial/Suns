"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { DISCOGRAPHY, LATEST } from "@/data/discography";
import { usePlayer } from "@/components/player/PlayerProvider";
import { PauseIcon, PlayIcon } from "@/components/icons";

const WORD = "Sûns";

export function Hero() {
  const { current, playing, toggle } = usePlayer();
  const wordRef = useRef<HTMLHeadingElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const latestPlaying = playing && current?.id === LATEST.id;

  // le nom remplit la largeur, sans descendre sur le portrait
  useEffect(() => {
    const fit = () => {
      const word = wordRef.current, inner = innerRef.current;
      if (!word || !inner) return;
      word.style.fontSize = "100px";
      const pad = parseFloat(getComputedStyle(word.parentElement!).paddingLeft) || 0;
      const byWidth = (100 * (window.innerWidth - 2 * pad - 8)) / inner.getBoundingClientRect().width;
      const byHeight = (window.innerHeight * 0.36) / 0.74;
      word.style.fontSize = `${Math.min(byWidth, byHeight)}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero__glow" aria-hidden="true" />

      <figure className="hero__portrait">
        <Image src="/img/artist.jpg" alt="Sûns" width={640} height={640} preload sizes="(max-width: 720px) 74vw, 340px" />
      </figure>

      <div className="hero__release">
        <Image src={LATEST.cover} alt="" width={60} height={60} />
        <div>
          <span className="hero__small">Nouveau single</span>
          <strong>{LATEST.title}</strong>
        </div>
        <button
          className="hero__play"
          onClick={() => toggle(LATEST.id)}
          aria-label={latestPlaying ? `Mettre en pause ${LATEST.title}` : `Écouter l'extrait de ${LATEST.title}`}
        >
          {latestPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      <a className="hero__disco" href="#discographie">
        <span className="hero__small">Discographie</span>
        <span className="hero__thumbs">
          {[...DISCOGRAPHY].reverse().map((t) => (
            <Image key={t.id} src={t.cover} alt="" width={44} height={44} />
          ))}
        </span>
      </a>

      <h1 className="hero__word" aria-label={WORD} ref={wordRef}>
        <span className="split" ref={innerRef}>
          {[...WORD].map((c, i) => (
            <span className="split-mask" key={i} aria-hidden="true">
              <span className="char" style={{ transitionDelay: `${0.15 + i * 0.07}s` }}>{c}</span>
            </span>
          ))}
        </span>
      </h1>
    </section>
  );
}
