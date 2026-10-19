# Bonbox

**Les bons points de l'école, version coffre au trésor.**

Bonbox est une application web installable (PWA) qui permet aux parents (et bientôt aux profs) de récompenser les efforts des enfants de 6 à 14 ans : bons points, boîtes à ouvrir, avatar à équiper, album à compléter, échanges entre amis et coupons pour de vraies récompenses.

Gratuit, sans publicité, open source (AGPL-3.0).

## Raretés

| Rareté | Boîte | Valeur au classement | Boîte mystère |
| --- | --- | --- | --- |
| Rare | Bleue | 10 | 10 bons points |
| Épique | Violette | 30 | 30 bons points |
| Légendaire | Jaune | 80 | 80 bons points |

Un coupon réel (livre, sortie, bonbons…) offert par un parent arrive toujours dans une boîte jaune.

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript) + Tailwind CSS
- Postgres : Docker en local, [Neon](https://neon.tech) en production, via [Drizzle ORM](https://orm.drizzle.team)
- [Better Auth](https://www.better-auth.com) : email ou identifiant + mot de passe, déverrouillage biométrique par passkey
- [next-intl](https://next-intl.dev) : français et anglais
- Déploiement sur [Railway](https://railway.com)

## Démarrer en local (Windows, macOS, Linux)

Prérequis : [Node.js 22+](https://nodejs.org) et [Docker Desktop](https://www.docker.com/products/docker-desktop/) lancé.

```bash
npm install
npm run local    # démarre Postgres + pgAdmin (Docker), crée les tables, lance l'app sur http://localhost:3000
```

Sans fichier `.env.local`, l'app utilise les valeurs locales par défaut (base Docker, `http://localhost:3000`).
Pour les personnaliser : copiez `.env.example` en `.env.local`.

### Base de données locale

| Service | Adresse | Identifiants |
| --- | --- | --- |
| Postgres | `localhost:5432`, base `bonbox` | `bonbox` / `bonbox` |
| pgAdmin | http://localhost:5050 | aucun (mode bureau) ; serveur « Bonbox (local) » déjà configuré |

Pour vous connecter depuis un pgAdmin installé sur votre poste (hors Docker) : hôte `localhost`, port `5432`, base `bonbox`, utilisateur `bonbox`, mot de passe `bonbox`.

## Scripts

| Commande | Rôle |
| --- | --- |
| `npm run local` | Tout en un : base Docker, migrations, serveur de développement |
| `npm run setup` | Démarre la base Docker et applique les migrations |
| `npm run dev` | Serveur de développement |
| `npm run build` / `npm start` | Build et serveur de production |
| `npm run db:up` / `npm run db:down` | Démarre / arrête Postgres et pgAdmin |
| `npm run db:generate` | Génère une migration après modification de `src/db/schema.ts` |
| `npm run db:migrate` | Applique les migrations sur la base |
| `npm run db:studio` | Explorateur de base Drizzle Studio |

## Licence

[AGPL-3.0](LICENSE) : toute instance modifiée et mise en ligne doit publier son code source.
