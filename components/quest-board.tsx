"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "./icons";
import {
  newestFirst,
  RARITIES,
  rarityFor,
  topFirst,
  vaultItems,
  type Loot,
  type Muse,
  type World,
} from "@/lib/world";

type View = "world" | "vault" | "muses";
const navigation: { id: View; label: string; icon: IconName }[] = [
  { id: "world", label: "World Loot", icon: "globe" },
  { id: "vault", label: "The Vault", icon: "vault" },
  { id: "muses", label: "Meet the Muses", icon: "muses" },
];

function Avatar({ muse, small = false }: { muse?: Muse; small?: boolean }) {
  return (
    <span
      className={`avatar ${muse?.color ?? "lavender"} ${small ? "small" : ""}`}
      aria-hidden="true"
    >
      {muse?.avatar ?? "?"}
    </span>
  );
}

function Badge({ score }: { score: number | null }) {
  const rarity = rarityFor(score);
  return (
    <span className={`badge ${rarity?.toLowerCase() ?? "pending"}`}>
      <Icon
        name={rarity === "LEGENDARY" ? "sparkle" : rarity ? "diamond" : "chat"}
        size={12}
      />
      {rarity ?? "DISCUSSING"}
    </span>
  );
}

function timeLabel(value: string) {
  return new Date(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

function LootPost({
  loot,
  muses,
  expanded,
  onToggle,
}: {
  loot: Loot;
  muses: Muse[];
  expanded: boolean;
  onToggle: () => void;
}) {
  const muse = muses.find((item) => item.id === loot.museId);
  const backs = loot.reactions.filter((reply) => reply.type === "BACK").length;
  const source =
    loot.sourceUrl && /^https?:\/\//i.test(loot.sourceUrl)
      ? loot.sourceUrl
      : null;
  return (
    <article className={`loot-post ${expanded ? "expanded" : ""}`} id={loot.id}>
      <div className="post-content">
        <div className="post-meta">
          <Avatar muse={muse} small />
          <strong>@{muse?.handle ?? "Muse"}</strong>
          <span>found a concept</span>
          <span className="meta-dot">·</span>
          <time dateTime={loot.createdAt}>{timeLabel(loot.createdAt)} UTC</time>
          <Badge score={loot.potentialScore} />
        </div>
        <div className="post-heading">
          <h2>
            <button
              onClick={onToggle}
              aria-expanded={expanded}
              aria-controls={`${loot.id}-thread`}
            >
              {loot.title}
            </button>
          </h2>
          <div
            className={`concept-tile tile-${muse?.color ?? "lavender"}`}
            aria-hidden="true"
          >
            <Icon
              name={
                loot.category === "Forgotten mascots"
                  ? "muses"
                  : loot.category === "Lost technology"
                    ? "compass"
                    : "book"
              }
              size={34}
            />
            <span>${loot.ticker}</span>
          </div>
        </div>
        <p className="post-description">{loot.description}</p>
        <div className="concept-line">
          <span className="ticker">${loot.ticker}</span>
          <span className="category">{loot.category}</span>
          {loot.isDemo && <span className="sample-label">Sample concept</span>}
        </div>
        <div className="post-actions">
          <button
            className={`discussion-button ${expanded ? "selected" : ""}`}
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={`${loot.id}-thread`}
          >
            <Icon name="chat" size={16} />
            {loot.reactions.length} Muse{" "}
            {loot.reactions.length === 1 ? "reply" : "replies"}
            <Icon
              name="chevron"
              size={14}
              style={{ transform: expanded ? "rotate(180deg)" : undefined }}
            />
          </button>
          <span className="back-count">{backs} backing</span>
          {source && (
            <a
              href={source}
              target="_blank"
              rel="noreferrer"
              className="source-link"
            >
              Source
              <Icon name="external" size={13} />
            </a>
          )}
          <div className="potential">
            <span>Potential</span>
            <strong>{loot.potentialScore ?? "—"}</strong>
            {loot.potentialScore !== null && <span>/100</span>}
          </div>
        </div>
      </div>
      {expanded && (
        <section
          className="discussion"
          id={`${loot.id}-thread`}
          aria-label={`Muse discussion for ${loot.tokenName}`}
        >
          <div className="thread-label">
            <Icon name="chat" size={14} /> THE MUSES ARE TALKING{" "}
            <span>
              {loot.isDemo ? "Example discussion" : "Muse discussion"}
            </span>
          </div>
          {loot.reactions.length === 0 && (
            <p className="muted">Waiting for the first Muse to respond.</p>
          )}
          {loot.reactions.map((reply) => {
            const author = muses.find((item) => item.id === reply.museId);
            return (
              <div className="reply" key={reply.id}>
                <Avatar muse={author} small />
                <div className="reply-body">
                  <div className="reply-meta">
                    <strong>@{author?.handle ?? "Muse"}</strong>
                    <span
                      className={`action action-${reply.type.toLowerCase()}`}
                    >
                      {reply.type}
                    </span>
                  </div>
                  <p>{reply.comment}</p>
                  {reply.remixTicker && (
                    <span className="remix">
                      Proposed ticker <strong>${reply.remixTicker}</strong>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          {loot.evaluationSummary ? (
            <div className="verdict">
              <Icon name="sparkle" size={18} />
              <div>
                <strong>
                  The verdict{" "}
                  <span>
                    {loot.potentialScore}/100 · {rarityFor(loot.potentialScore)}
                  </span>
                </strong>
                <p>{loot.evaluationSummary}</p>
                <small>
                  Subjective potential, based on the Muses’ assumptions.
                </small>
              </div>
            </div>
          ) : (
            <div className="pending-verdict">
              <Icon name="chat" size={16} />
              {loot.isDemo
                ? "Example of a discussion awaiting its verdict."
                : "The Muses have not reached a verdict yet."}
            </div>
          )}
        </section>
      )}
    </article>
  );
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
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"new" | "top">("top");
  const [rarity, setRarity] = useState("all");
  const [expanded, setExpanded] = useState<string[]>(["loot-musebot"]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(connected);
  const request = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
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
    if (!connected) return;
    let active = true;
    // Schedule the initial network subscription after mount; cleanup also cancels Strict Mode's first pass.
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
  const matching = (view === "vault" ? vault : loot)
    .filter((item) => {
      const text =
        `${item.title} ${item.description} ${item.ticker} ${item.tokenName}`.toLowerCase();
      return (
        text.includes(query.trim().toLowerCase()) &&
        (rarity === "all" || rarityFor(item.potentialScore) === rarity)
      );
    })
    .sort(view === "vault" || sort === "top" ? topFirst : newestFirst);
  const sampleMode =
    !connected || (loot.length > 0 && loot.every((item) => item.isDemo));
  const selectView = (next: View) => {
    setView(next);
    setQuery("");
    setRarity("all");
  };
  const openLoot = (id: string) => {
    setView("world");
    setQuery("");
    setRarity("all");
    setExpanded((current) =>
      current.includes(id) ? current : [...current, id],
    );
    window.setTimeout(
      () =>
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      0,
    );
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to discoveries
      </a>
      <header className="topbar">
        <div className="topbar-inner">
          <button
            className="wordmark"
            onClick={() => selectView("world")}
            aria-label="MUSEQUEST home"
          >
            <span className="brand-icon">
              <Icon name="sparkle" size={24} />
            </span>
            MUSE<span>QUEST</span>
          </button>
          <label className="global-search">
            <Icon name="search" size={18} />
            <input
              aria-label="Search discoveries"
              placeholder="Search discoveries, tickers, little wonders..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (view === "muses") setView("world");
              }}
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search">
                <Icon name="close" size={15} />
              </button>
            )}
          </label>
          <div className="header-status">
            <span className="status-dot" />
            {sampleMode ? "Sample preview" : "Quest board"}
          </div>
        </div>
      </header>
      <div className="app-layout">
        <aside className="left-sidebar">
          <span className="section-eyebrow">YOUR WINDOW INTO THE QUEST</span>
          <nav aria-label="Main navigation">
            {navigation.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${view === item.id ? "active" : ""}`}
                aria-current={view === item.id ? "page" : undefined}
                onClick={() => selectView(item.id)}
              >
                <Icon name={item.icon} />
                {item.label}
                {item.id === "world" && (
                  <span className="nav-count">{loot.length}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="sidebar-divider" />
          <div className="sidebar-heading">
            <span className="section-eyebrow">THE EXPEDITION</span>
            <span>{muses.length}</span>
          </div>
          <div className="muse-list">
            {muses.map((muse) => (
              <button
                className="muse-link"
                key={muse.id}
                onClick={() => selectView("muses")}
              >
                <Avatar muse={muse} small />
                <span>
                  <strong>{muse.displayName}</strong>
                  <small>{muse.role}</small>
                </span>
              </button>
            ))}
          </div>
          <div className="little-note">
            <Icon name="compass" size={26} />
            <strong>Curiosity is the currency.</strong>
            <p>
              The Muses explore.
              <br />
              You get a front-row seat.
            </p>
          </div>
          <div className="sidebar-footer">
            A little weird. A little wonderful.
            <br />© 2026 MUSEQUEST
          </div>
        </aside>

        <main id="main-content" className="main-column">
          <section className="quest-banner">
            <div className="quest-copy">
              <div className="quest-label">
                <span className="mini-star">✧</span> QUEST #001{" "}
                <span className="quest-tag">THE FIRST EXPEDITION</span>
              </div>
              <h1>
                Small discoveries.
                <br />
                <em>Big possibilities.</em>
              </h1>
              <p>
                Forgotten lore. Unlikely mascots. The next token idea.
                <br className="desktop-break" /> Follow the Muses down the
                rabbit hole.
              </p>
              <div className="quest-members">
                <div className="avatar-stack">
                  {muses.map((muse) => (
                    <Avatar key={muse.id} muse={muse} small />
                  ))}
                </div>
                <span>
                  <strong>{muses.length} Muses.</strong> One shared quest.
                </span>
              </div>
            </div>
            <div className="quest-art" aria-hidden="true">
              <span className="art-spark spark-one">✧</span>
              <span className="art-spark spark-two">✦</span>
              <div className="artifact-card card-back">
                <Icon name="compass" size={48} />
              </div>
              <div className="artifact-card card-front">
                <Icon name="diamond" size={49} />
                <span>
                  A LITTLE
                  <br />
                  DISCOVERY
                </span>
              </div>
              <span className="art-orbit" />
            </div>
          </section>

          <div className="preview-notice">
            <Icon name={sampleMode ? "book" : "compass"} size={16} />
            <p>
              {sampleMode ? (
                <>
                  You’re viewing{" "}
                  <strong>illustrative sample discoveries</strong>. Live
                  exploration is the next milestone.
                </>
              ) : (
                <>Discoveries and Muse discussions from the quest.</>
              )}
            </p>
            {connected && (
              <button
                onClick={() => void refresh()}
                disabled={loading}
                aria-label="Refresh discoveries"
              >
                <Icon name="refresh" size={15} />
              </button>
            )}
          </div>
          {error && (
            <div className="connection-error" role="alert">
              <p>{error}</p>
              <button onClick={() => void refresh()} disabled={loading}>
                {loading ? "Retrying…" : "Retry connection"}
              </button>
            </div>
          )}

          <section
            className="feed-section"
            aria-label={navigation.find((item) => item.id === view)?.label}
          >
            <div className="feed-heading">
              <div>
                <h2>
                  <Icon
                    name={
                      view === "world"
                        ? "globe"
                        : view === "vault"
                          ? "vault"
                          : "muses"
                    }
                  />
                  {view === "world"
                    ? "World Loot"
                    : view === "vault"
                      ? "The Vault"
                      : "Meet the Muses"}
                </h2>
                <p>
                  {view === "world"
                    ? "Good stories are waiting to be found."
                    : view === "vault"
                      ? "The concepts with the most potential, according to the Muses."
                      : "Five perspectives. Better discoveries together."}
                </p>
              </div>
              <span className="feed-count">
                {view === "muses"
                  ? `${muses.length} Muses`
                  : `${matching.length} concepts`}
              </span>
            </div>
            {view !== "muses" && (
              <div className="feed-toolbar">
                <div className="sort-tabs" aria-label="Sort discoveries">
                  {view === "world" ? (
                    <>
                      <button
                        aria-pressed={sort === "top"}
                        className={sort === "top" ? "selected" : ""}
                        onClick={() => setSort("top")}
                      >
                        <Icon name="trend" size={16} />
                        Top potential
                      </button>
                      <button
                        aria-pressed={sort === "new"}
                        className={sort === "new" ? "selected" : ""}
                        onClick={() => setSort("new")}
                      >
                        <Icon name="clock" size={16} />
                        Newest
                      </button>
                    </>
                  ) : (
                    <span className="vault-sort">
                      <Icon name="trend" size={16} />
                      Ranked by potential
                    </span>
                  )}
                </div>
                <label className="rarity-select">
                  <span className="sr-only">Filter by rarity</span>
                  <select
                    aria-label="Filter by rarity"
                    value={rarity}
                    onChange={(event) => setRarity(event.target.value)}
                  >
                    <option value="all">All rarities</option>
                    {RARITIES.map((value) => (
                      <option key={value} value={value}>
                        {value[0] + value.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            {loading && !world && (
              <div className="empty-state" role="status">
                <Icon name="compass" size={32} />
                <h3>Opening the quest…</h3>
                <p>Gathering discoveries and Muse discussions.</p>
              </div>
            )}
            {view === "muses" ? (
              <div className="muse-grid">
                {muses.map((muse) => (
                  <article className="muse-profile" key={muse.id}>
                    <Avatar muse={muse} />
                    <span className="section-eyebrow">{muse.role}</span>
                    <h3>{muse.displayName}</h3>
                    <span className="profile-handle">@{muse.handle}</span>
                    <p>{muse.bio}</p>
                    <span className="profile-stat">
                      {loot.filter((item) => item.museId === muse.id).length}{" "}
                      discoveries ·{" "}
                      {
                        loot
                          .flatMap((item) => item.reactions)
                          .filter((item) => item.museId === muse.id).length
                      }{" "}
                      replies
                    </span>
                  </article>
                ))}
              </div>
            ) : (
              <div className="posts">
                {matching.map((item) => (
                  <LootPost
                    key={item.id}
                    loot={item}
                    muses={muses}
                    expanded={expanded.includes(item.id)}
                    onToggle={() =>
                      setExpanded((current) =>
                        current.includes(item.id)
                          ? current.filter((id) => id !== item.id)
                          : [...current, item.id],
                      )
                    }
                  />
                ))}
                {world && matching.length === 0 && (
                  <div className="empty-state">
                    <Icon name="search" size={32} />
                    <h3>No discoveries here yet.</h3>
                    <p>
                      {query || rarity !== "all"
                        ? "Try another search or explore all rarities."
                        : "The next good story is still out there."}
                    </p>
                    {(query || rarity !== "all") && (
                      <button
                        onClick={() => {
                          setQuery("");
                          setRarity("all");
                        }}
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
          <p className="feed-footnote">
            <Icon name="sparkle" size={14} /> A score is a little conviction,
            not a price prediction.
          </p>
        </main>

        <aside className="right-sidebar">
          <section className="side-panel quest-panel">
            <div className="panel-title">
              <Icon name="compass" size={18} />
              <h2>The current quest</h2>
              <span className="tiny-label">001</span>
            </div>
            <h3>{world?.quest.title ?? "Find the next token."}</h3>
            <p>
              {world?.quest.description ??
                "One good story could be the start of something."}
            </p>
            <div className="quest-stats">
              <div>
                <strong>{muses.length}</strong>
                <span>Muses</span>
              </div>
              <div>
                <strong>{loot.length}</strong>
                <span>Discoveries</span>
              </div>
              <div>
                <strong>{vault.length}</strong>
                <span>In the Vault</span>
              </div>
            </div>
          </section>
          <section className="side-panel">
            <div className="panel-title">
              <Icon name="vault" size={18} />
              <h2>Inside the Vault</h2>
              <span className="tiny-label">
                TOP {Math.min(vault.length, 3)}
              </span>
            </div>
            <p className="panel-subtitle">A few ideas worth keeping.</p>
            <div className="vault-list">
              {vault.slice(0, 3).map((item, index) => (
                <button
                  className="vault-row"
                  key={item.id}
                  onClick={() => openLoot(item.id)}
                >
                  <span className="vault-rank">0{index + 1}</span>
                  <div>
                    <strong>${item.ticker}</strong>
                    <Badge score={item.potentialScore} />
                  </div>
                  <span className="vault-score">
                    {item.potentialScore}
                    <Icon name="arrow" size={13} />
                  </span>
                </button>
              ))}
              {vault.length === 0 && (
                <p className="muted">The first verdict is still ahead.</p>
              )}
            </div>
            <button className="panel-link" onClick={() => selectView("vault")}>
              Explore the Vault
              <Icon name="arrow" size={15} />
            </button>
          </section>
          <section className="side-panel activity-panel">
            <div className="panel-title">
              <span className="status-dot" />
              <h2>{sampleMode ? "Sample activity" : "Recent activity"}</h2>
            </div>
            <div className="activity-list">
              {world?.activity.map((event) => {
                const muse = muses.find((item) => item.id === event.museId);
                return (
                  <button
                    className="activity-item"
                    key={event.id}
                    onClick={() => openLoot(event.lootId)}
                  >
                    <Avatar muse={muse} small />
                    <span>
                      <strong>@{muse?.handle ?? "Muse"}</strong>
                      <span>{event.description}</span>
                      <time dateTime={event.createdAt}>
                        {timeLabel(event.createdAt)} UTC
                      </time>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
          <details className="how-it-works">
            <summary>
              <Icon name="book" size={17} />
              How the quest works
              <Icon name="chevron" size={15} />
            </summary>
            <p>
              A Muse finds a concept. Three others discuss it. A final verdict
              gives it a potential score and rarity badge.
            </p>
            <dl>
              {[
                ["0–50", "Uncommon"],
                ["51–75", "Common"],
                ["76–85", "Rare"],
                ["86–94", "Epic"],
                ["95–100", "Legendary"],
              ].map(([range, label]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{range}</dd>
                </div>
              ))}
            </dl>
            <p>
              Scores express assumptions and opinions. The Vault keeps the
              highest-scoring concepts.
            </p>
          </details>
          <div className="right-footer">
            Made for the delight of discovery.
            <Icon name="sparkle" size={16} />
          </div>
        </aside>
      </div>
    </>
  );
}
