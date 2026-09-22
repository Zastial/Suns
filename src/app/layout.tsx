import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  // ✎ mets le vrai domaine dans NEXT_PUBLIC_SITE_URL (utile pour les aperçus de liens)
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Sûns", template: "%s — Sûns" },
  description: "Sûns — GOVA, Anhédonie, Elle aimerait, Rêves. Disponible sur Spotify.",
  openGraph: {
    type: "profile",
    title: "Sûns",
    description: "Nouveau single GOVA, disponible sur Spotify.",
    images: ["/img/artist.jpg"],
    locale: "fr_FR",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#1a1030",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
