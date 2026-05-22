"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { Artwork } from "@/types/artwork";

const STORAGE_KEY = "arquiz_collection_v1";

interface UseCollectionReturn {
  collection: Artwork[];
  isInCollection: (id: number) => boolean;
  toggleItem: (work: Artwork) => void;
  clearCollection: () => void;
  hydrated: boolean;
}

export function useCollection(): UseCollectionReturn {
  const [collection, setCollection] = useState<Artwork[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Read from localStorage once on mount (client only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setCollection(JSON.parse(raw) as Artwork[]);
      }
    } catch {
      // Corrupted storage — start fresh
    }
    setHydrated(true);
  }, []);

  // Write back on every change, but only after hydration
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
    } catch {
      // Quota exceeded — silently fail; collection is still correct in memory
    }
  }, [collection, hydrated]);

  // O(1) lookup via Set
  const collectionSet = useMemo(
    () => new Set(collection.map((w) => w.id)),
    [collection]
  );

  const isInCollection = useCallback(
    (id: number) => collectionSet.has(id),
    [collectionSet]
  );

  const toggleItem = useCallback((work: Artwork) => {
    setCollection((prev) =>
      prev.some((c) => c.id === work.id)
        ? prev.filter((c) => c.id !== work.id)
        : [...prev, work]
    );
  }, []);

  const clearCollection = useCallback(() => {
    setCollection([]);
  }, []);

  return { collection, isInCollection, toggleItem, clearCollection, hydrated };
}
