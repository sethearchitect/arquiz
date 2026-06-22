import styles from "./VsDivider.module.css";

interface VsDividerProps {
  onSkip?: () => void;
}

export function VsDivider({ onSkip }: VsDividerProps) {
  return (
    <div className={styles.root} aria-hidden={!onSkip}>
      <div className={styles.line} />
      <span className={styles.label}>or</span>
      {onSkip && (
        <button
          className={styles.skip}
          onClick={onSkip}
          title="Skip this pair (S)"
          aria-label="Skip this pair"
        >
          skip
        </button>
      )}
      <div className={styles.line} />
    </div>
  );
}
