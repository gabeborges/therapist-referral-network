"use client";

import { Button } from "@/components/ui/Button";

interface ErrorBannerProps {
  title: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorBanner({ title, description, onRetry }: ErrorBannerProps): React.ReactElement {
  return (
    <div
      role="alert"
      className="p-4 rounded-md border border-err/20 bg-err-l flex gap-3 items-start"
    >
      <svg
        className="w-5 h-5 mt-0.5 shrink-0 text-err"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div>
        <p className="text-[0.9375rem] font-medium text-err">{title}</p>
        {description && <p className="text-[0.875rem] text-fg-2 mt-1">{description}</p>}
        {onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry} className="mt-3">
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}
