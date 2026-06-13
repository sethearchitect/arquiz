"use client";

import { useState, useEffect, useRef } from "react";
import { CollectionItem } from "./CollectionItem";
import type { Artwork } from "@/types/artwork";
import styles from "./CollectionPanel.module.css";

type Tab = "votes" | "collection";

interface CollectionPanelProps {
  collection: Artwork[];
  history: Artwork[];
  onClose: () => void;
  onToggleCollect: (work: Artwork) => void;
  isInCollection: (id: number) => boolean;
}

export function CollectionPanel({
  collection,
  history,
  onClose,
  onToggleCollect,
  isInCollection,
}: CollectionPanelProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [activeTab, setActiveTab] = useState<Tab>("votes");

  // Focus the close button when the panel opens
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  const isEmpty = activeTab === "votes" ? history.length === 0 : collection.length === 0;

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-label={activeTab === "votes" ? "Your vote history" : "Your collection"}
        aria-modal="true"
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>
            {activeTab === "votes"
              ? `VOTES — ${history.length}`
              : `COLLECTION — ${collection.length} work${collection.length !== 1 ? "s" : ""}`}
          </span>
          <button
            ref={closeBtnRef}
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close panel"
          >
            ×
          </button>
        </div>

        <div className={styles.tabs} role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === "votes"}
            className={`${styles.tab} ${activeTab === "votes" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("votes")}
          >
            Votes ({history.length})
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "collection"}
            className={`${styles.tab} ${activeTab === "collection" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("collection")}
          >
            Collection ({collection.length})
          </button>
        </div>

        {isEmpty ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              {activeTab === "votes" ? (
                <>No votes yet —<br />start comparing artworks!</>
              ) : (
                <>Vote and star the works<br />that move you.</>
              )}
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {activeTab === "votes"
              ? history.map((work) => (
                  <CollectionItem
                    key={work.id}
                    work={work}
                    onStar={() => onToggleCollect(work)}
                    isStarred={isInCollection(work.id)}
                  />
                ))
              : collection.map((work) => (
                  <CollectionItem
                    key={work.id}
                    work={work}
                    onRemove={() => onToggleCollect(work)}
                  />
                ))}
          </div>
        )}
      </div>
    </div>
  );
}
