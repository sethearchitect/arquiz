import type { Artwork } from "@/types/artwork";

const CMA_BASE = "https://openaccess-api.clevelandart.org/api";

export const BROKEN_IMAGE_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800'%3E%3Crect width='600' height='800' fill='%231a1a1a'/%3E%3C/svg%3E";

// CMA returns full image URLs — return as-is (size param kept for interface compatibility)
export function getImageUrl(imageUrl: string, _size?: string): string {
  return imageUrl;
}

interface CMAImage {
  url: string;
  width: string;
  height: string;
}

interface CMAObject {
  id: number;
  title: string;
  creators: { description: string }[];
  creation_date: string;
  technique: string;
  culture: string[];
  department: string;
  images: {
    web?: CMAImage;
    print?: CMAImage;
  } | null;
}

interface CMAResponse {
  data: CMAObject[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function mapToArtwork(obj: CMAObject): Artwork {
  return {
    id: obj.id,
    title: obj.title || "Untitled",
    artistDisplay: obj.creators?.[0]?.description || "Unknown artist",
    imageId: obj.images?.web?.url ?? obj.images?.print?.url ?? "",
    dateDisplay: obj.creation_date || null,
    mediumDisplay: obj.technique || null,
    placeOfOrigin: obj.culture?.[0] || null,
    departmentTitle: obj.department || null,
  };
}

// Module-level cache — populated on first fetchAfricanArtIds call
const artworkCache = new Map<number, Artwork>();

export async function fetchAfricanArtIds(): Promise<number[]> {
  const url =
    `${CMA_BASE}/artworks/` +
    `?department=African%20Art&has_image=1&cc0=1&limit=1000` +
    `&fields=id,title,creators,creation_date,technique,culture,department,images`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error("Network error — check your connection.");
  }

  if (!response.ok) {
    throw new Error(`Could not load artwork list (${response.status}).`);
  }

  const json: CMAResponse = await response.json();

  const valid = json.data.filter(
    (obj) => obj.images?.web?.url || obj.images?.print?.url
  );

  artworkCache.clear();
  valid.forEach((obj) => artworkCache.set(obj.id, mapToArtwork(obj)));

  return shuffle(valid.map((obj) => obj.id));
}

export async function fetchArtworkBatch(ids: number[]): Promise<Artwork[]> {
  return ids.flatMap((id) => {
    const work = artworkCache.get(id);
    return work ? [work] : [];
  });
}
