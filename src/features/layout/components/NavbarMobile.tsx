"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/features/layout/components/SignOutButton";
import { ThemeToggle } from "@/features/layout/components/ThemeToggle";

interface NavbarMobileProps {
  initials: string;
}

export function NavbarMobile({ initials }: NavbarMobileProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Focus close button when menu opens; return focus to hamburger on close
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    } else {
      hamburgerRef.current?.focus();
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const links = [
    { href: "/referrals", label: "Referrals" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <>
      {/* Hamburger button */}
      <button
        ref={hamburgerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 flex items-center justify-center border-0 bg-transparent cursor-pointer"
        style={{ color: "var(--fg-2)" }}
        aria-label="Toggle navigation menu"
      >
        <svg
          aria-hidden="true"
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
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
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
                ref={closeButtonRef}
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center border-0 bg-transparent cursor-pointer"
                style={{ color: "var(--fg-2)" }}
                aria-label="Close menu"
              >
                <svg
                  aria-hidden="true"
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
            <nav aria-label="Mobile navigation" className="flex flex-col px-2 gap-1">
              {links.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
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

            {/* Post a referral button */}
            <div className="px-4 mt-4">
              <Link
                href="/referrals/new"
                className="flex items-center justify-center w-full h-10 rounded-sm bg-brand text-brand-on hover:bg-brand-h text-[0.8125rem] font-semibold tracking-[0.01em] no-underline transition-[background] duration-150 ease-out"
              >
                Post a referral
              </Link>
            </div>

            {/* Theme + Sign out at bottom */}
            <div className="mt-auto pb-6 pt-4" style={{ borderTop: "1px solid var(--border-s)" }}>
              <div className="px-4 mb-3">
                <p
                  className="text-[0.6875rem] font-semibold tracking-[0.06em] uppercase mb-1.5"
                  style={{ color: "var(--fg-3)" }}
                >
                  Theme
                </p>
                <ThemeToggle />
              </div>
              <SignOutButton />
            </div>
          </div>
        </>
      )}
    </>
  );
}
