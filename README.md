# Sûns — site officiel

Next.js 16 (App Router, TypeScript, Turbopack). La page d'accueil est pré-rendue en statique.

## Lancer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de production
npm run start
```

## Structure

```
src/
  app/
    layout.tsx            racine : polices (next/font), métadonnées
    globals.css           styles
    icon.svg              favicon
    (site)/               vitrine publique
      layout.tsx          ciel, nav, footer, lecteur
      page.tsx            accueil
  components/
    player/               lecteur d'extraits (contexte React + mini-lecteur)
    site/                 sections de la page
  data/discography.ts     sorties
  lib/                    helpers (liens Spotify, useInView)
_archive/static-v1/       ancienne version HTML/CSS/JS (référence)
```
