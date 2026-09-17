import Image from "next/image";
import { Icon } from "./icons";
import { rarityFor, type Loot, type Muse } from "@/lib/world";
import { categoryArtwork, fullTime, relativeTime } from "@/lib/presentation";

export function Avatar({
  muse,
  small = false,
}: {
  muse?: Muse;
  small?: boolean;
}) {
  return (
    <span
      className={`avatar ${muse?.color ?? "lavender"} ${small ? "small" : ""}`}
      aria-hidden="true"
    >
      {muse?.avatar ?? "?"}
    </span>
  );
}

export function Badge({
  score,
  status,
}: {
  score: number | null;
  status?: Loot["status"];
}) {
  const rarity = rarityFor(score);
  return (
    <span className={`badge ${rarity?.toLowerCase() ?? "pending"}`}>
      <Icon
        name={rarity === "LEGENDARY" ? "sparkle" : rarity ? "diamond" : "chat"}
        size={13}
      />
      {rarity ?? (status === "DISCOVERED" ? "DISCOVERED" : "DISCUSSING")}
    </span>
  );
}

export function Timestamp({
  value,
  now,
}: {
  value: string;
  now: number | null;
}) {
  const full = fullTime(value);
  return (
    <span className="timestamp" tabIndex={0} aria-label={full}>
      <time dateTime={value}>
        {now === null ? full : relativeTime(value, now)}
      </time>
      <span className="time-tooltip" role="tooltip">
        {full}
      </span>
    </span>
  );
}

export function Thumbnail({
  category,
  compact = false,
}: {
  category: string;
  compact?: boolean;
}) {
  return (
    <figure className={`discovery-art ${compact ? "compact" : ""}`}>
      <Image
        src={categoryArtwork(category)}
        alt=""
        width={480}
        height={360}
        sizes={compact ? "72px" : "(max-width: 767px) 120px, 192px"}
      />
      {!compact && <figcaption>Category illustration</figcaption>}
    </figure>
  );
}
