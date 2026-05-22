import { RefObject } from "react";
import styles from "./Header.module.css";

interface HeaderProps {
  votes: number;
  collectionCount: number;
  isCollectionOpen: boolean;
  onToggleCollection: () => void;
  collectionBtnRef: RefObject<HTMLButtonElement | null>;
}

export function Header({
  votes,
  collectionCount,
  isCollectionOpen,
  onToggleCollection,
  collectionBtnRef,
}: HeaderProps) {
  return (
    <header className={styles.root}>
      <div className={styles.left}>
        <span className={styles.logo}>ARQUIZ</span>
        <span className={styles.tagline}>which speaks to you?</span>
      </div>
      <div className={styles.right}>
        {votes > 0 && (
          <output className={styles.votes} aria-live="polite" aria-atomic="true">
            {votes} votes
          </output>
        )}
        <button
          ref={collectionBtnRef}
          className={`${styles.collectBtn} ${isCollectionOpen ? styles.collectBtnActive : ""}`}
          onClick={onToggleCollection}
          aria-expanded={isCollectionOpen}
          aria-label="Toggle collection panel"
        >
          Collection
          {collectionCount > 0 && (
            <span className={styles.badge}>{collectionCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}
