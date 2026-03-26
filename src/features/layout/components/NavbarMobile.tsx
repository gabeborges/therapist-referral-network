"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/features/layout/components/SignOutButton";

interface NavbarMobileProps {
  initials: string;
}

export function NavbarMobile({ initials }: NavbarMobileProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const links = [
    { href: "/referrals", label: "Referrals" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 flex items-center justify-center border-0 bg-transparent cursor-pointer"
        style={{ color: "var(--fg-2)" }}
        aria-label="Toggle navigation menu"
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay + slide-out panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.3)" }}
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div
            ref={panelRef}
            className="fixed top-0 right-0 bottom-0 z-50 w-[260px] flex flex-col"
            style={{
              background: "var(--s1)",
              borderLeft: "1px solid var(--border)",
              boxShadow: "var(--shadow-2)",
            }}
          >
            {/* Header with avatar + close */}
            <div className="flex items-center justify-between h-14 px-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[0.75rem] font-medium"
                style={{
                  background: "var(--inset)",
                  color: "var(--fg-2)",
                }}
              >
                {initials}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center border-0 bg-transparent cursor-pointer"
                style={{ color: "var(--fg-2)" }}
                aria-label="Close menu"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-col px-2 gap-1">
              {links.map((link) => {
                const isActive =
                  pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2.5 rounded-sm text-[0.875rem] font-medium no-underline transition-colors duration-150"
                    style={{
                      color: isActive ? "var(--fg)" : "var(--fg-2)",
                      background: isActive ? "var(--brand-l)" : "transparent",
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* New Referral button */}
            <div className="px-4 mt-4">
              <Link
                href="/referrals/new"
                className="flex items-center justify-center gap-2 w-full h-10 rounded-sm text-[0.8125rem] font-semibold tracking-[0.01em] no-underline transition-[background] duration-150 ease-out"
                style={{
                  background: "var(--brand)",
                  color: "var(--brand-on)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Referral
              </Link>
            </div>

            {/* Sign out at bottom */}
            <div
              className="mt-auto pb-6 pt-4"
              style={{ borderTop: "1px solid var(--border-s)" }}
            >
              <SignOutButton />
            </div>
          </div>
        </>
      )}
    </>
  );
}
