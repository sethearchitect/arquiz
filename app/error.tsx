"use client";

import { useEffect } from "react";
import { ErrorScreen } from "@/components/ErrorScreen/ErrorScreen";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorScreen
      message="Something went wrong. Please try again."
      onRetry={reset}
    />
  );
}
