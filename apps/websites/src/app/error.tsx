"use client";
import { ErrorState } from "@motchi/ui/error-state";
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState reset={reset} reference={error.digest} />;
}
