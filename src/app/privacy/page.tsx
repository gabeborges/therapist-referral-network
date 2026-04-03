import type { Metadata } from "next";
import { BackLink } from "@/components/ui/BackLink";

export const metadata: Metadata = {
  title: "Privacy Policy — Therapist Referral Network",
};

const sectionTitle = "text-[1.125rem] font-semibold tracking-[-0.01em] mt-10 mb-3";
const bodyText = "text-[0.9375rem] leading-[1.7] mb-4";
const listStyle = "text-[0.9375rem] leading-[1.7] mb-4 pl-5 list-disc space-y-1";

export default function PrivacyPage(): React.ReactElement {
  return (
    <div
      className="min-h-screen flex flex-col items-center px-6 py-20"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-[640px] w-full">
        <BackLink href="/">Back to home</BackLink>

        <h1
          className="text-[1.75rem] font-bold tracking-[-0.02em] mt-6 mb-2"
          style={{ color: "var(--fg)" }}
        >
          Privacy Policy
        </h1>
        <p className="text-[0.8125rem] mb-8" style={{ color: "var(--fg-3)" }}>
          Effective date: April 2026 &middot; Version 1.0
        </p>

        {/* TODO: Replace placeholder copy in each section */}

        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            1. Information We Collect
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            {/* Professional profile data, referral data, communities served data, analytics */}
            [Copy needed]
          </p>
        </section>

        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            2. How We Use Your Information
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            {/* Referral matching, professional directory, product improvement */}
            [Copy needed]
          </p>
        </section>

        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            3. Data Retention
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We retain your data only as long as necessary for the purposes described above. Our
            retention schedule:
          </p>
          <div className="overflow-x-auto mb-4">
            <table
              className="w-full text-[0.8125rem] leading-[1.6] border-collapse"
              style={{ color: "var(--fg-2)" }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--fg)" }}>
                    Data Category
                  </th>
                  <th className="text-left py-2 font-semibold" style={{ color: "var(--fg)" }}>
                    Retention Period
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--border-s)" }}>
                  <td className="py-2 pr-4">Profile data</td>
                  <td className="py-2">
                    Active account lifetime; deleted within 30 days of account closure
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-s)" }}>
                  <td className="py-2 pr-4">Communities served (faith, ethnicity)</td>
                  <td className="py-2">
                    Deleted immediately on consent withdrawal or account closure
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-s)" }}>
                  <td className="py-2 pr-4">Referral requests and matches</td>
                  <td className="py-2">90 days after referral fulfilled, expired, or cancelled</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-s)" }}>
                  <td className="py-2 pr-4">Consent records</td>
                  <td className="py-2">24 months after account closure</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Encrypted backups</td>
                  <td className="py-2">
                    Deleted data may persist in encrypted backups for up to 7 days
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            4. Third-Party Processors
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Your data may be processed by the following service providers located in the United
            States:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>
              <strong>Supabase</strong> — database hosting and authentication
            </li>
            <li>
              <strong>Vercel</strong> — application hosting
            </li>
            <li>
              <strong>Resend</strong> — transactional email delivery
            </li>
          </ul>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We have Data Processing Agreements in place with each processor. Your data is encrypted
            at rest (AES-256) and in transit (TLS).
          </p>
        </section>

        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            5. Your Rights
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Under PIPEDA and applicable provincial privacy legislation, you have the right to:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>
              <strong>Access</strong> your personal information
            </li>
            <li>
              <strong>Correct</strong> inaccurate or incomplete information
            </li>
            <li>
              <strong>Withdraw consent</strong> for communities served data at any time from your
              profile settings
            </li>
            <li>
              <strong>Delete your account</strong> from your account settings — sensitive data is
              deleted immediately, remaining data within 30 days
            </li>
          </ul>
        </section>

        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            6. Contact
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            For privacy inquiries, data access requests, or to exercise any of your rights, contact
            us at{" "}
            <a
              href="mailto:hi@therapistreferralnetwork.com"
              className="underline"
              style={{ color: "var(--brand)" }}
            >
              hi@therapistreferralnetwork.com
            </a>
            . We will respond within 30 days as required by PIPEDA.
          </p>
        </section>
      </div>
    </div>
  );
}
