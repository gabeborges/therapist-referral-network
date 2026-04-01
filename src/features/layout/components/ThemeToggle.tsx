"use client";

import { useTheme } from "@/features/layout/hooks/useTheme";

type Theme = "light" | "dark" | "system";

const options: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "system", label: "System" },
  { value: "dark", label: "Dark" },
];

export function ThemeToggle(): React.ReactElement {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 rounded-sm" style={{ background: "var(--inset)" }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          className={`flex-1 px-2 py-1 rounded-[4px] text-[0.6875rem] font-medium border-0 cursor-pointer transition-all duration-150 ${
            theme === opt.value ? "shadow-1" : ""
          }`}
          style={{
            background: theme === opt.value ? "var(--s2)" : "transparent",
            color: theme === opt.value ? "var(--fg)" : "var(--fg-3)",
            fontFamily: "inherit",
            boxShadow: theme === opt.value ? "var(--shadow-1)" : "none",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
