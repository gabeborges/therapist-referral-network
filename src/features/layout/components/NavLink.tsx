"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export function NavLink({ href, children }: NavLinkProps): React.ReactElement {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className="no-underline text-[0.8125rem] font-medium tracking-[0.01em] transition-colors duration-150 py-1"
      style={{
        color: isActive ? "var(--fg)" : "var(--fg-2)",
      }}
    >
      <span>
        {children}
        {isActive && (
          <span
            className="block h-[2px] rounded-[1px] mt-0.5"
            style={{ background: "var(--brand)" }}
          />
        )}
      </span>
    </Link>
  );
}
