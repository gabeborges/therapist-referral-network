"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { SignOutButton } from "@/features/layout/components/SignOutButton";
import { ThemeToggle } from "@/features/layout/components/ThemeToggle";

interface UserAvatarProps {
  initials: string;
  imageUrl?: string | null;
}

export function UserAvatar({ initials, imageUrl }: UserAvatarProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-[0.75rem] tracking-[0.015em] leading-[1.4] font-medium cursor-pointer border-0 overflow-hidden"
        style={{
          background: "var(--inset)",
          color: "var(--fg-2)",
          fontFamily: "inherit",
        }}
        aria-label="User menu"
      >
        {imageUrl ? <img src={imageUrl} alt="" className="w-full h-full object-cover" /> : initials}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-48 rounded-md py-1 z-50"
          style={{
            background: "var(--s2)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-2)",
          }}
        >
          <div className="px-3 py-2">
            <ThemeToggle />
          </div>
          <div className="my-1" style={{ borderTop: "1px solid var(--border-s)" }} />
          <Link
            href="/account/settings"
            className="block w-full text-center px-4 py-2 text-[0.8125rem] font-medium transition-[color] duration-150 no-underline"
            style={{ color: "var(--fg-2)" }}
          >
            Settings
          </Link>
          <div className="my-1" style={{ borderTop: "1px solid var(--border-s)" }} />
          <SignOutButton />
        </div>
      )}
    </div>
  );
}
