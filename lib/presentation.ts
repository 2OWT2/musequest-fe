import {
  newestFirst,
  rarityFor,
  topFirst,
  type Loot,
  type Rarity,
} from "./world.ts";

export type View = "world" | "vault" | "muses";
export type FeedFilters = {
  query: string;
  rarity: Rarity | "all";
  category: string;
  sort: "new" | "top";
};

export function filterLoot(items: Loot[], filters: FeedFilters): Loot[] {
  const query = filters.query.trim().toLowerCase();
  return items
    .filter((item) => {
      const text =
        `${item.title} ${item.description} ${item.ticker} ${item.tokenName}`.toLowerCase();
      return (
        text.includes(query) &&
        (filters.rarity === "all" ||
          rarityFor(item.potentialScore) === filters.rarity) &&
        (filters.category === "all" || item.category === filters.category)
      );
    })
    .sort(filters.sort === "top" ? topFirst : newestFirst);
}

export function relativeTime(value: string, now: number): string {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return "Unknown time";
  const seconds = Math.max(0, Math.floor((now - timestamp) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function fullTime(value: string): string {
  if (!Number.isFinite(Date.parse(value))) return "Unknown time";
  return (
    new Intl.DateTimeFormat("en-GB", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "UTC",
    }).format(new Date(value)) + " UTC"
  );
}

// Category artwork is illustrative, never a photograph of a discovered source.
export function categoryArtwork(category: string): string {
  const name = category.toLowerCase();
  if (/mascot|character/.test(name)) return "/art/mascots.webp";
  if (/technolog|software|hardware|crypto/.test(name))
    return "/art/technology.webp";
  if (/lore|history|historical|culture|internet/.test(name))
    return "/art/lore.webp";
  return "/art/quest-collage.webp";
}
