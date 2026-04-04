"use client";

import { useState } from "react";
import { ConsentPreferencesModal } from "@/features/consent/components/ConsentPreferencesModal";

interface CookiePreferencesLinkProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function CookiePreferencesLink({
  className,
  style,
  children = "Cookie Preferences",
}: CookiePreferencesLinkProps): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className={className} style={style} onClick={() => setOpen(true)}>
        {children}
      </button>
      <ConsentPreferencesModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
