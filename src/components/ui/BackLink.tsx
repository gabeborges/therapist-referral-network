import Link from "next/link";

interface BackLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function BackLink({ href, children, className = "" }: BackLinkProps): React.ReactElement {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-brand no-underline hover:underline focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 rounded-[4px] ${className}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      {children}
    </Link>
  );
}
