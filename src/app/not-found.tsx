import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { MatchRingLogo } from "@/features/auth/components/match-ring-logo";

export default function NotFound(): React.ReactElement {
  return (
    <div
      data-theme="light"
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "var(--bg)" }}
    >
      <EmptyState
        icon={<MatchRingLogo size={40} />}
        heading="Page not found"
        description="The page you're looking for doesn't exist or has been moved."
        action={
          <Link
            href="/"
            className="inline-flex items-center justify-center h-11 px-6 bg-brand text-brand-on border-none rounded-sm text-[0.8125rem] font-semibold tracking-[0.01em] no-underline transition-[background] duration-150 ease-out hover:bg-brand-h focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2"
          >
            Go home
          </Link>
        }
      />
    </div>
  );
}
