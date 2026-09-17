import Image from "next/image";
import { useEffect, useRef } from "react";
import { Icon, type IconName } from "./icons";
import { Avatar } from "./quest-ui";
import type { Muse } from "@/lib/world";
import type { View } from "@/lib/presentation";

export const navigation: { id: View; label: string; icon: IconName }[] = [
  { id: "world", label: "World Loot", icon: "globe" },
  { id: "vault", label: "The Vault", icon: "vault" },
  { id: "muses", label: "Meet the Muses", icon: "muses" },
];

export function QuestHeader({
  query,
  onQuery,
  onHome,
}: {
  query: string;
  onQuery: (value: string) => void;
  onHome: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button
          className="wordmark"
          onClick={onHome}
          aria-label="MUSEQUEST home"
        >
          <span className="brand-icon">
            <Icon name="sparkle" size={35} />
          </span>
          <span>
            <b>MUSE</b>QUEST
          </span>
        </button>
        <div className="global-search" role="search">
          <Icon name="search" size={20} />
          <input
            ref={input}
            aria-label="Search discoveries and tickers"
            placeholder="Search discoveries, tickers, little wonders…"
            value={query}
            onChange={(event) => onQuery(event.target.value)}
          />
          {query ? (
            <button
              className="icon-button"
              onClick={() => onQuery("")}
              aria-label="Clear search"
            >
              <Icon name="close" size={18} />
            </button>
          ) : (
            <kbd title="Control or Command + K">⌘ K</kbd>
          )}
        </div>
      </div>
    </header>
  );
}

export function QuestNavigation({
  view,
  muses,
  count,
  onSelect,
}: {
  view: View;
  muses: Muse[];
  count: number | null;
  onSelect: (view: View) => void;
}) {
  return (
    <aside className="left-sidebar">
      <span className="section-eyebrow">YOUR WINDOW INTO THE QUEST</span>
      <nav aria-label="Main navigation">
        {navigation.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${view === item.id ? "active" : ""}`}
            aria-current={view === item.id ? "page" : undefined}
            onClick={() => onSelect(item.id)}
          >
            <Icon name={item.icon} size={28} />
            <span>{item.label}</span>
            {item.id === "world" && (
              <span className="nav-count">{count ?? "—"}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="sidebar-divider" />
      <div className="sidebar-heading">
        <span className="section-eyebrow">THE EXPEDITION</span>
        <span className="tiny-label">{muses.length || "—"}</span>
      </div>
      <div className="muse-list">
        {muses.map((muse) => (
          <button
            className="muse-link"
            key={muse.id}
            onClick={() => onSelect("muses")}
          >
            <Avatar muse={muse} />
            <span>
              <strong>{muse.displayName}</strong>
              <small>{muse.role}</small>
            </span>
          </button>
        ))}
      </div>
      <p className="sidebar-footer">
        A little weird. A little wonderful.
        <br />© 2026 MUSEQUEST
      </p>
    </aside>
  );
}

export function QuestHero({
  muses,
  onExplore,
  onAbout,
}: {
  muses: Muse[];
  onExplore: () => void;
  onAbout: () => void;
}) {
  return (
    <section className="quest-banner" aria-labelledby="quest-headline">
      <div className="quest-copy">
        <div className="quest-label">
          <Icon name="sparkle" size={19} />
          <span>QUEST #001</span>
          <span className="quest-tag">THE FIRST EXPEDITION</span>
        </div>
        <h1 id="quest-headline">
          Small discoveries.
          <br />
          <em>Big possibilities.</em>
        </h1>
        <p>
          Forgotten lore. Unlikely mascots. The next token idea.
          <br className="desktop-break" /> Follow the Muses down the rabbit
          hole.
        </p>
        <div className="quest-members">
          <div className="avatar-stack">
            {muses.map((muse) => (
              <Avatar key={muse.id} muse={muse} small />
            ))}
          </div>
          <span>
            {muses.length > 0 && <strong>{muses.length} Muses. </strong>}One
            shared quest.
          </span>
        </div>
        <div className="hero-actions">
          <button className="button button-dark" onClick={onExplore}>
            Explore World Loot <Icon name="arrow" size={19} />
          </button>
          <button className="button button-outline" onClick={onAbout}>
            About the Expedition
          </button>
        </div>
      </div>
      <div className="quest-art" aria-hidden="true">
        <Image
          src="/art/quest-collage.webp"
          alt=""
          width={1000}
          height={750}
          sizes="(max-width: 767px) 90vw, (max-width: 1279px) 40vw, 440px"
          preload
        />
      </div>
    </section>
  );
}
