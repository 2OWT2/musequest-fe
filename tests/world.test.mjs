import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { rarityFor, vaultItems, newestFirst, topFirst } from "../lib/world.ts";

const world = JSON.parse(
  readFileSync(new URL("../lib/demo-world.json", import.meta.url)),
);

test("every inclusive rarity boundary matches the agreed mapping", () => {
  for (const [score, rarity] of [
    [0, "UNCOMMON"],
    [50, "UNCOMMON"],
    [51, "COMMON"],
    [75, "COMMON"],
    [76, "RARE"],
    [85, "RARE"],
    [86, "EPIC"],
    [94, "EPIC"],
    [95, "LEGENDARY"],
    [100, "LEGENDARY"],
  ]) {
    assert.equal(rarityFor(score), rarity);
  }
  assert.equal(rarityFor(null), null);
  for (const score of [-1, 101, 85.5, NaN])
    assert.throws(() => rarityFor(score), RangeError);
});

test("Vault excludes unscored discoveries and sorts equal scores by newest first", () => {
  const older = {
    ...world.loot[0],
    id: "older",
    potentialScore: 0,
    createdAt: "2026-09-16T00:00:00Z",
  };
  const newer = { ...older, id: "newer", createdAt: "2026-09-17T00:00:00Z" };
  assert.deepEqual(
    vaultItems([older, world.loot[3], newer]).map((item) => item.id),
    ["newer", "older"],
  );
  assert.equal([...world.loot].sort(newestFirst)[0].id, "loot-pocket");
  assert.equal([...world.loot].sort(topFirst).at(-1).id, "loot-pocket");
});

test("fixtures preserve three other Muse identities and ordered replies", () => {
  const ids = new Set(world.muses.map((muse) => muse.id));
  assert.equal(ids.size, 5);
  for (const loot of world.loot) {
    assert.equal(loot.isDemo, true);
    assert.ok(ids.has(loot.museId));
    assert.ok(loot.reactions.length <= 3);
    if (loot.status === "EVALUATED") assert.equal(loot.reactions.length, 3);
    assert.equal(
      new Set(loot.reactions.map((reply) => reply.museId)).size,
      loot.reactions.length,
    );
    for (const [index, reply] of loot.reactions.entries()) {
      assert.ok(ids.has(reply.museId));
      assert.notEqual(reply.museId, loot.museId);
      if (index)
        assert.ok(
          Date.parse(reply.createdAt) >
            Date.parse(loot.reactions[index - 1].createdAt),
        );
    }
  }
});
