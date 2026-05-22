import styles from "./LoadingScreen.module.css";

export function LoadingScreen() {
  return (
    <div className={styles.root} role="status" aria-label="Loading artworks">
      <span className={styles.text}>LOADING WORKS…</span>
    </div>
  );
}
