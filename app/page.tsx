"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useArtPool } from "@/hooks/useArtPool";
import { useArena } from "@/hooks/useArena";
import { useCollection } from "@/hooks/useCollection";
import { useVoteHistory } from "@/hooks/useVoteHistory";
import { useTheme } from "@/hooks/useTheme";
import { Header } from "@/components/Header/Header";
import { Arena } from "@/components/Arena/Arena";
import { CollectionPanel } from "@/components/CollectionPanel/CollectionPanel";
import { LoadingScreen } from "@/components/LoadingScreen/LoadingScreen";
import { ErrorScreen } from "@/components/ErrorScreen/ErrorScreen";
import styles from "./page.module.css";

export default function ArenaPage() {
  const { pool, isLoading, error, currentPage, totalPages, loadNextPage, retry } =
    useArtPool();
  const { pair, phase, winnerIdx, votes, advance, isReady } =
    useArena(pool, currentPage, totalPages, loadNextPage);
  const { collection, isInCollection, toggleItem, hydrated: collectionHydrated } = useCollection();
  const { history, addVote, hydrated: votesHydrated } = useVoteHistory();
  const { theme, toggleTheme } = useTheme();

  const handleVote = useCallback(
    (chosenIdx: 0 | 1) => {
      if (pair) addVote(pair[chosenIdx]);
      advance(chosenIdx);
    },
    [pair, addVote, advance]
  );
  const [showCollection, setShowCollection] = useState(false);
  const collectionBtnRef = useRef<HTMLButtonElement>(null);

  // Global keyboard shortcuts: Escape closes panel, C toggles it
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showCollection) {
        setShowCollection(false);
        collectionBtnRef.current?.focus();
      }
      if (e.key.toLowerCase() === "c" && !showCollection) {
        setShowCollection(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showCollection]);

  if (error && !isReady) {
    return <ErrorScreen message={error} onRetry={retry} />;
  }

  if ((isLoading && !isReady) || !pair) {
    return <LoadingScreen />;
  }

  return (
    <main className={styles.root}>
      <Header
        votes={votes}
        collectionCount={collectionHydrated ? collection.length : 0}
        isCollectionOpen={showCollection}
        onToggleCollection={() => setShowCollection((v) => !v)}
        collectionBtnRef={collectionBtnRef}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <Arena
        pair={pair}
        phase={phase}
        winnerIdx={winnerIdx}
        onVote={handleVote}
        isInCollection={isInCollection}
        onToggleCollect={toggleItem}
      />
      {showCollection && (
        <CollectionPanel
          collection={collectionHydrated ? collection : []}
          history={votesHydrated ? history : []}
          onClose={() => {
            setShowCollection(false);
            collectionBtnRef.current?.focus();
          }}
          onToggleCollect={toggleItem}
          isInCollection={isInCollection}
        />
      )}
    </main>
  );
}
