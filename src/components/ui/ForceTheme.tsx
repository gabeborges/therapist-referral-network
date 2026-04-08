"use client";

import { useEffect } from "react";

export function ForceTheme({ theme }: { theme: string }): null {
  useEffect(() => {
    const prev = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", theme);

    return () => {
      const stored =
        (typeof localStorage !== "undefined" && localStorage.getItem("theme-preference")) ||
        "system";
      document.documentElement.setAttribute(
        "data-theme",
        prev === theme ? stored : (prev ?? stored),
      );
    };
  }, [theme]);

  return null;
}
