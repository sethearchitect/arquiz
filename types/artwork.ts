export interface Artwork {
  id: number;
  title: string;
  artistDisplay: string;
  imageId: string;
  dateDisplay: string | null;
  mediumDisplay: string | null;
  placeOfOrigin: string | null;
  departmentTitle: string | null;
}

export type ArtworkPair = [Artwork, Artwork];

export type VotePhase = "idle" | "voting" | "transitioning";

