"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchArtworks, ArticFetchError } from "@/services/artic";
import type { Artwork } from "@/types/artwork";

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
  const isFetchingRef = useRef(false);
  const lastAttemptedPageRef = useRef(1);

  const fetchPage = useCallback(async (page: number) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    lastAttemptedPageRef.current = page;
    setIsLoading(true);
    setError(null);

    try {
      const { works, pagination } = await fetchArtworks(page);
      setPool((prev) => {
        const existingIds = new Set(prev.map((w) => w.id));
        const newWorks = works.filter((w) => !existingIds.has(w.id));
        return [...prev, ...newWorks];
      });
      setCurrentPage(pagination.current_page);
      setTotalPages(pagination.total_pages);
    } catch (err) {
      if (err instanceof ArticFetchError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const loadNextPage = useCallback(async () => {
    if (currentPage < totalPages) {
      await fetchPage(currentPage + 1);
    }
  }, [currentPage, totalPages, fetchPage]);

  const retry = useCallback(() => {
    const page = lastAttemptedPageRef.current;
    fetchPage(page);
  }, [fetchPage]);

  return { pool, isLoading, error, currentPage, totalPages, loadNextPage, retry };
}
