"use client";

import { useState } from "react";
import { BROKEN_IMAGE_FALLBACK, getImageUrl } from "@/services/met";
import type { Artwork, VotePhase } from "@/types/artwork";
import styles from "./ArtPanel.module.css";

interface ArtPanelProps {
  work: Artwork;
  phase: VotePhase;
  isWinner: boolean;
  isLoser: boolean;
  isInCollection: boolean;
  voteLabel: "THIS" | "THAT";
  onVote: () => void;
  onToggleCollect: (e: React.MouseEvent) => void;
}

export function ArtPanel({
  work,
  phase,
  isWinner,
  isLoser,
  isInCollection,
  voteLabel,
  onVote,
  onToggleCollect,
}: ArtPanelProps) {
  const [expanded, setExpanded] = useState(false);

  const panelClass = [
    styles.panel,
    isWinner && styles.winner,
    isLoser && styles.loser,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={panelClass}>
      {/* ── Clickable image zone ── */}
      <div
        role="button"
        tabIndex={phase === "idle" ? 0 : -1}
        className={styles.imageWrap}
        onClick={phase === "idle" ? onVote : undefined}
        onKeyDown={(e) => {
          if (phase !== "idle") return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onVote();
          }
        }}
        aria-label={`Choose "${work.title}" by ${work.artistDisplay}`}
        aria-pressed={isWinner || undefined}
        aria-disabled={phase !== "idle" || undefined}
      >
        <img
          src={getImageUrl(work.imageId)}
          alt={work.title}
          className={styles.image}
          onError={(e) => {
            e.currentTarget.src = BROKEN_IMAGE_FALLBACK;
          }}
        />

        <div className={styles.voteLabel} aria-hidden="true">
          {voteLabel}
        </div>

        <button
          className={`${styles.starBtn} ${isInCollection ? styles.starBtnActive : styles.starBtnInactive}`}
          onClick={onToggleCollect}
          aria-label={
            isInCollection
              ? `Remove "${work.title}" from collection`
              : `Add "${work.title}" to collection`
          }
          aria-pressed={isInCollection}
        >
          {isInCollection ? "★" : "☆"}
        </button>
      </div>

      {/* ── Persistent info zone ── */}
      <div className={styles.info}>
        <div className={styles.infoHeader}>
          <div className={styles.infoMeta}>
            {work.dateDisplay && (
              <span className={styles.metaChip}>{work.dateDisplay}</span>
            )}
            {work.placeOfOrigin && (
              <span className={styles.metaChip}>{work.placeOfOrigin}</span>
            )}
            {work.departmentTitle && (
              <span className={`${styles.metaChip} ${styles.metaDept}`}>
                {work.departmentTitle}
              </span>
            )}
          </div>
          <button
            className={styles.infoToggle}
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse artwork details" : "Expand artwork details"}
          >
            {expanded ? "−" : "+"}
          </button>
        </div>

        <div className={`${styles.infoExpandable} ${expanded ? styles.infoExpanded : ""}`}>
          <h2 className={styles.title}>{work.title}</h2>
          <p className={styles.artist}>{work.artistDisplay}</p>

          {work.mediumDisplay && (
            <p className={styles.medium}>{work.mediumDisplay}</p>
          )}

          <a
            href={`https://www.metmuseum.org/art/collection/search/${work.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.viewLink}
            onClick={(e) => e.stopPropagation()}
          >
            View at The Met →
          </a>
        </div>
      </div>
    </article>
  );
}
