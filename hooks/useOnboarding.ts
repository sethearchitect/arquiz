"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "arquiz_onboarding_v1";

interface UseOnboardingReturn {
  step: number;
  isActive: boolean;
  hydrated: boolean;
  advance: () => void;
  dismiss: () => void;
}

export function useOnboarding(): UseOnboardingReturn {
  const [step, setStep] = useState(0); // 0 = unknown; 1–3 = active; 4 = done
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setStep(1); // first visit
    } catch {
      // localStorage unavailable — skip onboarding
    }
    setHydrated(true);
  }, []);

  // Persist completion once finished or dismissed
  useEffect(() => {
    if (!hydrated || (step > 0 && step < 4)) return;
    try {
      localStorage.setItem(STORAGE_KEY, "done");
    } catch {
      // quota exceeded — silently fail
    }
  }, [step, hydrated]);

  const advance = useCallback(() => setStep((p) => (p >= 3 ? 4 : p + 1)), []);
  const dismiss = useCallback(() => setStep(4), []);

  return { step, isActive: step >= 1 && step <= 3, hydrated, advance, dismiss };
}
