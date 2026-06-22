"use client";

import { useEffect } from "react";
import { ArtPanel } from "@/components/ArtPanel/ArtPanel";
import { VsDivider } from "@/components/VsDivider/VsDivider";
import type { Artwork, ArtworkPair, VotePhase } from "@/types/artwork";
import styles from "./Arena.module.css";

interface ArenaProps {
  pair: ArtworkPair;
  phase: VotePhase;
  winnerIdx: 0 | 1 | null;
  onVote: (idx: 0 | 1) => void;
  onSkip: () => void;
  isInCollection: (id: number) => boolean;
  onToggleCollect: (work: Artwork) => void;
}

export function Arena({
  pair,
  phase,
  winnerIdx,
  onVote,
  onSkip,
  isInCollection,
  onToggleCollect,
}: ArenaProps) {
  // Arrow key voting shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== "idle") return;
      if (e.key === "ArrowLeft" || e.key === "1") onVote(0);
      if (e.key === "ArrowRight" || e.key === "2") onVote(1);
      if (e.key.toLowerCase() === "s") onSkip();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, onVote, onSkip]);

  return (
    <section className={styles.root} aria-label="Artwork voting arena">
      <ArtPanel
        work={pair[0]}
        phase={phase}
        isWinner={winnerIdx === 0}
        isLoser={winnerIdx !== null && winnerIdx !== 0}
        isInCollection={isInCollection(pair[0].id)}
        voteLabel="THIS"
        onVote={() => onVote(0)}
        onToggleCollect={(e) => {
          e.stopPropagation();
          onToggleCollect(pair[0]);
        }}
      />
      <VsDivider onSkip={phase === "idle" ? onSkip : undefined} />
      <ArtPanel
        work={pair[1]}
        phase={phase}
        isWinner={winnerIdx === 1}
        isLoser={winnerIdx !== null && winnerIdx !== 1}
        isInCollection={isInCollection(pair[1].id)}
        voteLabel="THAT"
        onVote={() => onVote(1)}
        onToggleCollect={(e) => {
          e.stopPropagation();
          onToggleCollect(pair[1]);
        }}
      />
    </section>
  );
}
