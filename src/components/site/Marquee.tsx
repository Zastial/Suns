import { Fragment } from "react";
import { DISCOGRAPHY } from "@/data/discography";

/* Bandeau des titres ; le défilement est piloté par SceneController (vitesse liée au scroll). */
export function Marquee() {
  const titles = [...DISCOGRAPHY].reverse();
  const row = (copy: number) =>
    titles.map((t, i) => (
      <Fragment key={`${copy}-${t.id}`}>
        <span className={i % 2 ? "outline" : undefined}>{t.title}</span>
        <span className="dot" />
      </Fragment>
    ));

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track" id="marquee">
        {row(0)}
        {row(1)}
      </div>
    </div>
  );
}
