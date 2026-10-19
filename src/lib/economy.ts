/**
 * Règles d'économie Bonbox, fixées par la plateforme et identiques pour tous.
 * Source : document de cadrage, section « Règles métier ».
 */
export const RARITIES = ["rare", "epic", "legendary"] as const;
export type Rarity = (typeof RARITIES)[number];

/** Couleur de la boîte associée à chaque rareté. */
export const BOX_COLOR: Record<Rarity, "blue" | "purple" | "yellow"> = {
  rare: "blue",
  epic: "purple",
  legendary: "yellow",
};

/** Valeur d'un objet pour le classement : score = cumul de la valeur des objets possédés. */
export const LEADERBOARD_VALUE: Record<Rarity, number> = {
  rare: 10,
  epic: 30,
  legendary: 80,
};

/** Prix d'une boîte mystère en bons points. */
export const MYSTERY_BOX_PRICE: Record<Rarity, number> = {
  rare: 10,
  epic: 30,
  legendary: 80,
};

/** L'achat direct d'un objet précis coûte 1,5 fois la boîte mystère de même rareté. */
export const DIRECT_PURCHASE_MULTIPLIER = 1.5;

export function directPurchasePrice(rarity: Rarity): number {
  return Math.ceil(MYSTERY_BOX_PRICE[rarity] * DIRECT_PURCHASE_MULTIPLIER);
}

export function leaderboardScore(ownedRarities: Rarity[]): number {
  return ownedRarities.reduce((sum, r) => sum + LEADERBOARD_VALUE[r], 0);
}
