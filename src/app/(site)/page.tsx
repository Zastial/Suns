import { Loader } from "@/components/site/Loader";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Discography } from "@/components/site/Discography";
import { Listen } from "@/components/site/Listen";

export default function HomePage() {
  return (
    <>
      <Loader />
      <main id="top">
        <Hero />
        <Marquee />
        <Discography />
        <Listen />
      </main>
    </>
  );
}
