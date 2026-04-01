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
      className={`no-underline text-[0.8125rem] font-medium tracking-[0.01em] transition-colors duration-150 py-1 ${
        isActive ? "text-fg" : "text-fg-2 hover:text-fg"
      }`}
    >
      <span>
        {children}
        {isActive && <span className="block h-[2px] rounded-[1px] mt-0.5 bg-brand" />}
      </span>
    </Link>
  );
}
