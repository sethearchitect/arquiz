import styles from "./ErrorScreen.module.css";

interface ErrorScreenProps {
  message: string;
  onRetry: () => void;
}

export function ErrorScreen({ message, onRetry }: ErrorScreenProps) {
  return (
    <div className={styles.root} role="alert">
      <p className={styles.message}>{message}</p>
      <button className={styles.retryBtn} onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
