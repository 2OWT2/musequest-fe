"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./icons";
import { QuestHeader, QuestHero, QuestNavigation } from "./quest-shell";
import { QuestFeed } from "./quest-feed";
import { QuestSidebar } from "./quest-sidebar";
import { vaultItems, type World } from "@/lib/world";
import { filterLoot, type FeedFilters, type View } from "@/lib/presentation";

const initialFilters: FeedFilters = {
  query: "",
  rarity: "all",
  category: "all",
  sort: "top",
};

function moveTo(id: string) {
  window.requestAnimationFrame(() => {
    const target = document.getElementById(id);
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  });
}

export default function QuestBoard({
  initialWorld,
  connected,
}: {
  initialWorld: World;
  connected: boolean;
}) {
  const [world, setWorld] = useState<World | null>(
    connected ? null : initialWorld,
  );
  const [view, setView] = useState<View>("world");
  const [filters, setFilters] = useState<FeedFilters>(initialFilters);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(connected);
  const [now, setNow] = useState<number | null>(null);
  const request = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch("/api/world", {
        signal: controller.signal,
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Connection failed");
      const data = (await response.json()) as World;
      if (
        !data.quest ||
        !Array.isArray(data.muses) ||
        !Array.isArray(data.loot) ||
        !Array.isArray(data.activity)
      )
        throw new Error("Invalid response");
      if (request.current !== controller) return;
      setWorld(data);
      setError(null);
    } catch {
      if (request.current === controller)
        setError(
          "We couldn’t reach the quest. Please retry. Any discoveries already shown are from the last successful refresh.",
        );
    } finally {
      window.clearTimeout(timeout);
      if (request.current === controller) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) setNow(Date.now());
    });
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!connected) return;
    let active = true;
    queueMicrotask(() => {
      if (active) void refresh();
    });
    const timer = window.setInterval(() => void refresh(), 15000);
    return () => {
      active = false;
      window.clearInterval(timer);
      request.current?.abort();
      request.current = null;
    };
  }, [connected, refresh]);

  const muses = world?.muses ?? [];
  const loot = world?.loot ?? [];
  const vault = vaultItems(loot);
  const matching = filterLoot(view === "vault" ? vault : loot, {
    ...filters,
    sort: view === "vault" ? "top" : filters.sort,
  });
  const categories = [
    ...new Set(
      loot
        .map((item) => item.category)
        .concat(filters.category === "all" ? [] : [filters.category]),
    ),
  ].sort();
  const sampleMode =
    !connected || (loot.length > 0 && loot.every((item) => item.isDemo));
  const selectView = (next: View, scroll = true) => {
    setView(next);
    setFilters((current) => ({ ...initialFilters, sort: current.sort }));
    if (scroll) moveTo("discoveries");
  };
  const openLoot = (id: string) => {
    setView("world");
    setFilters((current) => ({ ...initialFilters, sort: current.sort }));
    setExpanded((current) =>
      current.includes(id) ? current : [...current, id],
    );
    moveTo(id);
  };
  const statusLabel = sampleMode
    ? "Sample preview"
    : !world
      ? "Connecting"
      : world.loop?.running
        ? "Muses at work"
        : world.loop?.paused
          ? "Quest paused"
          : "Quest board";
  const phases: Record<string, string> = {
    QUERIES: "A Muse is planning its search.",
    SEARCHING: "A Muse is searching for a new discovery.",
    SELECTING: "A Muse is reviewing its sources.",
    DISCUSSING: "The Muses are discussing a discovery.",
    EVALUATING: "The Muses are finishing their verdict.",
  };
  const statusCopy = !world
    ? "Gathering discoveries and Muse discussions."
    : world.loop?.running
      ? (phases[world.loop.phase] ?? "The Muses are working on a discovery.")
      : world.loop?.paused
        ? world.loop.phase === "STOPPED"
          ? "A round stopped before completion. Saved work is preserved; automatic discovery is paused."
          : "Automatic discovery is paused. Explore the saved discoveries below."
        : world.loop
          ? "Five Muses are queued for the next discovery cycle."
          : "Explore discoveries and follow the Muse discussions.";

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to discoveries
      </a>
      <QuestHeader
        query={filters.query}
        onQuery={(query) => {
          setFilters((current) => ({ ...current, query }));
          if (view === "muses") setView("world");
        }}
        onHome={() => {
          selectView("world", false);
          window.scrollTo({ top: 0 });
        }}
      />
      <div className="app-layout">
        <QuestNavigation
          view={view}
          muses={muses}
          count={world ? loot.length : null}
          onSelect={selectView}
        />
        <main id="main-content" className="main-column" tabIndex={-1}>
          <QuestHero
            muses={muses}
            onExplore={() => selectView("world")}
            onAbout={() => selectView("muses")}
          />
          <div className="preview-notice">
            <span
              className={`live-label ${world?.loop?.running ? "working" : ""}`}
            >
              <span className="status-dot" />
              {statusLabel}
            </span>
            <p>
              {sampleMode ? (
                <>Illustrative sample discoveries, not live research.</>
              ) : (
                statusCopy
              )}
            </p>
            {connected && (
              <button
                className="icon-button"
                onClick={() => void refresh()}
                disabled={loading}
                aria-label="Refresh discoveries"
              >
                <Icon name="refresh" size={17} />
              </button>
            )}
          </div>
          {error && (
            <div className="connection-error" role="alert">
              <p>{error}</p>
              <button
                className="button button-outline"
                onClick={() => void refresh()}
                disabled={loading}
              >
                {loading ? "Retrying…" : "Retry connection"}
              </button>
            </div>
          )}
          <QuestFeed
            view={view}
            muses={muses}
            loot={loot}
            matching={matching}
            filters={filters}
            categories={categories}
            expanded={expanded}
            loading={loading}
            hasWorld={Boolean(world)}
            now={now}
            onFilters={(value) =>
              setFilters((current) => ({ ...current, ...value }))
            }
            onToggle={(id) =>
              setExpanded((current) =>
                current.includes(id)
                  ? current.filter((value) => value !== id)
                  : [...current, id],
              )
            }
            onClear={() =>
              setFilters((current) => ({
                ...initialFilters,
                sort: current.sort,
              }))
            }
          />
          <p className="feed-footnote">
            <Icon name="sparkle" size={17} />A score is a little conviction, not
            a price prediction.
          </p>
        </main>
        <QuestSidebar
          world={world}
          vault={vault}
          sampleMode={sampleMode}
          now={now}
          onExplore={() => selectView("world")}
          onVault={() => selectView("vault")}
          onLoot={openLoot}
        />
      </div>
    </>
  );
}
