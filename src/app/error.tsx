"use client";

import Link from "next/link";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.ReactElement {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "var(--bg)" }}
    >
      <div className="w-full max-w-[400px]">
        <ErrorBanner
          title="Something went wrong"
          description="An unexpected error occurred. Please try again."
          onRetry={reset}
        />
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-[0.8125rem] font-medium no-underline hover:underline"
            style={{ color: "var(--brand)" }}
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
