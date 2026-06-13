import type { Artwork } from "@/types/artwork";

const MET_BASE = "https://collectionapi.metmuseum.org/public/collection/v1";

export const BROKEN_IMAGE_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800'%3E%3Crect width='600' height='800' fill='%231a1a1a'/%3E%3C/svg%3E";

// Met returns full image URLs — return as-is (size param kept for interface compatibility)
export function getImageUrl(imageUrl: string, _size?: string): string {
  return imageUrl;
}

interface MetSearchResponse {
  total: number;
  objectIDs: number[] | null;
}

interface MetObject {
  objectID: number;
  title: string;
  artistDisplayName: string;
  artistDisplayBio: string;
  objectDate: string;
  medium: string;
  country: string;
  department: string;
  isPublicDomain: boolean;
  primaryImage: string;
  primaryImageSmall: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function fetchAfricanArtIds(): Promise<number[]> {
  const url =
    `${MET_BASE}/search` +
    `?q=africa&geoLocation=Africa&hasImages=true&isPublicDomain=true`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error("Network error — check your connection.");
  }

  if (!response.ok) {
    throw new Error(`Could not load artwork list (${response.status}).`);
  }

  const json: MetSearchResponse = await response.json();
  return shuffle(json.objectIDs ?? []);
}

export async function fetchArtworkBatch(ids: number[]): Promise<Artwork[]> {
  const results = await Promise.allSettled(
    ids.map(async (id) => {
      const res = await fetch(`${MET_BASE}/objects/${id}`);
      if (!res.ok) throw new Error(`Object ${id} not found`);
      return res.json() as Promise<MetObject>;
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<MetObject> => r.status === "fulfilled")
    .map((r) => r.value)
    .filter((obj) => obj.primaryImage && obj.isPublicDomain)
    .map((obj) => ({
      id: obj.objectID,
      title: obj.title || "Untitled",
      artistDisplay:
        [obj.artistDisplayName, obj.artistDisplayBio].filter(Boolean).join(", ") ||
        "Unknown artist",
      imageId: obj.primaryImage,
      dateDisplay: obj.objectDate || null,
      mediumDisplay: obj.medium || null,
      placeOfOrigin: obj.country || null,
      departmentTitle: obj.department || null,
    }));
}
