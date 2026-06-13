"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchAfricanArtIds, fetchArtworkBatch } from "@/services/met";
import type { Artwork } from "@/types/artwork";

const BATCH_SIZE = 40;

interface UseArtPoolReturn {
  pool: Artwork[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  loadNextPage: () => Promise<void>;
  retry: () => void;
}

export function useArtPool(): UseArtPoolReturn {
  const [pool, setPool] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const allIdsRef = useRef<number[]>([]);
  const cursorRef = useRef(0);
  const isFetchingRef = useRef(false);

  // Handles both phases: load IDs (once) then fetch the next batch of objects
  const fetchNextBatch = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      // Phase 1: fetch all IDs if not yet loaded
      if (allIdsRef.current.length === 0) {
        const ids = await fetchAfricanArtIds();
        allIdsRef.current = ids;
      }

      // Phase 2: fetch next slice of objects
      const slice = allIdsRef.current.slice(cursorRef.current, cursorRef.current + BATCH_SIZE);
      if (slice.length === 0) return;

      const works = await fetchArtworkBatch(slice);
      cursorRef.current += slice.length;

      setPool((prev) => {
        const seen = new Set(prev.map((w) => w.id));
        return [...prev, ...works.filter((w) => !seen.has(w.id))];
      });
      setCurrentPage(Math.ceil(cursorRef.current / BATCH_SIZE));
      setTotalPages(Math.max(Math.ceil(allIdsRef.current.length / BATCH_SIZE), 1));
    } catch {
      setError(
        allIdsRef.current.length === 0
          ? "Could not load the African art collection."
          : "Could not load artworks. Please try again."
      );
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchNextBatch();
  }, [fetchNextBatch]);

  const loadNextPage = useCallback(async () => {
    if (currentPage < totalPages) {
      await fetchNextBatch();
    }
  }, [currentPage, totalPages, fetchNextBatch]);

  const retry = useCallback(() => {
    fetchNextBatch();
  }, [fetchNextBatch]);

  return { pool, isLoading, error, currentPage, totalPages, loadNextPage, retry };
}
