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

// Raw shape from the ARTIC REST API before normalization
export interface ArtworkRaw {
  id: number;
  title: string | null;
  artist_display: string | null;
  image_id: string | null;
  date_display: string | null;
  medium_display: string | null;
  place_of_origin: string | null;
  department_title: string | null;
}

export interface ArticPagination {
  total: number;
  limit: number;
  offset: number;
  total_pages: number;
  current_page: number;
}

export interface ArticApiResponse {
  data: ArtworkRaw[];
  pagination: ArticPagination;
}
