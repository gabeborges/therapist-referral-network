"use client";

interface OnboardingStepCountryProps {
  country: string;
  onSelect: (country: string) => void;
}

export function OnboardingStepCountry({
  country,
  onSelect,
}: OnboardingStepCountryProps): React.ReactElement {
  return (
    <div role="radiogroup" aria-label="Country selection" className="space-y-3">
      <button
        type="button"
        role="radio"
        aria-checked={country === "CA"}
        onClick={() => onSelect("CA")}
        className={`flex items-center justify-center gap-3 w-full h-[72px] px-5 rounded-[10px] cursor-pointer transition-all duration-150 ease-out font-sans relative hover:border-border-e hover:bg-inset focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 ${
          country === "CA"
            ? "border-2 border-brand bg-[var(--brand-tint)]"
            : "border border-border bg-s1"
        }`}
      >
        <span className="text-[1rem] font-semibold tracking-[-0.005em] text-fg">Canada</span>
        <span
          className={`absolute right-5 w-5 h-5 items-center justify-center text-brand ${country === "CA" ? "flex" : "hidden"}`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={country === "US"}
        onClick={() => onSelect("US")}
        className={`flex items-center justify-center gap-3 w-full h-[72px] px-5 rounded-[10px] cursor-pointer transition-all duration-150 ease-out font-sans relative hover:border-border-e hover:bg-inset focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 ${
          country === "US"
            ? "border-2 border-brand bg-[var(--brand-tint)]"
            : "border border-border bg-s1"
        }`}
      >
        <span className="text-[1rem] font-semibold tracking-[-0.005em] text-fg">United States</span>
        <span
          className={`absolute right-5 w-5 h-5 items-center justify-center text-brand ${country === "US" ? "flex" : "hidden"}`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      </button>
    </div>
  );
}
