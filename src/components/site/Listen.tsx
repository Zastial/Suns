"use client";

import { useState } from "react";
import { spotify } from "@/lib/spotify";
import { useInView } from "@/lib/useInView";

export function Listen() {
  // le lecteur Spotify (lourd) ne se charge qu'à l'approche de la section
  const [embedRef, near] = useInView<HTMLDivElement>({ rootMargin: "600px" });
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="listen" id="ecouter">
      <h2 className="section-title reveal">Écouter</h2>
      <div className="listen__grid">
        <div className="listen__embed reveal" ref={embedRef}>
          {!loaded && <div className="embed-skeleton" />}
          {near && (
            <iframe
              src={spotify.embedArtist}
              height={452}
              style={loaded ? undefined : { position: "absolute", opacity: 0 }}
              onLoad={() => setLoaded(true)}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              title="Lecteur Spotify — Sûns"
            />
          )}
        </div>
        <div className="listen__side reveal">
          <a className="btn btn--sun" href={spotify.artist} target="_blank" rel="noopener">
            <span>Suivre sur Spotify</span>
            <span aria-hidden="true">↗</span>
          </a>
          <ul className="platforms">
            {/* ✎ Ajoute tes autres liens ici (Instagram, TikTok, YouTube, Apple Music…) */}
            <li><a href={spotify.artist} target="_blank" rel="noopener">Spotify ↗</a></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
