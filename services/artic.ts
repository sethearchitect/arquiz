import type { Artwork, ArticApiResponse, ArticPagination } from "@/types/artwork";

const ARTIC_BASE = "https://api.artic.edu/api/v1";
const IIIF_BASE = "https://www.artic.edu/iiif/2";
const FIELDS = "id,title,artist_display,image_id,date_display,medium_display,place_of_origin,department_title";

export const BROKEN_IMAGE_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800'%3E%3Crect width='600' height='800' fill='%231a1a1a'/%3E%3C/svg%3E";

export function getImageUrl(imageId: string, width = "843,"): string {
  return `${IIIF_BASE}/${imageId}/full/${width}/0/default.jpg`;
}

export class ArticFetchError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ArticFetchError";
  }
}

export async function fetchArtworks(page: number): Promise<{
  works: Artwork[];
  pagination: ArticPagination;
}> {
  const url =
    `${ARTIC_BASE}/artworks` +
    `?page=${page}&limit=50&fields=${FIELDS}` +
    `&query[term][is_public_domain]=true`;

  let response: Response;
  try {
    response = await fetch(url, { next: { revalidate: 3600 } });
  } catch {
    throw new ArticFetchError(0, "Network error — check your connection.");
  }

  if (!response.ok) {
    throw new ArticFetchError(
      response.status,
      `Could not load artworks (${response.status}).`
    );
  }

  const json: ArticApiResponse = await response.json();

  const works: Artwork[] = (json.data ?? [])
    .filter(
      (raw): raw is typeof raw & { image_id: string } => raw.image_id !== null
    )
    .map((raw) => ({
      id: raw.id,
      title: raw.title ?? "Untitled",
      artistDisplay: raw.artist_display?.split("\n")[0] ?? "Unknown artist",
      imageId: raw.image_id,
      dateDisplay: raw.date_display ?? null,
      mediumDisplay: raw.medium_display ?? null,
      placeOfOrigin: raw.place_of_origin ?? null,
      departmentTitle: raw.department_title ?? null,
    }));

  return { works, pagination: json.pagination };
}
