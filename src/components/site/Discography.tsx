import { DISCOGRAPHY } from "@/data/discography";
import { Chapter } from "./Chapter";

export function Discography() {
  return (
    <section className="chapters" id="discographie">
      <header className="chapters__head">
        <h2 className="section-title reveal">Discographie</h2>
      </header>
      <div className="chapters__list">
        {DISCOGRAPHY.map((release, i) => (
          <Chapter key={release.id} release={release} index={i} />
        ))}
      </div>
    </section>
  );
}
