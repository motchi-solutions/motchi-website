"use client";
import { ErrorState } from "../components/ui/error-state.tsx";
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState reset={reset} reference={error.digest} />;
}
