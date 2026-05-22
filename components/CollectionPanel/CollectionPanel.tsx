"use client";

import { useEffect, useRef } from "react";
import { CollectionItem } from "./CollectionItem";
import type { Artwork } from "@/types/artwork";
import styles from "./CollectionPanel.module.css";

interface CollectionPanelProps {
  collection: Artwork[];
  onClose: () => void;
  onRemoveItem: (work: Artwork) => void;
}

export function CollectionPanel({
  collection,
  onClose,
  onRemoveItem,
}: CollectionPanelProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Focus the close button when the panel opens
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-label="Your collection"
        aria-modal="true"
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>
            YOUR COLLECTION — {collection.length} work
            {collection.length !== 1 ? "s" : ""}
          </span>
          <button
            ref={closeBtnRef}
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close collection"
          >
            ×
          </button>
        </div>

        {collection.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              Vote and star the works
              <br />
              that move you.
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {collection.map((work) => (
              <CollectionItem
                key={work.id}
                work={work}
                onRemove={() => onRemoveItem(work)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
