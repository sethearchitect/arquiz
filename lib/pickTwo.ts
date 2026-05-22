import type { Artwork, ArtworkPair } from "@/types/artwork";

export function pickTwo(
  pool: Artwork[],
  seenIds: number[]
): ArtworkPair | null {
  const seenSet = new Set(seenIds);
  const available = pool.filter((w) => !seenSet.has(w.id));
  const src = available.length >= 2 ? available : [...pool];
  if (src.length < 2) return null;
  const shuffled = [...src].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}
