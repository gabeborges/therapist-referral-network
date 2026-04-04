import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — Therapist Referral Network",
};

const sectionTitle = "text-[1.125rem] font-semibold tracking-[-0.01em] mt-10 mb-3";
const bodyText = "text-[0.9375rem] leading-[1.7] mb-4";
const listStyle = "text-[0.9375rem] leading-[1.7] mb-4 pl-5 list-disc space-y-1";

export default function CookiesPage(): React.ReactElement {
  return (
    <div
      className="min-h-screen flex flex-col items-center px-6 pt-6 pb-20"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-[640px] w-full">
        <h1
          className="text-[1.75rem] font-bold tracking-[-0.02em] mb-2"
          style={{ color: "var(--fg)" }}
        >
          Cookie Policy
        </h1>
        <p className="text-[0.8125rem] mb-8" style={{ color: "var(--fg-3)" }}>
          Effective date: April 2026 &middot; Version 1.0
        </p>

        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            1. What Are Cookies
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Cookies are small text files stored on your device when you visit a website. They help
            the site remember your preferences and understand how you interact with it. We use
            cookies and similar technologies (such as local storage) to operate, secure, and improve
            Therapist Referral Network.
          </p>
        </section>

        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            2. Cookies We Use
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We group cookies into the following categories:
          </p>

          <h3 className="text-[0.9375rem] font-semibold mt-6 mb-2" style={{ color: "var(--fg)" }}>
            Essential
          </h3>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Required for the site to function. These handle authentication, session management,
            security, and your cookie consent preferences. They cannot be disabled.
          </p>

          <h3 className="text-[0.9375rem] font-semibold mt-6 mb-2" style={{ color: "var(--fg)" }}>
            Analytics
          </h3>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Help us understand how visitors use the site so we can improve it. These cookies collect
            anonymised usage data such as pages visited and time on site. They are only set if you
            give consent.
          </p>

          <h3 className="text-[0.9375rem] font-semibold mt-6 mb-2" style={{ color: "var(--fg)" }}>
            Session Recording
          </h3>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Allow us to record anonymised browsing sessions to identify usability issues and improve
            the experience. No personal health information is captured. These are only set if you
            give consent.
          </p>
        </section>

        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            3. How to Manage Cookies
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            When you first visit the site, a consent banner lets you accept, reject, or customise
            cookie preferences. You can update your choices at any time using the cookie settings
            icon in the bottom-left corner of the screen, or through your account settings.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            You can also manage cookies through your browser settings. Note that blocking essential
            cookies may prevent the site from working correctly.
          </p>
        </section>

        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            4. Third-Party Cookies
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We may use the following third-party services that set their own cookies:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>
              <strong>Google Analytics</strong> — anonymised usage statistics (analytics category)
            </li>
            <li>
              <strong>Vercel Analytics</strong> — performance monitoring (analytics category)
            </li>
          </ul>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Each third-party service operates under its own privacy and cookie policies.
          </p>
        </section>

        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            5. Updates to This Policy
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We may update this Cookie Policy from time to time. Changes will be posted on this page
            with an updated effective date. If we make significant changes, we will notify you
            through a consent banner so you can review your preferences.
          </p>
        </section>

        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            6. Contact
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            For questions about our use of cookies, contact us at{" "}
            <a
              href="mailto:hi@therapistreferralnetwork.com"
              className="underline"
              style={{ color: "var(--brand)" }}
            >
              hi@therapistreferralnetwork.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
