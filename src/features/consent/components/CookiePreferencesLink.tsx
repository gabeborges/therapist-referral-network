"use client";

import { useState } from "react";
import { ConsentPreferencesModal } from "@/features/consent/components/ConsentPreferencesModal";

export function CookiePreferencesLink(): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-[0.75rem] no-underline hover:underline bg-transparent border-none cursor-pointer p-0"
        style={{ color: "var(--fg-4)" }}
      >
        Cookies
      </button>
      <ConsentPreferencesModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
