import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — Therapist Referral Network",
};

const sectionTitle = "text-[1.125rem] font-semibold tracking-[-0.01em] mt-10 mb-3";
const subSectionTitle = "text-[0.9375rem] font-semibold mt-6 mb-2";
const bodyText = "text-[0.9375rem] leading-[1.7] mb-4";
const listStyle = "text-[0.9375rem] leading-[1.7] mb-4 pl-5 list-disc space-y-1";
const tableWrapper = "overflow-x-auto mb-4";
const tableBase = "w-full text-[0.8125rem] leading-[1.6] border-collapse";
const thStyle = "text-left py-2 pr-4 font-semibold";
const tdStyle = "py-2 pr-4";
const rowBorder = { borderBottom: "1px solid var(--border-s)" };
const headerBorder = { borderBottom: "1px solid var(--border)" };

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
          Cookie policy
        </h1>
        <p className="text-[0.8125rem] mb-8" style={{ color: "var(--fg-3)" }}>
          Last updated: April 2026 &middot; Version 2.0
        </p>

        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            1. What are cookies
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Cookies are small text files stored on your device when you visit a website. They help
            the site remember your preferences and understand how you interact with it. We use
            cookies and similar technologies (such as browser local storage) to operate, secure, and
            improve Therapist Referral Network at therapistreferralnetwork.com.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            This policy explains what cookies we set, why, and how you can manage them. It should be
            read alongside our{" "}
            <a href="/privacy" className="underline" style={{ color: "var(--brand)" }}>
              privacy policy
            </a>
            , which describes how we collect and use personal information more broadly.
          </p>
        </section>

        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            2. Cookies we use
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We group cookies into two active categories: essential and analytics. Our consent
            interface also includes a session recording toggle for future use, described below.
          </p>

          <h3 className={subSectionTitle} style={{ color: "var(--fg)" }}>
            Essential cookies
          </h3>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Required for the site to function. These handle authentication, session management,
            security, and your cookie consent preferences. They cannot be disabled.
          </p>
          <div className={tableWrapper}>
            <table className={tableBase} style={{ color: "var(--fg-2)" }}>
              <thead>
                <tr style={headerBorder}>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>Cookie</th>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>Provider</th>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>Purpose</th>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr style={rowBorder}>
                  <td className={tdStyle}><code>authjs.session-token</code></td>
                  <td className={tdStyle}>Auth.js</td>
                  <td className={tdStyle}>Session token containing your user ID and authentication state</td>
                  <td className={tdStyle}>Session</td>
                </tr>
                <tr style={rowBorder}>
                  <td className={tdStyle}><code>authjs.csrf-token</code></td>
                  <td className={tdStyle}>Auth.js</td>
                  <td className={tdStyle}>Protects authentication forms against cross-site request forgery</td>
                  <td className={tdStyle}>Session</td>
                </tr>
                <tr style={rowBorder}>
                  <td className={tdStyle}><code>authjs.callback-url</code></td>
                  <td className={tdStyle}>Auth.js</td>
                  <td className={tdStyle}>Stores the redirect URL during the OAuth sign-in flow</td>
                  <td className={tdStyle}>Session</td>
                </tr>
                <tr style={rowBorder}>
                  <td className={tdStyle}><code>authjs.pkce.code_verifier</code></td>
                  <td className={tdStyle}>Auth.js</td>
                  <td className={tdStyle}>PKCE code verifier used during the OAuth flow for added security</td>
                  <td className={tdStyle}>Transient</td>
                </tr>
                <tr style={rowBorder}>
                  <td className={tdStyle}><code>consent-preferences</code></td>
                  <td className={tdStyle}>Therapist Referral Network</td>
                  <td className={tdStyle}>Stores your cookie consent choices (essential, analytics, session recording)</td>
                  <td className={tdStyle}>1 year</td>
                </tr>
                <tr>
                  <td className={tdStyle}><code>sb-*-auth-token</code></td>
                  <td className={tdStyle}>Supabase</td>
                  <td className={tdStyle}>Authentication token for our file storage service</td>
                  <td className={tdStyle}>Session</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            On HTTPS connections, some Auth.js cookies use secure prefixes
            (<code>__Secure-</code> or <code>__Host-</code>) for additional protection.
          </p>

          <h3 className={subSectionTitle} style={{ color: "var(--fg)" }}>
            Analytics cookies
          </h3>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Help us understand how visitors use the site so we can improve it. These cookies are
            blocked by default and only set after you give express consent via the cookie banner.
          </p>
          <div className={tableWrapper}>
            <table className={tableBase} style={{ color: "var(--fg-2)" }}>
              <thead>
                <tr style={headerBorder}>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>Cookie</th>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>Provider</th>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>Purpose</th>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr style={rowBorder}>
                  <td className={tdStyle}><code>_ga</code></td>
                  <td className={tdStyle}>Google (via GTM)</td>
                  <td className={tdStyle}>Pseudonymous visitor identifier for Google Analytics 4</td>
                  <td className={tdStyle}>Up to 2 years</td>
                </tr>
                <tr>
                  <td className={tdStyle}><code>_ga_*</code></td>
                  <td className={tdStyle}>Google (via GTM)</td>
                  <td className={tdStyle}>Maintains session state for Google Analytics 4</td>
                  <td className={tdStyle}>Up to 2 years</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            No therapist profile data, health information, or personally identifiable information is
            sent to analytics processors. Google Analytics 4 truncates IP addresses before storage,
            though Google receives the full IP address briefly for geolocation purposes.
          </p>

          <h3 className={subSectionTitle} style={{ color: "var(--fg)" }}>
            Session recording
          </h3>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Our consent interface includes a session recording toggle. As of the date of this policy,
            no session recording service is deployed and no session recording cookies are placed on
            your device, regardless of your toggle setting. If we add a session recording service in
            the future, we will update this policy and re-prompt you for consent before any session
            recording cookies are set.
          </p>
        </section>

        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            3. Similar technologies
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            In addition to cookies, we use browser local storage to remember your preferences. Local
            storage data stays on your device and is not sent to our servers.
          </p>
          <div className={tableWrapper}>
            <table className={tableBase} style={{ color: "var(--fg-2)" }}>
              <thead>
                <tr style={headerBorder}>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>Key</th>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>Purpose</th>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={tdStyle}><code>theme-preference</code></td>
                  <td className={tdStyle}>Stores your appearance preference (light, dark, or system)</td>
                  <td className={tdStyle}>Until cleared</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            4. Google Consent Mode
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We implement Google Consent Mode v2, which controls how Google services behave based on
            your consent choices. By default, all Google consent signals are set
            to &ldquo;denied&rdquo;:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>
              <strong style={{ color: "var(--fg)" }}>analytics_storage</strong> — updated
              to &ldquo;granted&rdquo; only when you accept analytics cookies
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>ad_storage, ad_user_data, ad_personalization</strong> —
              remain &ldquo;denied&rdquo; at all times (we do not use Google advertising features)
            </li>
          </ul>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            This means Google collects no data from your visit unless you expressly consent to
            analytics cookies.
          </p>
        </section>

        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            5. How to manage your preferences
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            You have several ways to control cookie preferences:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>
              <strong style={{ color: "var(--fg)" }}>Cookie consent banner.</strong> On your first
              visit, a banner offers three choices: Accept All, Reject All, or Customize.
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Cookie preferences link.</strong> You can change
              your choices at any time using the &ldquo;Cookie Preferences&rdquo; link in the site
              footer, which opens a preferences panel.
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Account settings.</strong> When signed in, the
              same toggles are available under your account settings.
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Browser settings.</strong> You can also manage
              cookies through your browser. Note that blocking essential cookies may prevent the site
              from functioning correctly.
            </li>
          </ul>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Rejecting all non-essential cookies has no effect on your ability to use the platform.
            All core features work without analytics cookies.
          </p>
        </section>

        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            6. Third-party services
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Analytics cookies are delivered through Google Tag Manager, which loads Google
            Analytics 4. Google operates under its own privacy and cookie policies. You can learn
            more at{" "}
            <a
              href="https://policies.google.com/privacy"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--brand)" }}
            >
              Google&apos;s privacy policy
            </a>
            .
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            No other third-party analytics or advertising services are currently deployed on this
            site.
          </p>
        </section>

        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            7. Data transfers
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            When you consent to analytics cookies, data collected by Google Analytics may be
            processed in the United States. Google operates under its own data processing terms.
            Therapist Referral Network primarily serves Canadian users, and we take reasonable steps
            to ensure that any cross-border data transfer complies with the Personal Information
            Protection and Electronic Documents Act (PIPEDA).
          </p>
        </section>

        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            8. Updates to this policy
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We may update this cookie policy from time to time. Changes will be posted on this page
            with an updated effective date. If we deploy new cookie categories (such as session
            recording) or make significant changes, we will notify you through the cookie consent
            banner so you can review and update your preferences.
          </p>
        </section>

        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            9. Contact
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
            . You may also contact the Office of the Privacy Commissioner of Canada at{" "}
            <a
              href="https://www.priv.gc.ca"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--brand)" }}
            >
              www.priv.gc.ca
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
