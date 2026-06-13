"use client";

import { useState, useEffect, useCallback } from "react";
import type { Artwork } from "@/types/artwork";

const STORAGE_KEY = "arquiz_votes_v1";

interface UseVoteHistoryReturn {
  history: Artwork[];
  addVote: (work: Artwork) => void;
  clearHistory: () => void;
  hydrated: boolean;
}

export function useVoteHistory(): UseVoteHistoryReturn {
  const [history, setHistory] = useState<Artwork[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Read from localStorage once on mount (client only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setHistory(JSON.parse(raw) as Artwork[]);
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Quota exceeded — silently fail; history is still correct in memory
    }
  }, [history, hydrated]);

  const addVote = useCallback((work: Artwork) => {
    // Prepend so most recent vote appears first; deduplicate by id
    setHistory((prev) =>
      prev.some((w) => w.id === work.id) ? prev : [work, ...prev]
    );
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addVote, clearHistory, hydrated };
}
