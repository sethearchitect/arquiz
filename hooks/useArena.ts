"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { pickTwo } from "@/lib/pickTwo";
import { useImagePreloader } from "./useImagePreloader";
import type { Artwork, ArtworkPair, VotePhase } from "@/types/artwork";

interface UseArenaReturn {
  pair: ArtworkPair | null;
  phase: VotePhase;
  winnerIdx: 0 | 1 | null;
  votes: number;
  advance: (chosenIdx: 0 | 1) => void;
  isReady: boolean;
}

export function useArena(
  pool: Artwork[],
  currentPage: number,
  totalPages: number,
  loadNextPage: () => Promise<void>
): UseArenaReturn {
  const [pair, setPair] = useState<ArtworkPair | null>(null);
  const [phase, setPhase] = useState<VotePhase>("idle");
  const [winnerIdx, setWinnerIdx] = useState<0 | 1 | null>(null);
  const [votes, setVotes] = useState(0);
  const [nextPair, setNextPair] = useState<ArtworkPair | null>(null);

  // Refs avoid stale closures inside setTimeout callbacks
  const seenRef = useRef<number[]>([]);
  const poolRef = useRef<Artwork[]>(pool);
  const currentPageRef = useRef(currentPage);
  const totalPagesRef = useRef(totalPages);
  const pairRef = useRef<ArtworkPair | null>(null);
  const phaseRef = useRef<VotePhase>("idle");

  useEffect(() => { poolRef.current = pool; }, [pool]);
  useEffect(() => { currentPageRef.current = currentPage; }, [currentPage]);
  useEffect(() => { totalPagesRef.current = totalPages; }, [totalPages]);
  useEffect(() => { pairRef.current = pair; }, [pair]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  useImagePreloader(nextPair);

  // Initialize pair when pool first becomes available
  useEffect(() => {
    if (pool.length >= 2 && !pairRef.current) {
      const initial = pickTwo(pool, []);
      if (initial) {
        setPair(initial);
        pairRef.current = initial;
        seenRef.current = [initial[0].id, initial[1].id];
        const preloadNext = pickTwo(pool, seenRef.current.slice(-20));
        setNextPair(preloadNext);
      }
    }
  }, [pool]);

  const advance = useCallback(
    (chosenIdx: 0 | 1) => {
      if (phaseRef.current !== "idle" || !pairRef.current) return;
      setPhase("voting");
      phaseRef.current = "voting";
      setWinnerIdx(chosenIdx);
      setVotes((v) => v + 1);

      // Speculatively compute next pair now for preloading during the animation
      const recentSeen = seenRef.current.slice(-20);
      const speculative = pickTwo(poolRef.current, recentSeen);
      setNextPair(speculative);

      // Proactively load more artworks if pool is running low
      const seenSet = new Set(recentSeen);
      const available = poolRef.current.filter((w) => !seenSet.has(w.id));
      if (available.length < 12 && currentPageRef.current < totalPagesRef.current) {
        loadNextPage();
      }

      setTimeout(() => {
        setPhase("transitioning");
        phaseRef.current = "transitioning";

        // If all pages loaded and pool is nearly fully cycled, reset the seen window
        if (
          currentPageRef.current >= totalPagesRef.current &&
          available.length < 4
        ) {
          seenRef.current = [];
        }

        const nextP = speculative ?? pairRef.current!;
        seenRef.current = [...seenRef.current, nextP[0].id, nextP[1].id];
        setPair(nextP);
        pairRef.current = nextP;

        requestAnimationFrame(() => {
          setTimeout(() => {
            setPhase("idle");
            phaseRef.current = "idle";
            setWinnerIdx(null);
            // Pre-compute the pair after this one
            const upcomingNext = pickTwo(
              poolRef.current,
              seenRef.current.slice(-20)
            );
            setNextPair(upcomingNext);
          }, 80);
        });
      }, 480);
    },
    [loadNextPage]
  );

  return {
    pair,
    phase,
    winnerIdx,
    votes,
    advance,
    isReady: pair !== null,
  };
}
