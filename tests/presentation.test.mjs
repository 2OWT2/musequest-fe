import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import {
  categoryArtwork,
  filterLoot,
  fullTime,
  relativeTime,
} from "../lib/presentation.ts";

const world = JSON.parse(
  readFileSync(new URL("../lib/demo-world.json", import.meta.url)),
);
const defaults = { query: "", rarity: "all", category: "all", sort: "top" };

test("search, category, and rarity are intersected without mutating source data", () => {
  const before = structuredClone(world.loot);
  const item = world.loot[0];
  assert.deepEqual(
    filterLoot(world.loot, {
      ...defaults,
      query: `  ${item.ticker.toLowerCase()}  `,
      category: item.category,
      rarity: "LEGENDARY",
    }).map((value) => value.id),
    [item.id],
  );
  assert.equal(
    filterLoot(world.loot, {
      ...defaults,
      query: item.ticker,
      category: "Lost technology",
    }).length,
    0,
  );
  assert.equal(
    filterLoot(world.loot, {
      ...defaults,
      query: item.ticker,
      rarity: "UNCOMMON",
    }).length,
    0,
  );
  assert.equal(filterLoot(world.loot, defaults).length, world.loot.length);
  assert.equal(
    filterLoot(world.loot, { ...defaults, query: "No such discovery" }).length,
    0,
  );
  assert.deepEqual(world.loot, before);
});

test("filtered results retain score and newest ordering including pending scores", () => {
  assert.equal(filterLoot(world.loot, defaults)[0].id, "loot-musebot");
  assert.equal(filterLoot(world.loot, defaults).at(-1).potentialScore, null);
  assert.equal(
    filterLoot(world.loot, { ...defaults, sort: "new" })[0].id,
    "loot-pocket",
  );
});

test("relative timestamps cover boundaries, future clocks and invalid dates", () => {
  const now = Date.parse("2026-09-17T12:00:00Z");
  const age = (seconds) =>
    relativeTime(new Date(now - seconds * 1000).toISOString(), now);
  for (const [seconds, expected] of [
    [-10, "just now"],
    [0, "just now"],
    [59, "just now"],
    [60, "1 minute ago"],
    [120, "2 minutes ago"],
    [3599, "59 minutes ago"],
    [3600, "1 hour ago"],
    [7200, "2 hours ago"],
    [86399, "23 hours ago"],
    [86400, "1 day ago"],
    [172800, "2 days ago"],
  ])
    assert.equal(age(seconds), expected);
  assert.equal(relativeTime("invalid", now), "Unknown time");
  assert.equal(fullTime("invalid"), "Unknown time");
  assert.match(
    fullTime("2026-09-17T12:00:00Z"),
    /17 September 2026.*12:00 UTC/,
  );
});

test("illustrative category mapping supports casing and unknown categories", () => {
  assert.equal(categoryArtwork("FORGOTTEN MASCOTS"), "/art/mascots.webp");
  assert.equal(categoryArtwork("Lost technology"), "/art/technology.webp");
  assert.equal(categoryArtwork("Internet lore"), "/art/lore.webp");
  assert.equal(
    categoryArtwork("An unseen category"),
    "/art/quest-collage.webp",
  );
});
