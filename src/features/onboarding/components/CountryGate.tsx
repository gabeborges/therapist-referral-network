"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

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

      <Select value={country} onChange={(e) => setCountry(e.target.value)} className="mb-4">
        {COUNTRIES.map((c) => (
          <option key={c.value} value={c.value} disabled={c.value === ""}>
            {c.label}
          </option>
        ))}
      </Select>

      <Button type="button" onClick={handleContinue} disabled={!country} className="w-full">
        Continue
      </Button>
    </div>
  );
}
