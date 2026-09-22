"use client";

import { useEffect, useRef } from "react";
import { usePlayer } from "@/components/player/PlayerProvider";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

type Star = { x: number; y: number; r: number; p: number; s: number };

/**
 * Ciel fixe (coucher de soleil → nuit au scroll) + une seule boucle requestAnimationFrame qui pilote :
 * le ciel, les étoiles, la nav, la parallaxe de l'accueil, le bandeau, et les visuels liés au son.
 * Les éléments pilotés sont retrouvés par sélecteur : leurs classes React restent statiques,
 * on ne touche qu'à leurs styles / classes d'état ici.
 */
export function SkyScene() {
  const player = usePlayer();
  const playerRef = useRef(player);
  useEffect(() => { playerRef.current = player; }, [player]);

  const duskRef = useRef<HTMLDivElement>(null);
  const nightRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const $ = <T extends Element>(s: string) => document.querySelector<T>(s);
    const dusk = duskRef.current!, night = nightRef.current!, canvas = canvasRef.current!;
    const g = canvas.getContext("2d")!;

    // --- étoiles ---
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let w = 0, h = 0, stars: Star[] = [];
    let shooting: { x: number; y: number; life: number } | null = null;
    const resize = () => {
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      stars = Array.from({ length: Math.round((innerWidth * innerHeight) / 5200) }, () => ({
        x: Math.random() * w, y: Math.random() * h * 0.9,
        r: (Math.random() * 1.1 + 0.25) * dpr, p: Math.random() * Math.PI * 2, s: 0.5 + Math.random() * 1.5,
      }));
    };
    resize();
    addEventListener("resize", resize);

    const drawStars = (time: number) => {
      g.clearRect(0, 0, w, h);
      g.fillStyle = "#fff4e6";
      for (const s of stars) {
        g.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(s.p + time * 0.0006 * s.s));
        g.beginPath(); g.arc(s.x, s.y, s.r, 0, 6.283); g.fill();
      }
      if (!shooting && !reduceMotion && Math.random() < 0.003) {
        shooting = { x: Math.random() * w * 0.7 + w * 0.2, y: Math.random() * h * 0.3, life: 0 };
      }
      if (shooting) {
        const len = 140 * dpr;
        const px = shooting.x - shooting.life * 9 * dpr, py = shooting.y + shooting.life * 4.5 * dpr;
        const grad = g.createLinearGradient(px, py, px + len, py - len / 2);
        grad.addColorStop(0, "rgba(255,244,230,.9)");
        grad.addColorStop(1, "rgba(255,244,230,0)");
        g.globalAlpha = 1 - shooting.life / 60; g.strokeStyle = grad; g.lineWidth = 1.4 * dpr;
        g.beginPath(); g.moveTo(px, py); g.lineTo(px + len, py - len / 2); g.stroke();
        if (++shooting.life > 60) shooting = null;
      }
      g.globalAlpha = 1;
    };

    // --- apparitions des blocs statiques (.reveal hors composants à état) ---
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".section-title.reveal, .listen .reveal").forEach((el) => io.observe(el));

    // --- bandeau ---
    const marquee = $<HTMLElement>("#marquee");
    let marqueeVisible = true;
    const mio = new IntersectionObserver(([e]) => { marqueeVisible = e.isIntersecting; });
    if (marquee?.parentElement) mio.observe(marquee.parentElement);

    // n'écrit dans le DOM que si la valeur change
    const cache = new WeakMap<HTMLElement, Record<string, string>>();
    const set = (el: HTMLElement | null, prop: string, val: string) => {
      if (!el) return;
      let c = cache.get(el);
      if (!c) cache.set(el, (c = {}));
      if (c[prop] === val) return;
      c[prop] = val;
      el.style.setProperty(prop, val);
    };

    let raf = 0, mx = 0, lastY = scrollY, velocity = 0, level = 0, prevY = -1, prevW = -1, prevHp = 0, starsVisible = false;

    const frame = (time: number) => {
      const y = scrollY, vh = innerHeight;
      const nav = $<HTMLElement>("#nav");
      const hero = $<HTMLElement>("#hero");
      velocity = velocity * 0.85 + (y - lastY) * 0.15;

      if (y !== prevY || innerWidth !== prevW) {
        prevY = y; prevW = innerWidth;
        const p = y / (root.scrollHeight - vh || 1);

        set(dusk, "opacity", smooth(0.04, 0.3, p).toFixed(3));
        set(night, "opacity", smooth(0.3, 0.62, p).toFixed(3));
        set(canvas, "opacity", smooth(0.2, 0.55, p).toFixed(3));
        starsVisible = p > 0.18;

        // accueil : le portrait monte, le nom descend
        if (hero) {
          const hp = clamp(y / hero.offsetHeight);
          if (!reduceMotion && (hp < 1 || prevHp < 1)) {
            set($<HTMLElement>(".hero__portrait"), "translate", `var(--tx) ${(-hp * 14).toFixed(2)}vh`);
            set($<HTMLElement>(".hero__word"), "transform", `translate3d(0, ${(hp * 10).toFixed(2)}vh, 0)`);
          }
          prevHp = hp;
        }

        // nav : se cache en descendant, réapparaît en remontant
        nav?.classList.toggle("is-hidden", y > vh * 0.6 && y > lastY);
        nav?.classList.toggle("is-solid", y > vh * 0.6);
      }
      lastY = y;

      if (marquee && marqueeVisible && !reduceMotion) {
        mx -= 0.6 + Math.abs(velocity) * 0.25;
        const half = marquee.scrollWidth / 2;
        if (-mx > half) mx += half;
        marquee.style.transform = `translate3d(${mx.toFixed(1)}px,0,0)`;
      }

      // son → halos + égaliseur
      const l = playerRef.current.levels();
      if (l || level > 0.002) {
        level += ((l ? l.level : 0) - level) * 0.3;
        if (!l && level < 0.002) level = 0;
        set(root, "--level", level.toFixed(3));
        document.querySelectorAll<HTMLElement>(".player__eq i").forEach((bar, i) =>
          set(bar, "transform", `scaleY(${l ? (0.15 + l.bands[i] * 1.2).toFixed(2) : 0.15})`));
      }

      if (starsVisible) drawStars(time);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      io.disconnect();
      mio.disconnect();
    };
  }, []);

  return (
    <>
      <div className="sky" aria-hidden="true">
        <div className="sky__layer sky__layer--golden" />
        <div className="sky__layer sky__layer--dusk" ref={duskRef} />
        <div className="sky__layer sky__layer--night" ref={nightRef} />
        <canvas className="sky__stars" ref={canvasRef} />
      </div>
      <div className="grain" aria-hidden="true" />
    </>
  );
}
