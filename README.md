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
- [Neon](https://neon.tech) (Postgres serverless) + [Drizzle ORM](https://orm.drizzle.team)
- [Better Auth](https://www.better-auth.com) : email ou identifiant + mot de passe, déverrouillage biométrique par passkey
- [next-intl](https://next-intl.dev) : français et anglais
- Déploiement sur [Railway](https://railway.com)

## Démarrer en local

```bash
npm install
cp .env.example .env.local   # puis renseignez DATABASE_URL et BETTER_AUTH_SECRET
npm run db:migrate           # crée les tables dans Neon
npm run dev                  # http://localhost:3000
```

## Scripts

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` / `npm start` | Build et serveur de production |
| `npm run db:generate` | Génère une migration après modification de `src/db/schema.ts` |
| `npm run db:migrate` | Applique les migrations sur la base |
| `npm run db:studio` | Explorateur de base Drizzle Studio |

## Licence

[AGPL-3.0](LICENSE) : toute instance modifiée et mise en ligne doit publier son code source.
