"use client";

import { signOut } from "next-auth/react";

export function SignOutButton(): React.ReactElement {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="block w-full text-left px-4 py-2 text-[0.8125rem] font-medium transition-colors duration-150 cursor-pointer border-none bg-transparent"
      style={{ color: "var(--fg-2)", fontFamily: "inherit" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--inset)";
        e.currentTarget.style.color = "var(--fg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--fg-2)";
      }}
    >
      Sign out
    </button>
  );
}
