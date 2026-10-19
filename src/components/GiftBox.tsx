import type { Rarity } from "@/lib/economy";

const COLORS: Record<Rarity, { body: string; lid: string; ribbon: string }> = {
  rare: { body: "#2563eb", lid: "#3b82f6", ribbon: "#bfdbfe" },
  epic: { body: "#7e22ce", lid: "#a855f7", ribbon: "#f5d0fe" },
  legendary: { body: "#eab308", lid: "#facc15", ribbon: "#fff7ae" },
};

/** Boîte cadeau en SVG, couleur selon la rareté (bleu, violet, jaune). */
export function GiftBox({ rarity, size = 120 }: { rarity: Rarity; size?: number }) {
  const c = COLORS[rarity];
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={rarity}>
      <rect x="18" y="52" width="84" height="56" rx="8" fill={c.body} />
      <rect x="12" y="36" width="96" height="22" rx="7" fill={c.lid} />
      <rect x="54" y="36" width="12" height="72" fill={c.ribbon} />
      <path d="M60 36c-10-18-30-18-30-5 0 8 15 8 30 5zM60 36c10-18 30-18 30-5 0 8-15 8-30 5z" fill={c.ribbon} />
    </svg>
  );
}
