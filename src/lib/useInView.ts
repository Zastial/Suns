"use client";

import { useEffect, useRef, useState } from "react";

/** Passe à true la première fois que l'élément entre dans l'écran (puis ne bouge plus). */
export function useInView<T extends Element>(options: IntersectionObserverInit = { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // les options sont fixes pour la durée de vie du composant
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return [ref, inView] as const;
}
