/* ✎ Discographie — ajoute tes prochaines sorties ici (ordre chronologique).
   Les IDs viennent des liens Spotify : open.spotify.com/album/<albumId>, /track/<trackId>.
   La pochette va dans public/img/. */

export type Release = {
  id: string;
  title: string;
  line: string;
  date: string;
  duration: string;
  feat?: string;
  isNew?: boolean;
  accent: string;
  cover: string;
  albumId: string;
  trackId: string;
  preview: string;
};

export const DISCOGRAPHY: Release[] = [
  {
    id: "reves",
    title: "Rêves",
    line: "Tout devient flou, même ce qu'on a perdu.",
    date: "18.10.2024",
    duration: "2:00",
    feat: "Mrshm",
    accent: "#bdb6ae",
    cover: "/img/reves.jpg",
    albumId: "0p2e4GMXmwOfRYvOFhkNJr",
    trackId: "0MtgLcoEsjNUIRcLFZVmo1",
    preview: "https://p.scdn.co/mp3-preview/6096dd13fc4dc2530cb7ea55948f12be166d3d0a",
  },
  {
    id: "elle-aimerait",
    title: "Elle aimerait",
    line: "Le ciel devient orange, elle regarde ailleurs.",
    date: "06.10.2025",
    duration: "3:29",
    feat: "Mrshm",
    accent: "#f29a6b",
    cover: "/img/elle-aimerait.jpg",
    albumId: "6HYJgUSXUFJ2hnB5VqSCtC",
    trackId: "6MnOziyoON0USkWpNzHaoF",
    preview: "https://p.scdn.co/mp3-preview/f9cadedcdf006146dce0846ac10a8905cbba54ad",
  },
  {
    id: "anhedonie",
    title: "Anhédonie",
    line: "Les lumières défilent, rien ne s'arrête vraiment.",
    date: "17.10.2025",
    duration: "3:54",
    feat: "Mrshm",
    accent: "#e2403f",
    cover: "/img/anhedonie.jpg",
    albumId: "789oRU0wRvpEJCuAO8xYiS",
    trackId: "1b6aEi80Bcnl7Ovmpvko8H",
    preview: "https://p.scdn.co/mp3-preview/071b0a2562ac4cfbe742fe35a4418a1b3ef0026e",
  },
  {
    id: "gova",
    title: "GOVA",
    line: "Moteur froid, cœur chaud.",
    date: "09.02.2026",
    duration: "2:25",
    isNew: true,
    accent: "#b04dff",
    cover: "/img/gova.jpg",
    albumId: "51TVOf6wovY39d2jxb3tYI",
    trackId: "1wMYpBLSWBAJbz3GnDU1Kk",
    preview: "https://p.scdn.co/mp3-preview/c8a0db8c9659f9c252cd2a800b26454a4fdc1e95",
  },
];

export const LATEST = DISCOGRAPHY[DISCOGRAPHY.length - 1];
