"use client";

import { useState } from "react";
import { ConsentPreferencesModal } from "@/features/consent/components/ConsentPreferencesModal";
import { Button } from "@/components/ui/Button";

export function CookiePreferencesLink(): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="text" onClick={() => setOpen(true)}>
        Cookies
      </Button>
      <ConsentPreferencesModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
