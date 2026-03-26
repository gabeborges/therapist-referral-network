"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CountryGateProps {
  onProceed: () => void;
}

const COUNTRIES = [
  { value: "", label: "Select your country..." },
  { value: "CA", label: "Canada" },
  { value: "US", label: "United States" },
  { value: "OTHER", label: "Other" },
] as const;

export function CountryGate({ onProceed }: CountryGateProps): React.ReactElement {
  const [country, setCountry] = useState("");
  const router = useRouter();

  function handleContinue(): void {
    if (country === "CA") {
      onProceed();
    } else if (country === "US" || country === "OTHER") {
      router.push(`/onboarding/waitlist?country=${encodeURIComponent(country)}`);
    }
  }

  return (
    <div className="bg-s1 border border-border rounded-md p-6 shadow-1">
      <h2 className="text-[1.25rem] font-semibold tracking-[-0.01em] leading-[1.35] text-fg mb-4">
        Where do you practice?
      </h2>
      <p className="text-[0.875rem] leading-[1.5] text-fg-2 mb-4">
        We are currently available in Canada. Select your country to continue.
      </p>

      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="w-full h-11 px-3 bg-inset text-fg border border-border rounded-sm text-[0.9375rem] font-sans cursor-pointer transition-[border-color,background,box-shadow] duration-150 ease-out pr-9 appearance-none focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 mb-4"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%238F8279' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
        }}
      >
        {COUNTRIES.map((c) => (
          <option key={c.value} value={c.value} disabled={c.value === ""}>
            {c.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!country}
        className="inline-flex items-center justify-center gap-2 w-full h-11 px-6 bg-brand text-brand-on border-none rounded-sm text-[0.8125rem] font-semibold tracking-[0.01em] cursor-pointer transition-[background] duration-150 ease-out font-sans hover:bg-brand-h focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
}
