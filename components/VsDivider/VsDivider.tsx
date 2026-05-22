import styles from "./VsDivider.module.css";

export function VsDivider() {
  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.line} />
      <span className={styles.label}>vs</span>
      <div className={styles.line} />
    </div>
  );
}
