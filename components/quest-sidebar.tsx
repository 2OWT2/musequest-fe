import { Icon } from "./icons";
import { Avatar, Thumbnail, Timestamp } from "./quest-ui";
import type { Loot, World } from "@/lib/world";

export function QuestSidebar({
  world,
  vault,
  sampleMode,
  now,
  onExplore,
  onVault,
  onLoot,
}: {
  world: World | null;
  vault: Loot[];
  sampleMode: boolean;
  now: number | null;
  onExplore: () => void;
  onVault: () => void;
  onLoot: (id: string) => void;
}) {
  const top = vault[0];
  return (
    <aside className="right-sidebar" aria-label="Quest overview">
      <section className="side-panel quest-panel">
        <div className="panel-title">
          <Icon name="compass" size={25} />
          <h2>The current quest</h2>
          <span className="tiny-label">001</span>
        </div>
        <h3>{world?.quest.title ?? "Find the next token."}</h3>
        <p>
          {world?.quest.description ??
            "Explore forgotten corners of the internet. Bring back one story worth turning into something new."}
        </p>
        <div className="quest-stats">
          <div>
            <strong>{world?.muses.length ?? "—"}</strong>
            <span>Muses</span>
          </div>
          <div>
            <strong>{world?.loot.length ?? "—"}</strong>
            <span>Available finds</span>
          </div>
          <div>
            <strong>{world ? vault.length : "—"}</strong>
            <span>In this Vault</span>
          </div>
        </div>
        <button className="button button-lavender" onClick={onExplore}>
          Explore the quest <Icon name="arrow" size={20} />
        </button>
      </section>
      <section className="side-panel vault-panel">
        <div className="panel-title">
          <Icon name="vault" size={24} />
          <h2>Inside the Vault</h2>
          {top && <span className="tiny-label violet">TOP 1</span>}
        </div>
        <p className="panel-subtitle">A few ideas worth keeping.</p>
        {top ? (
          <button className="vault-row" onClick={() => onLoot(top.id)}>
            <Thumbnail category={top.category} compact />
            <span className="vault-info">
              <strong>${top.ticker}</strong>
              <span className="badge in-vault">
                <Icon name="diamond" size={12} />
                IN VAULT
              </span>
            </span>
            <span className="vault-score">
              {top.potentialScore}
              <Icon name="arrow" size={20} />
            </span>
          </button>
        ) : (
          <p className="muted">
            {world
              ? "The first verdict is still ahead."
              : "Gathering the best discoveries…"}
          </p>
        )}
        <button className="panel-link" onClick={onVault}>
          Explore the Vault <Icon name="arrow" size={17} />
        </button>
      </section>
      <section className="side-panel activity-panel">
        <div className="panel-title">
          <span className="status-dot" />
          <h2>{sampleMode ? "Sample activity" : "Recent activity"}</h2>
        </div>
        <div className="activity-list">
          {world?.activity.map((event) => {
            const muse = world.muses.find((item) => item.id === event.museId);
            const available = world.loot.some(
              (item) => item.id === event.lootId,
            );
            return (
              <div className="activity-item" key={event.id}>
                <Avatar muse={muse} />
                <div>
                  {available ? (
                    <button
                      className="activity-link"
                      onClick={() => onLoot(event.lootId)}
                    >
                      <strong>@{muse?.handle ?? "Muse"}</strong>
                      <span>{event.description}</span>
                    </button>
                  ) : (
                    <div className="activity-link">
                      <strong>@{muse?.handle ?? "Muse"}</strong>
                      <span>{event.description}</span>
                    </div>
                  )}
                  <Timestamp value={event.createdAt} now={now} />
                </div>
              </div>
            );
          })}
          {world && world.activity.length === 0 && (
            <p className="muted">The next discovery starts the story.</p>
          )}
        </div>
      </section>
      <details className="how-it-works">
        <summary>
          <Icon name="book" size={23} />
          How the quest works
          <Icon name="chevron" size={18} />
        </summary>
        <div>
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
            Scores express assumptions and opinions. The Vault keeps evaluated
            concepts, ranked by potential.
          </p>
        </div>
      </details>
      <p className="right-footer">
        Made for the delight of discovery. <Icon name="sparkle" size={17} />
      </p>
    </aside>
  );
}
