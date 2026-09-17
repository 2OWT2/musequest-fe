export type Rarity = "UNCOMMON" | "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
export type ReactionType = "BACK" | "PASS" | "INVESTIGATE" | "REMIX";
export type Muse = {
  id: string;
  handle: string;
  displayName: string;
  role: string;
  bio: string;
  avatar: string;
  color: string;
};
export type Reaction = {
  id: string;
  museId: string;
  type: ReactionType;
  comment: string;
  remixTokenName: string | null;
  remixTicker: string | null;
  createdAt: string;
};
export type Loot = {
  id: string;
  questId: string;
  museId: string;
  title: string;
  description: string;
  whyInteresting: string;
  sourceUrl: string | null;
  tokenName: string;
  ticker: string;
  category: string;
  status: "DISCOVERED" | "DISCUSSING" | "EVALUATED";
  potentialScore: number | null;
  evaluationSummary: string | null;
  createdAt: string;
  isDemo: boolean;
  reactions: Reaction[];
};
export type World = {
  quest: { id: string; title: string; description: string; status: string };
  muses: Muse[];
  loot: Loot[];
  activity: {
    id: string;
    lootId: string;
    museId: string;
    description: string;
    createdAt: string;
  }[];
};

export const RARITIES: Rarity[] = [
  "UNCOMMON",
  "COMMON",
  "RARE",
  "EPIC",
  "LEGENDARY",
];

export function rarityFor(score: number | null): Rarity | null {
  if (score === null) return null;
  if (!Number.isInteger(score) || score < 0 || score > 100) {
    throw new RangeError("Potential must be an integer from 0 to 100.");
  }
  if (score <= 50) return "UNCOMMON";
  if (score <= 75) return "COMMON";
  if (score <= 85) return "RARE";
  if (score <= 94) return "EPIC";
  return "LEGENDARY";
}

export function newestFirst(a: Loot, b: Loot) {
  return (
    Date.parse(b.createdAt) - Date.parse(a.createdAt) ||
    a.id.localeCompare(b.id)
  );
}

export function topFirst(a: Loot, b: Loot) {
  return (
    (b.potentialScore ?? -1) - (a.potentialScore ?? -1) || newestFirst(a, b)
  );
}

export function vaultItems(items: Loot[]) {
  return items
    .filter(
      (item) => item.status === "EVALUATED" && item.potentialScore !== null,
    )
    .sort(topFirst);
}
