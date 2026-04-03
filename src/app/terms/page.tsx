import type { Metadata } from "next";
import { BackLink } from "@/components/ui/BackLink";

export const metadata: Metadata = {
  title: "Terms of Service — Therapist Referral Network",
};

export default function TermsPage(): React.ReactElement {
  return (
    <div
      className="min-h-screen flex flex-col items-center px-6 py-20"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-[640px] w-full">
        <h1
          className="text-[1.75rem] font-bold tracking-[-0.02em] mb-6"
          style={{ color: "var(--fg)" }}
        >
          Terms of Service
        </h1>
        <p className="text-[0.9375rem] leading-[1.7] mb-8" style={{ color: "var(--fg-2)" }}>
          Terms of service are being prepared and will be published here shortly.
        </p>
        <BackLink href="/">Back to home</BackLink>
      </div>
    </div>
  );
}
