import Link from "next/link";
import { SpotifyIcon } from "@/components/icons";
import { spotify } from "@/lib/spotify";

export function Nav() {
  return (
    <header className="nav" id="nav">
      <Link href="/#top" className="nav__logo" aria-label="Sûns — accueil">Sûns</Link>
      <nav className="nav__links" aria-label="Navigation principale">
        <Link href="/#discographie">Discographie</Link>
        <Link href="/#ecouter">Écouter</Link>
      </nav>
      <a className="nav__cta" href={spotify.artist} target="_blank" rel="noopener">
        <SpotifyIcon />
        <span>Spotify</span>
      </a>
    </header>
  );
}
