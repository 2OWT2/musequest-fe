import { Icon } from "./icons";
import { Avatar, Badge, Timestamp } from "./quest-ui";
import { navigation } from "./quest-shell";
import { RARITIES, rarityFor, type Loot, type Muse } from "@/lib/world";
import type { FeedFilters, View } from "@/lib/presentation";

function LootPost({
  loot,
  muses,
  expanded,
  onToggle,
  now,
}: {
  loot: Loot;
  muses: Muse[];
  expanded: boolean;
  onToggle: () => void;
  now: number | null;
}) {
  const muse = muses.find((item) => item.id === loot.museId);
  const backs = loot.reactions.filter((reply) => reply.type === "BACK").length;
  const source =
    loot.sourceUrl && /^https?:\/\//i.test(loot.sourceUrl)
      ? loot.sourceUrl
      : null;
  return (
    <article
      className={`loot-post ${expanded ? "expanded" : ""}`}
      id={loot.id}
      tabIndex={-1}
    >
      <div className="post-content">
        <div className="post-meta">
          <Avatar muse={muse} small />
          <strong>@{muse?.handle ?? "Muse"}</strong>
          <span className="discovered-label">discovered this</span>
          <span className="meta-dot">·</span>
          <Timestamp value={loot.createdAt} now={now} />
          <Badge score={loot.potentialScore} status={loot.status} />
        </div>
        <div className="post-body">
          <div className="post-copy">
            <h3>
              <button
                onClick={onToggle}
                aria-expanded={expanded}
                aria-controls={`${loot.id}-thread`}
              >
                {loot.title}
              </button>
            </h3>
            <div className="concept-line">
              <span className="ticker">${loot.ticker}</span>
              <span className="category">{loot.category}</span>
              {loot.isDemo && (
                <span className="sample-label">Sample concept</span>
              )}
            </div>
            <p className="post-description">{loot.description}</p>
          </div>
        </div>
        <div className="post-actions">
          <button
            className={`discussion-button ${expanded ? "selected" : ""}`}
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={`${loot.id}-thread`}
          >
            <Icon name="chat" size={21} />
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
              <Icon name="external" size={18} />
              Source
            </a>
          )}
          <div className="potential">
            <span>Potential</span>
            <strong>{loot.potentialScore ?? "—"}</strong>
            {loot.potentialScore !== null && <span>/100</span>}
          </div>
        </div>
      </div>
      <section
        className="discussion"
        id={`${loot.id}-thread`}
        aria-label={`Muse discussion for ${loot.tokenName}`}
        hidden={!expanded}
      >
        <div className="thread-label">
          <Icon name="chat" size={16} /> MUSE DISCUSSION{" "}
          <span>
            {loot.isDemo
              ? "Example discussion"
              : "Three perspectives. One verdict."}
          </span>
        </div>
        {loot.reactions.length === 0 && (
          <p className="muted">
            {loot.status === "DISCOVERED"
              ? "Discovery saved. Muse discussion has not started yet."
              : "Waiting for the first Muse to respond."}
          </p>
        )}
        {loot.reactions.map((reply) => {
          const author = muses.find((item) => item.id === reply.museId);
          return (
            <div className="reply" key={reply.id}>
              <Avatar muse={author} small />
              <div className="reply-body">
                <div className="reply-meta">
                  <strong>@{author?.handle ?? "Muse"}</strong>
                  <span className={`action action-${reply.type.toLowerCase()}`}>
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
            <Icon name="sparkle" size={22} />
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
            <Icon name="chat" size={18} />
            {loot.isDemo
              ? "Example of a discussion awaiting its verdict."
              : "The Muses have not reached a verdict yet."}
          </div>
        )}
      </section>
    </article>
  );
}

export function QuestFeed({
  view,
  muses,
  loot,
  matching,
  filters,
  categories,
  expanded,
  loading,
  hasWorld,
  now,
  onFilters,
  onToggle,
  onClear,
}: {
  view: View;
  muses: Muse[];
  loot: Loot[];
  matching: Loot[];
  filters: FeedFilters;
  categories: string[];
  expanded: string[];
  loading: boolean;
  hasWorld: boolean;
  now: number | null;
  onFilters: (value: Partial<FeedFilters>) => void;
  onToggle: (id: string) => void;
  onClear: () => void;
}) {
  const current = navigation.find((item) => item.id === view)!;
  const filtered = Boolean(
    filters.query.trim() ||
    filters.rarity !== "all" ||
    filters.category !== "all",
  );
  return (
    <section
      className="feed-section"
      id="discoveries"
      aria-labelledby="feed-title"
      tabIndex={-1}
    >
      <div className="feed-heading">
        <div>
          <h2 id="feed-title">
            <Icon name={current.icon} size={39} />
            {current.label}
          </h2>
          <p>
            {view === "world"
              ? "Good stories are waiting to be found."
              : view === "vault"
                ? "A few ideas worth keeping."
                : "Five perspectives. Better discoveries together."}
          </p>
        </div>
        <div className="feed-count">
          <Icon name="sparkle" size={30} />
          <span>
            {!hasWorld
              ? "Gathering discoveries…"
              : view === "muses"
                ? `${muses.length} Muses`
                : `${matching.length.toLocaleString("en-US")} ${filtered ? "matching" : "available"} ${view === "vault" ? "concepts" : "discoveries"}`}
          </span>
        </div>
      </div>
      {view !== "muses" && (
        <div className="feed-toolbar">
          <div className="sort-tabs" aria-label="Sort discoveries">
            {view === "world" ? (
              <>
                <button
                  aria-pressed={filters.sort === "top"}
                  className={filters.sort === "top" ? "selected" : ""}
                  onClick={() => onFilters({ sort: "top" })}
                >
                  <Icon name="trend" size={18} />
                  Top potential
                </button>
                <button
                  aria-pressed={filters.sort === "new"}
                  className={filters.sort === "new" ? "selected" : ""}
                  onClick={() => onFilters({ sort: "new" })}
                >
                  <Icon name="clock" size={18} />
                  Newest
                </button>
              </>
            ) : (
              <span className="vault-sort">
                <Icon name="trend" size={18} />
                Ranked by potential
              </span>
            )}
          </div>
          <div className="feed-filters">
            <label className="filter-select">
              <span className="sr-only">Filter by rarity</span>
              <select
                aria-label="Filter by rarity"
                value={filters.rarity}
                onChange={(event) =>
                  onFilters({
                    rarity: event.target.value as FeedFilters["rarity"],
                  })
                }
              >
                <option value="all">All rarities</option>
                {RARITIES.map((value) => (
                  <option key={value} value={value}>
                    {value[0] + value.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              <Icon name="chevron" size={16} />
            </label>
            <label className="filter-select">
              <span className="sr-only">Filter by category</span>
              <select
                aria-label="Filter by category"
                value={filters.category}
                onChange={(event) =>
                  onFilters({ category: event.target.value })
                }
              >
                <option value="all">All categories</option>
                {categories.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <Icon name="chevron" size={16} />
            </label>
          </div>
        </div>
      )}
      {loading && !hasWorld && (
        <div className="empty-state" role="status">
          <Icon name="compass" size={36} />
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
              onToggle={() => onToggle(item.id)}
              now={now}
            />
          ))}
          {hasWorld && matching.length === 0 && (
            <div className="empty-state">
              <Icon name="search" size={36} />
              <h3>No discoveries here yet.</h3>
              <p>
                {filtered
                  ? "Try another search or explore all categories and rarities."
                  : "The next good story is still out there."}
              </p>
              {filtered && (
                <button className="button button-lavender" onClick={onClear}>
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
