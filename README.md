# Sûns — site officiel

Next.js 16 (App Router, TypeScript, Turbopack). La page d'accueil est pré-rendue en statique.

## Lancer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de production
npm run start
```

## Modifier le contenu

- **Nouvelle sortie** : ajoute une entrée dans `src/data/discography.ts` et mets la pochette dans `public/img/`.
  L'accueil (« Nouveau single »), le bandeau et la discographie se mettent à jour tout seuls.
- **Réseaux sociaux** : liste `.platforms` dans `src/components/site/Listen.tsx`.
- **Domaine** : `NEXT_PUBLIC_SITE_URL` (voir `.env.example`), utilisé pour les aperçus de liens.

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

## Pour la suite (pas encore fait)

Chaque grande zone aura son propre groupe de routes à côté de `(site)`, avec son layout :

- `(fan)/` : espace fan avec connexion (ex. Auth.js ou Clerk) et pages protégées via `src/proxy.ts`
- `boutique/` : merch (ex. Shopify Storefront API ou Stripe Checkout)
- `billetterie/` : dates et billets (ex. lien partenaire, ou Stripe si vente directe)
- `app/api/…` : route handlers (webhooks de paiement, synchro Spotify, etc.)

## Déploiement (Docker)

Le site tourne dans un conteneur, exposé seulement en local sur `127.0.0.1:3100` ; le reverse proxy (Apache) est configuré sur le serveur.

```bash
docker compose up -d --build   # build + lancement (le --build sert pour les mises à jour)
```

Pour changer de domaine : `NEXT_PUBLIC_SITE_URL` dans un fichier `.env` à côté de `docker-compose.yml`, puis `docker compose up -d --build`.
