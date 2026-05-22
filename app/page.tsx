"use client";

import { useState, useEffect, useRef } from "react";
import { useArtPool } from "@/hooks/useArtPool";
import { useArena } from "@/hooks/useArena";
import { useCollection } from "@/hooks/useCollection";
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
  const { collection, isInCollection, toggleItem, hydrated } = useCollection();
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
        collectionCount={hydrated ? collection.length : 0}
        isCollectionOpen={showCollection}
        onToggleCollection={() => setShowCollection((v) => !v)}
        collectionBtnRef={collectionBtnRef}
      />
      <Arena
        pair={pair}
        phase={phase}
        winnerIdx={winnerIdx}
        onVote={advance}
        isInCollection={isInCollection}
        onToggleCollect={toggleItem}
      />
      {showCollection && (
        <CollectionPanel
          collection={collection}
          onClose={() => {
            setShowCollection(false);
            collectionBtnRef.current?.focus();
          }}
          onRemoveItem={toggleItem}
        />
      )}
    </main>
  );
}
