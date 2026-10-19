# Bonbox : consignes pour Claude

Projet open source (AGPL-3.0) développé par un seul développeur avec l'aide de Claude.
Document de cadrage produit : https://claude.ai/code/artifact/03db5005-1452-4728-98ba-59746bedefe7

## Produit en bref

- Rôles : enfant (6-14 ans), parent, prof (V2). Groupes : famille (MVP), classe (V2).
- Un adulte donne des bons points ou offre une boîte. **Jamais de retrait ni d'annulation de points.**
- Boîtes : bleue = rare, violette = épique, jaune = légendaire. Une boîte garantit toujours sa rareté.
- Un adulte offre une boîte en choisissant la rareté (objet tiré au hasard) ou un objet précis. L'enfant ne voit pas la différence.
- Boutique : achat direct (1,5 × prix boîte mystère) ou boîte mystère (10 / 30 / 80 points). Bons points = objets numériques uniquement.
- Coupons réels : créés par les parents seulement, toujours dans une boîte jaune, marqués « utilisé » par le parent.
- Amis par code ami, validés par un parent de chaque enfant. Échanges un contre un, même rareté, validés par les deux parents.
- Classement : score = somme des objets possédés (rare 10, épique 30, légendaire 80). Masquable par parent / groupe.

## Règles techniques

- Règles d'économie centralisées dans `src/lib/economy.ts` : ne jamais coder un prix ou une valeur en dur ailleurs.
- Le contenu d'une boîte est décidé côté serveur à la création (`box.item_id`), jamais à l'ouverture côté client.
- Le solde des points est la somme de `point_ledger` ; on n'écrit jamais de solde.
- Toute action d'un enfant envers un autre enfant passe par une validation parentale.
- Textes de l'interface dans `messages/fr.json` et `messages/en.json` (next-intl), jamais en dur dans les composants.
- Base : Drizzle + Neon. Après une modification de `src/db/schema.ts` : `npm run db:generate` puis `npm run db:migrate`.
- Auth : Better Auth (`src/lib/auth.ts`), plugins username et passkey. Les enfants n'ont pas d'email réel.
- Langue du code : identifiants en anglais, commentaires et textes produit en français.
