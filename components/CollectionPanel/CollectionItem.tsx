import { getImageUrl, BROKEN_IMAGE_FALLBACK } from "@/services/artic";
import type { Artwork } from "@/types/artwork";
import styles from "./CollectionPanel.module.css";

interface CollectionItemProps {
  work: Artwork;
  onRemove: () => void;
}

export function CollectionItem({ work, onRemove }: CollectionItemProps) {
  return (
    <div className={styles.item}>
      <img
        src={getImageUrl(work.imageId, "400,")}
        alt={work.title}
        className={styles.itemImg}
        onError={(e) => {
          e.currentTarget.src = BROKEN_IMAGE_FALLBACK;
        }}
      />
      <button
        className={styles.itemRemove}
        onClick={onRemove}
        aria-label={`Remove "${work.title}" from collection`}
      >
        ×
      </button>
      <p className={styles.itemTitle}>{work.title}</p>
      <p className={styles.itemArtist}>{work.artistDisplay}</p>
      {work.dateDisplay && (
        <p className={styles.itemDate}>{work.dateDisplay}</p>
      )}
    </div>
  );
}
