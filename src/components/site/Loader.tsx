"use client";

import { useEffect } from "react";

/* Chargement : le soleil se lève avec « Sûns », puis la page apparaît (classe is-loaded sur <html>). */
export function Loader() {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer: ReturnType<typeof setTimeout>;
    const ready = () => {
      timer = setTimeout(() => document.documentElement.classList.add("is-loaded"), reduce ? 0 : 900);
    };
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]).then(ready);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="loader" aria-hidden="true">
      <div className="loader__sun" />
      <span className="loader__word">Sûns</span>
    </div>
  );
}
