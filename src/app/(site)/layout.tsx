import { PlayerProvider } from "@/components/player/PlayerProvider";
import { MiniPlayer } from "@/components/player/MiniPlayer";
import { SkyScene } from "@/components/site/SkyScene";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

/* Habillage du site public (vitrine). Les futures zones — espace fan, boutique, billetterie —
   pourront avoir leur propre groupe de routes et leur propre layout à côté de (site). */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <PlayerProvider>
      <SkyScene />
      <Nav />
      {children}
      <Footer />
      <MiniPlayer />
    </PlayerProvider>
  );
}
