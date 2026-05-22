"use client";

import { useEffect, useRef } from "react";
import { getImageUrl } from "@/services/artic";
import type { ArtworkPair } from "@/types/artwork";

export function useImagePreloader(nextPair: ArtworkPair | null): void {
  const imagesRef = useRef<[HTMLImageElement, HTMLImageElement] | null>(null);

  useEffect(() => {
    // Cancel any in-flight preload
    if (imagesRef.current) {
      imagesRef.current[0].src = "";
      imagesRef.current[1].src = "";
      imagesRef.current = null;
    }

    if (!nextPair) return;

    const img0 = new Image();
    const img1 = new Image();
    img0.src = getImageUrl(nextPair[0].imageId);
    img1.src = getImageUrl(nextPair[1].imageId);
    imagesRef.current = [img0, img1];

    return () => {
      img0.src = "";
      img1.src = "";
    };
  }, [nextPair]);
}
