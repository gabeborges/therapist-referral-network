import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Therapist Referral Network",
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

export default function PrivacyPage(): React.ReactElement {
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
          Privacy policy
        </h1>
        <p className="text-[0.8125rem] mb-8" style={{ color: "var(--fg-3)" }}>
          Last updated: April 4, 2026 &middot; Version 1.0
        </p>

        <p className={bodyText} style={{ color: "var(--fg-2)" }}>
          This privacy policy for Therapist Referral Network (&ldquo;we,&rdquo; &ldquo;us,&rdquo;
          or &ldquo;our&rdquo;), operated by Gabriel Borges, describes how and why we access, collect, store, use, and share
          (&ldquo;process&rdquo;) your personal information when you use our services
          (&ldquo;Services&rdquo;), including when you:
        </p>
        <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
          <li>
            Visit our website at therapistreferralnetwork.com or any website of ours that links to
            this privacy policy
          </li>
          <li>
            Use the Therapist Referral Network, a web-based platform where licensed therapists
            create professional profiles and post referral requests to find other therapists for
            their clients
          </li>
          <li>Engage with us in other related ways, including any events</li>
        </ul>
        <p className={bodyText} style={{ color: "var(--fg-2)" }}>
          <strong style={{ color: "var(--fg)" }}>Questions or concerns?</strong> Reading this
          privacy policy will help you understand your privacy rights and choices. We are responsible
          for making decisions about how your personal information is processed. If you do not agree
          with our policies and practices, please do not use our Services. If you still have any
          questions or concerns, please contact us at{" "}
          <a
            href="mailto:hi@therapistreferralnetwork.com"
            className="underline"
            style={{ color: "var(--brand)" }}
          >
            hi@therapistreferralnetwork.com
          </a>
          .
        </p>

        {/* Summary of key points */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            Summary of key points
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>
              What personal information do we process?
            </strong>{" "}
            When you visit, use, or navigate our Services, we may process personal information
            depending on how you interact with us and the Services, the choices you make, and the
            features you use.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>
              Do we process any sensitive personal information?
            </strong>{" "}
            Yes. When you choose to provide your ethnicity or faith orientation under &ldquo;communities
            served,&rdquo; we process this information only with your express consent. You may
            withdraw this consent at any time.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>
              Do we collect any information from third parties?
            </strong>{" "}
            We do not collect any information from third parties.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>
              Do we collect client or patient health information?
            </strong>{" "}
            No. The Therapist Referral Network collects information about therapists only. Referral
            requests describe client needs in general terms (presenting issue, age group, location)
            that are not personally identifiable under PIPEDA. We do not collect, store, or process
            any client or patient health information.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>How do we process your information?</strong> We
            process your information to provide, improve, and administer our Services, communicate
            with you, for security and fraud prevention, and to comply with law. We may also process
            your information for other purposes with your consent.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>
              Do our emails contain information about affiliated services?
            </strong>{" "}
            Yes. Referral notification emails include a section with information about Curio
            (curio.health) and Quitewell (quitewell.marketing), affiliated services that provide
            tools for therapist practices. This content is informational and incidental to the
            primary transactional purpose of the email. We do not send standalone marketing emails
            without separate consent.
          </p>
        </section>

        {/* 1. What information do we collect? */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            1. What information do we collect?
          </h2>

          <h3 className={subSectionTitle} style={{ color: "var(--fg)" }}>
            Personal information you provide to us
          </h3>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We collect personal information that you voluntarily provide to us when you register on
            the Services, create or update your therapist profile, post referral requests, or
            otherwise contact us.
          </p>

          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>Account and identity information.</strong> When
            you create an account, we collect:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>Name</li>
            <li>Email address (via Google OAuth)</li>
            <li>Country (used to determine service availability)</li>
          </ul>

          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>Professional profile information.</strong> When
            you create your therapist profile, we collect:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>Display name, first name, middle name, and last name</li>
            <li>Professional bio</li>
            <li>Pronouns and gender</li>
            <li>Profile image</li>
            <li>
              Credentials and licensing level (e.g., Registered Psychotherapist, Supervised Practice)
            </li>
            <li>Primary credential designation</li>
            <li>Specialties and presenting issues you treat</li>
            <li>Therapeutic approaches (e.g., CBT, EMDR, psychodynamic)</li>
            <li>Modalities offered (in-person, virtual, phone)</li>
            <li>Location (city, province)</li>
            <li>Website URL and Psychology Today profile URL</li>
            <li>Contact email</li>
            <li>Languages spoken</li>
            <li>Age groups served</li>
            <li>Participants served (individual, couples, family, group)</li>
            <li>Therapy style preferences</li>
            <li>Insurance accepted, specific insurers, and direct billing availability</li>
            <li>Payment methods accepted</li>
            <li>Session rates (individual, couples, family, group)</li>
            <li>Pro bono and reduced fee availability</li>
            <li>Whether you are currently accepting clients</li>
            <li>Free consultation availability</li>
          </ul>

          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>Referral request information.</strong> When you
            post a referral request, we collect:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>Presenting issue</li>
            <li>Age group</li>
            <li>City and province</li>
            <li>Preferred modalities</li>
            <li>Insurance requirement</li>
            <li>Participant type</li>
            <li>Rate preference</li>
            <li>Therapist gender preference</li>
            <li>Preferred therapy types</li>
            <li>Preferred languages</li>
            <li>Additional context (free text)</li>
          </ul>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Note: referral request fields describe the general needs of a referral and are not
            personally identifiable under PIPEDA. They do not constitute personal information about
            the client being referred. The &ldquo;additional context&rdquo; field accepts free
            text&nbsp;&mdash; therapists should not include client names or other personally
            identifying information in this field. We do not use free-text content for purposes
            beyond referral matching.
          </p>

          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>Waitlist information.</strong> If you are located in the United States, we collect your email address to notify you
            when the service becomes available in your region.
          </p>

          <h3 className={subSectionTitle} style={{ color: "var(--fg)" }}>
            Sensitive personal information
          </h3>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            See Section 2 below for detailed information about how we handle sensitive personal
            information.
          </p>

          <h3 className={subSectionTitle} style={{ color: "var(--fg)" }}>
            Information automatically collected
          </h3>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We automatically collect certain information when you visit, use, or navigate the
            Services. This information does not reveal your specific identity (like your name or
            contact information) but may include device and usage information, such as your IP
            address, browser and device characteristics, operating system, language preferences,
            referring URLs, device name, country, location, information about how and when you use
            our Services, and other technical information. This information is primarily needed to
            maintain the security and operation of our Services, and for our internal analytics and
            reporting purposes.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Like many businesses, we also collect information through cookies and similar
            technologies, subject to your consent. You can find out more about this in our{" "}
            <a href="/cookies" className="underline" style={{ color: "var(--brand)" }}>
              cookie policy
            </a>
            .
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            The information we collect includes:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>
              <strong style={{ color: "var(--fg)" }}>Log and usage data.</strong> Service-related,
              diagnostic, usage, and performance information our servers automatically collect when
              you access or use our Services. This may include your IP address, device information,
              browser type and settings, and information about your activity in the Services (such as
              date/time stamps, pages and files viewed, searches, and other actions you take).
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Device data.</strong> Information about your
              computer, phone, tablet, or other device you use to access the Services. Depending on
              the device used, this may include your IP address (or proxy server), device and
              application identification numbers, location, browser type, hardware model, internet
              service provider, operating system, and system configuration information.
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Activity data.</strong> We track when you last
              used the platform to prioritize active profiles in referral matching. This timestamp is
              not displayed to other users.
            </li>
          </ul>

          <h3 className={subSectionTitle} style={{ color: "var(--fg)" }}>
            What happens when you consent to analytics cookies
          </h3>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            If you consent to analytics cookies via our cookie consent banner, the following
            technical data is shared with Google Analytics and PostHog for product improvement
            purposes:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>
              IP address (GA4 truncates before storage, but Google receives the full IP for
              geolocation processing)
            </li>
            <li>
              Client ID cookie (<code>_ga</code>&nbsp;&mdash; a pseudonymous identifier tied to
              browsing behavior)
            </li>
            <li>
              Device and browser identifiers (user agent, screen resolution, language, operating
              system)
            </li>
            <li>Browsing behavior (page views, clicks, events, session duration)</li>
          </ul>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>
              No therapist profile data is sent to analytics processors.
            </strong>{" "}
            Google Analytics and PostHog receive only technical and behavioral data from users who
            have opted in. We do not include therapist names, emails, or other profile identifiers in
            analytics events or URL parameters.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            These services process data in the United States under their own privacy policies:{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: "var(--brand)" }}
            >
              Google Privacy &amp; Terms
            </a>
            ,{" "}
            <a
              href="https://posthog.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: "var(--brand)" }}
            >
              PostHog Privacy Policy
            </a>
            .
          </p>
        </section>

        {/* 2. Sensitive personal information */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            2. Sensitive personal information
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            When you create your therapist profile, you may optionally provide:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>
              <strong style={{ color: "var(--fg)" }}>Ethnicity</strong>&nbsp;&mdash; the cultural or
              ethnic communities you serve
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Faith orientation</strong>&nbsp;&mdash; the
              faith communities you serve
            </li>
          </ul>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            This information is classified as sensitive personal information under PIPEDA because it
            may reveal racial or ethnic origins and religious or philosophical beliefs.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>Why we collect it.</strong> This data enables
            culturally matched referrals between therapists&nbsp;&mdash; helping referring therapists
            find colleagues who serve specific communities.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>It is optional.</strong> These fields are not
            required to use the platform. You can create a full profile and receive referral matches
            without providing communities served information.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>Express consent required.</strong> We collect this
            data only with your express consent, provided via a separate, dedicated
            checkbox&nbsp;&mdash; not bundled with the general Terms of Service or Privacy Policy
            agreement. This checkbox appears adjacent to the ethnicity and faith orientation fields
            when you fill them in.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>Withdrawal of consent.</strong> You can withdraw
            your consent at any time from your profile settings. When you withdraw consent:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>Your communities served data is removed from your public profile immediately</li>
            <li>
              The underlying data (ethnicity and faith orientation fields) is{" "}
              <strong style={{ color: "var(--fg)" }}>deleted immediately</strong>&nbsp;&mdash; not
              retained, not archived
            </li>
            <li>Your ability to use all other platform features is unaffected</li>
          </ul>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>On account closure.</strong> If you delete your
            account, all communities served data is deleted immediately regardless of consent status.
            There is no retention period for sensitive data.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>Reclassification note.</strong> We frame ethnicity
            and faith orientation as populations you <em>serve</em> rather than personal identity
            attributes. However, because the Office of the Privacy Commissioner of Canada (OPC) may
            treat this as a proxy for personal identity, we apply express consent and independent
            withdrawability as safeguards.
          </p>
        </section>

        {/* 3. How do we process your information? */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            3. How do we process your information?
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We process your personal information for a variety of reasons, depending on how you
            interact with our Services, including:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>
              <strong style={{ color: "var(--fg)" }}>
                To facilitate account creation and authentication
              </strong>{" "}
              and otherwise manage user accounts
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>To provide referral matching</strong> by
              comparing referral request criteria against therapist profiles based on specialties,
              location, language, modalities, and (where consent is given) communities served
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>To send referral notifications</strong> by
              email via Resend when your profile matches a referral request
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>To send fulfillment check emails</strong> to
              track whether referrals were successfully completed
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>To maintain the directory</strong> by displaying
              your therapist profile to other registered therapists
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>To improve our Services</strong> through
              analytics and product usage data (only with your cookie consent)
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>To respond to your inquiries</strong> and
              provide customer support
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>To protect our Services</strong> through
              security monitoring, fraud prevention, and abuse detection
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>To comply with legal obligations</strong>{" "}
              including privacy law requirements and breach notification duties
            </li>
          </ul>
        </section>

        {/* 4. What legal bases do we rely on? */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            4. What legal bases do we rely on to process your information?
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            If you are located in Canada, this section applies to you.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We may process your information if you have given us specific permission (i.e., express
            consent) to use your personal information for a specific purpose, or in situations where
            your permission can be inferred (i.e., implied consent). You can withdraw your consent at
            any time.
          </p>

          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>How consent works on our platform:</strong>
          </p>
          <div className={tableWrapper}>
            <table className={tableBase} style={{ color: "var(--fg-2)" }}>
              <thead>
                <tr style={headerBorder}>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>
                    Data type
                  </th>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>
                    Consent type
                  </th>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>
                    Mechanism
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={rowBorder}>
                  <td className={tdStyle}>Standard profile fields (name, email, credentials, location)</td>
                  <td className={tdStyle}>Implied</td>
                  <td className={tdStyle}>
                    Registration constitutes consent for the primary purpose of referral matching and
                    directory listing
                  </td>
                </tr>
                <tr style={rowBorder}>
                  <td className={tdStyle}>Ethnicity and faith orientation (communities served)</td>
                  <td className={tdStyle}>Express</td>
                  <td className={tdStyle}>
                    Separate checkbox adjacent to fields, not bundled with Terms of Service,
                    withdrawable anytime from profile settings
                  </td>
                </tr>
                <tr style={rowBorder}>
                  <td className={tdStyle}>General Terms of Service and privacy policy</td>
                  <td className={tdStyle}>Express</td>
                  <td className={tdStyle}>Separate checkbox at registration</td>
                </tr>
                <tr>
                  <td className={tdStyle}>Cookies (analytics, session recording)</td>
                  <td className={tdStyle}>Express opt-in</td>
                  <td className={tdStyle}>
                    Banner with Accept All / Reject All / Customize; all non-essential scripts
                    blocked by default
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We may be authorized by law to process your information without your consent in some
            exceptional cases, including, for example:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>
              If collection is clearly in the interests of an individual and consent cannot be
              obtained in a timely way
            </li>
            <li>For investigations and fraud detection and prevention</li>
            <li>For business transactions provided certain conditions are met</li>
            <li>
              If disclosure is required to comply with a subpoena, warrant, court order, or rules of
              the court relating to the production of records
            </li>
            <li>
              If the information is publicly available and is specified by the regulations
            </li>
          </ul>
        </section>

        {/* 5. When and with whom do we share your personal information? */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            5. When and with whom do we share your personal information?
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We may need to share your personal information with third-party vendors, service
            providers, contractors, or agents (&ldquo;third parties&rdquo;) who perform services for
            us or on our behalf and require access to such information to do that work. We establish
            data processing agreements with our third parties, which are designed to help safeguard
            your personal information. These agreements require that third parties cannot do anything
            with your personal information unless we have instructed them to do it, will not share
            your personal information with any organization apart from us, and commit to protect the
            data they hold on our behalf and to retain it for the period we instruct.
          </p>

          <div className={tableWrapper}>
            <table className={tableBase} style={{ color: "var(--fg-2)" }}>
              <thead>
                <tr style={headerBorder}>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>
                    Processor
                  </th>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>
                    Role
                  </th>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>
                    Data shared
                  </th>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>
                    Location
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={rowBorder}>
                  <td className={tdStyle}><strong>Supabase</strong></td>
                  <td className={tdStyle}>Database hosting</td>
                  <td className={tdStyle}>Full therapist profile data</td>
                  <td className={tdStyle}>United States</td>
                </tr>
                <tr style={rowBorder}>
                  <td className={tdStyle}><strong>Vercel</strong></td>
                  <td className={tdStyle}>Application hosting</td>
                  <td className={tdStyle}>Request/server logs (IP, user agent)</td>
                  <td className={tdStyle}>United States</td>
                </tr>
                <tr style={rowBorder}>
                  <td className={tdStyle}><strong>Resend</strong></td>
                  <td className={tdStyle}>Transactional email</td>
                  <td className={tdStyle}>Name, email (for delivery)</td>
                  <td className={tdStyle}>United States</td>
                </tr>
                <tr style={rowBorder}>
                  <td className={tdStyle}><strong>Google Analytics</strong></td>
                  <td className={tdStyle}>Web analytics (with cookie consent)</td>
                  <td className={tdStyle}>IP address, device identifiers, browsing behavior</td>
                  <td className={tdStyle}>United States</td>
                </tr>
                <tr style={rowBorder}>
                  <td className={tdStyle}><strong>PostHog</strong></td>
                  <td className={tdStyle}>Product analytics (with cookie consent)</td>
                  <td className={tdStyle}>IP address, device identifiers, session data</td>
                  <td className={tdStyle}>United States</td>
                </tr>
                <tr style={rowBorder}>
                  <td className={tdStyle}><strong>Google OAuth</strong></td>
                  <td className={tdStyle}>Authentication</td>
                  <td className={tdStyle}>Name, email (received from Google at login)</td>
                  <td className={tdStyle}>United States</td>
                </tr>
                <tr>
                  <td className={tdStyle}><strong>Sentry</strong></td>
                  <td className={tdStyle}>Error monitoring</td>
                  <td className={tdStyle}>Error reports, device/browser info</td>
                  <td className={tdStyle}>United States</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We remain accountable for your personal information even when it is processed by these
            third parties, in accordance with PIPEDA Principle 4.1.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We also may need to share your personal information in the following situations:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>
              <strong style={{ color: "var(--fg)" }}>Business transfers.</strong> We may share or
              transfer your information in connection with, or during negotiations of, any merger,
              sale of company assets, financing, or acquisition of all or a portion of our business
              to another company.
            </li>
          </ul>
        </section>

        {/* 6. Cookies */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            6. Do we use cookies and other tracking technologies?
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We may use cookies and similar tracking technologies (like web beacons and pixels) to
            gather information when you interact with our Services.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>Essential cookies</strong> are required for the
            platform to function (authentication, session management) and are active by default.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>Analytics cookies</strong> (Google Analytics,
            PostHog) are blocked by default and only activated when you provide express consent via
            our cookie consent banner. You can change your cookie preferences at any time using the
            cookie preferences link in our site footer, or through your account settings when
            logged in.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            For more details, see our{" "}
            <a href="/cookies" className="underline" style={{ color: "var(--brand)" }}>
              cookie policy
            </a>
            .
          </p>
        </section>

        {/* 7. Social logins */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            7. How do we handle your social logins?
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Our Services offer you the ability to register and log in using your Google account.
            Where you choose to do this, we will receive certain profile information about you from
            Google. The profile information we receive includes your name and email address.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We will use the information we receive only for the purposes that are described in this
            privacy policy or that are otherwise made clear to you on the relevant Services. Please
            note that we do not control, and are not responsible for, other uses of your personal
            information by Google. We recommend that you review their privacy policy to understand
            how they collect, use, and share your personal information.
          </p>
        </section>

        {/* 8. International transfers */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            8. Is your information transferred internationally?
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Our application is deployed on Vercel (United States) and our database is hosted on
            Supabase (United States). All third-party processors listed in Section 5 are located in
            the United States.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            If you are a resident of Canada, please be aware that your personal information is
            transferred to, stored by, and processed in the United States. The United States may not
            have data protection laws as comprehensive as those in Canada. However, we will take all
            necessary measures to protect your personal information in accordance with this privacy
            policy and applicable law, including:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>
              Entering into data processing agreements (DPAs) with all processors that handle
              personal information
            </li>
            <li>
              Requiring that processors maintain appropriate security safeguards (encryption at rest
              and in transit, access controls)
            </li>
            <li>
              Remaining accountable for your personal information under PIPEDA Principle 4.1,
              regardless of where it is processed
            </li>
          </ul>
        </section>

        {/* 9. Retention */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            9. How long do we keep your information?
          </h2>

          <h3 className={subSectionTitle} style={{ color: "var(--fg)" }}>
            While your account is active
          </h3>
          <div className={tableWrapper}>
            <table className={tableBase} style={{ color: "var(--fg-2)" }}>
              <thead>
                <tr style={headerBorder}>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>
                    Data category
                  </th>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>
                    Retention period
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={rowBorder}>
                  <td className={tdStyle}>Therapist profile (name, email, credentials, location, specialties)</td>
                  <td className={tdStyle}>Active account lifetime</td>
                </tr>
                <tr style={rowBorder}>
                  <td className={tdStyle}>Communities served (ethnicity, faith orientation)</td>
                  <td className={tdStyle}>
                    Active account lifetime, or until you withdraw consent&nbsp;&mdash; whichever
                    comes first
                  </td>
                </tr>
                <tr style={rowBorder}>
                  <td className={tdStyle}>Referral requests and match records</td>
                  <td className={tdStyle}>90 days after the referral is fulfilled or expires</td>
                </tr>
                <tr style={rowBorder}>
                  <td className={tdStyle}>Consent records (consent timestamps, policy versions)</td>
                  <td className={tdStyle}>Account lifetime plus 24 months after closure</td>
                </tr>
                <tr>
                  <td className={tdStyle}>Analytics and cookies data</td>
                  <td className={tdStyle}>
                    Per vendor defaults (Google Analytics: 14 months; PostHog: configurable)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className={subSectionTitle} style={{ color: "var(--fg)" }}>
            After you delete your account
          </h3>
          <div className={tableWrapper}>
            <table className={tableBase} style={{ color: "var(--fg-2)" }}>
              <thead>
                <tr style={headerBorder}>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>
                    Data category
                  </th>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>
                    Retention after closure
                  </th>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>
                    Justification
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={rowBorder}>
                  <td className={tdStyle}>Communities served data</td>
                  <td className={tdStyle}><strong>Deleted immediately</strong></td>
                  <td className={tdStyle}>Sensitive data&nbsp;&mdash; no purpose survives account closure</td>
                </tr>
                <tr style={rowBorder}>
                  <td className={tdStyle}>Login credentials and sessions</td>
                  <td className={tdStyle}><strong>Deleted immediately</strong></td>
                  <td className={tdStyle}>No purpose after closure</td>
                </tr>
                <tr style={rowBorder}>
                  <td className={tdStyle}>Profile data (name, email, credentials)</td>
                  <td className={tdStyle}>Deleted within 30 days</td>
                  <td className={tdStyle}>30-day window allows for any pending access requests</td>
                </tr>
                <tr style={rowBorder}>
                  <td className={tdStyle}>Referral history involving your profile</td>
                  <td className={tdStyle}>Anonymized or deleted within 30 days</td>
                  <td className={tdStyle}>
                    If retained for aggregate analytics, all therapist identifiers are removed
                  </td>
                </tr>
                <tr style={rowBorder}>
                  <td className={tdStyle}>Consent records</td>
                  <td className={tdStyle}>Retained for 24 months</td>
                  <td className={tdStyle}>
                    Required as compliance proof in the event of a regulatory inquiry
                  </td>
                </tr>
                <tr>
                  <td className={tdStyle}>Customer support logs</td>
                  <td className={tdStyle}>Retained for 12 months</td>
                  <td className={tdStyle}>To address any post-closure concerns</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className={subSectionTitle} style={{ color: "var(--fg)" }}>
            Backup retention
          </h3>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Deleted data may persist in encrypted Supabase database backups for 7 to 30 days
            (depending on our plan tier) before automatic rotation removes it. During this period,
            backups are encrypted (AES-256) and are not selectively restored. We do not recover
            deleted personal information from backups unless legally compelled to do so.
          </p>

          <h3 className={subSectionTitle} style={{ color: "var(--fg)" }}>
            Anonymization standard
          </h3>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            When we anonymize data (for example, referral history for aggregate analytics), we follow
            the standard established by the Office of the Privacy Commissioner of Canada: there must
            be no serious possibility that the information can be re-identified, either alone or in
            combination with other available information. We aggregate data across multiple records
            and remove all direct and indirect identifiers.
          </p>
        </section>

        {/* 10. Security */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            10. How do we keep your information safe?
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We have implemented appropriate and reasonable technical and organizational security
            measures designed to protect the security of any personal information we process,
            including:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>Encryption at rest (AES-256) and in transit (TLS)</li>
            <li>Access controls and authentication</li>
            <li>Server-side access controls on all database queries</li>
            <li>Audit logging for sensitive data access and consent changes</li>
            <li>SOC 2 Type 2 compliant infrastructure (Supabase)</li>
          </ul>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            However, despite our safeguards and efforts to secure your information, no electronic
            transmission over the Internet or information storage technology can be guaranteed to be
            100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other
            unauthorized third parties will not be able to defeat our security and improperly
            collect, access, steal, or modify your information. Although we will do our best to
            protect your personal information, transmission of personal information to and from our
            Services is at your own risk. You should only access the Services within a secure
            environment.
          </p>
        </section>

        {/* 11. Minors */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            11. Do we collect information from minors?
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We do not knowingly collect, solicit data from, or market to children under 18 years of
            age. The Therapist Referral Network is designed for licensed therapists and therapists in
            supervised practice. By using the Services, you represent that you are at least 18 years
            of age. If we learn that personal information from users under 18 years of age has been
            collected, we will deactivate the account and take reasonable measures to promptly delete
            such data from our records. If you become aware of any data we may have collected from
            children under age 18, please contact us at{" "}
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

        {/* 12. Your privacy rights */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            12. What are your privacy rights?
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Under PIPEDA and applicable provincial privacy legislation, you have the following
            rights:
          </p>
          <div className={tableWrapper}>
            <table className={tableBase} style={{ color: "var(--fg-2)" }}>
              <thead>
                <tr style={headerBorder}>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>
                    Right
                  </th>
                  <th className={thStyle} style={{ color: "var(--fg)" }}>
                    Our commitment
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={rowBorder}>
                  <td className={tdStyle}>Access your personal data</td>
                  <td className={tdStyle}>We will respond within 30 days</td>
                </tr>
                <tr style={rowBorder}>
                  <td className={tdStyle}>Correct inaccurate personal data</td>
                  <td className={tdStyle}>We will respond within 30 days</td>
                </tr>
                <tr style={rowBorder}>
                  <td className={tdStyle}>Delete your account and personal data</td>
                  <td className={tdStyle}>
                    We will process within 30 days (sensitive data: immediately)
                  </td>
                </tr>
                <tr style={rowBorder}>
                  <td className={tdStyle}>Withdraw consent for communities served data</td>
                  <td className={tdStyle}>
                    Immediate effect on your public profile; underlying data deleted
                  </td>
                </tr>
                <tr>
                  <td className={tdStyle}>Withdraw cookie consent</td>
                  <td className={tdStyle}>
                    Immediate effect; accessible from the cookie preferences link in the site footer or your account settings
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>Withdrawing your consent.</strong> If we are
            relying on your consent to process your personal information, you have the right to
            withdraw your consent at any time. You can withdraw your consent by:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>Updating your profile settings (for communities served consent)</li>
            <li>
              Using the cookie preferences link in the site footer or your account settings (for
              analytics cookies)
            </li>
            <li>
              Deleting your account (for all profile data processed under implied
              consent&nbsp;&mdash; see Section 18)
            </li>
            <li>
              Contacting us at{" "}
              <a
                href="mailto:hi@therapistreferralnetwork.com"
                className="underline"
                style={{ color: "var(--brand)" }}
              >
                hi@therapistreferralnetwork.com
              </a>{" "}
              (for any other consent)
            </li>
          </ul>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Please note that withdrawing consent will not affect the lawfulness of the processing
            before its withdrawal, nor will it affect the processing of your personal information
            conducted in reliance on lawful processing grounds other than consent.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>
              Opting out of marketing and promotional communications.
            </strong>{" "}
            We do not send standalone marketing or promotional emails without separate consent. All
            referral notification emails are transactional. If we ever introduce optional marketing
            communications, you will be able to unsubscribe at any time by clicking the unsubscribe
            link in those emails.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>Account information.</strong> If you would like to
            review or change the information in your account, or terminate your account, you can log
            in to your account settings and update your profile or request account deletion. Upon
            your request to terminate your account, we will deactivate or delete your account and
            information according to the retention schedule described in Section 9.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>Complaints and challenges.</strong> If you are
            dissatisfied with how we handle your personal information or respond to your privacy
            requests, you may:
          </p>
          <ol
            className="text-[0.9375rem] leading-[1.7] mb-4 pl-5 list-decimal space-y-1"
            style={{ color: "var(--fg-2)" }}
          >
            <li>
              Contact us at{" "}
              <a
                href="mailto:hi@therapistreferralnetwork.com"
                className="underline"
                style={{ color: "var(--brand)" }}
              >
                hi@therapistreferralnetwork.com
              </a>{" "}
              to file a complaint. We will investigate and respond to your complaint.
            </li>
            <li>
              If you are not satisfied with our response, you have the right to file a complaint with
              the Office of the Privacy Commissioner of Canada (OPC) at{" "}
              <a
                href="https://www.priv.gc.ca/en/report-a-concern/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "var(--brand)" }}
              >
                priv.gc.ca/en/report-a-concern
              </a>
              .
            </li>
          </ol>
        </section>

        {/* 13. Affiliated service communications */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            13. Affiliated service communications
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Referral notification emails sent by the Therapist Referral Network may contain a clearly
            delineated section with information about affiliated services:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>
              <strong style={{ color: "var(--fg)" }}>Curio</strong> (curio.health)&nbsp;&mdash;
              email encryption for therapist practices
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Quitewell</strong>{" "}
              (quitewell.marketing)&nbsp;&mdash; marketing tools for therapist practices
            </li>
          </ul>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            This content is informational and incidental to the primary transactional purpose of the
            email (delivering a referral match you signed up to receive). The sponsor section is
            separated from referral content and does not exceed a minor portion of the email.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            The platform does not send standalone marketing emails promoting affiliated services
            without your separate, express consent. If we ever introduce such communications, we will
            provide a separate opt-in mechanism and include an unsubscribe option in every email, in
            compliance with Canada&apos;s Anti-Spam Legislation (CASL).
          </p>
        </section>

        {/* 14. Breach notification */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            14. Breach notification
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            In the event of a breach of security safeguards involving your personal information that
            creates a real risk of significant harm, we will:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>
              Notify the Office of the Privacy Commissioner of Canada (OPC) as soon as practicable
            </li>
            <li>
              Notify you as soon as practicable, describing the nature of the breach, the personal
              information involved, the steps we have taken to reduce the risk of harm, and the steps
              you can take to protect yourself
            </li>
            <li>
              Maintain a record of the breach for 24 months, as required by PIPEDA
            </li>
          </ul>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            A &ldquo;breach of security safeguards&rdquo; means the loss of, unauthorized access to,
            or unauthorized disclosure of personal information resulting from a breach of our
            security safeguards or a failure to establish those safeguards.
          </p>
        </section>

        {/* 15. DNT */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            15. Controls for do-not-track features
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Most web browsers and some mobile operating systems include a Do-Not-Track
            (&ldquo;DNT&rdquo;) feature or setting you can activate to signal your privacy
            preference not to have data about your online browsing activities monitored and
            collected. At this stage, no uniform technology standard for recognizing and implementing
            DNT signals has been finalized. As such, we do not currently respond to DNT browser
            signals or any other mechanism that automatically communicates your choice not to be
            tracked online. If a standard for online tracking is adopted that we must follow in the
            future, we will inform you about that practice in a revised version of this privacy
            policy.
          </p>
        </section>

        {/* 16. Updates */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            16. Do we make updates to this notice?
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We may update this privacy policy from time to time. The updated version will be
            indicated by an updated &ldquo;Last updated&rdquo; date at the top of this privacy
            policy. If we make material changes to this privacy policy, we may notify you either by
            prominently posting a notice of such changes or by directly sending you a notification.
            We encourage you to review this privacy policy frequently to be informed of how we are
            protecting your information.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            This policy is drafted to meet federal PIPEDA requirements. As we expand to additional
            provinces, we will update this policy to address applicable provincial privacy
            legislation.
          </p>
        </section>

        {/* 17. Contact */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            17. How can you contact us about this notice?
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            If you have questions or comments about this notice, you may email us at{" "}
            <a
              href="mailto:hi@therapistreferralnetwork.com"
              className="underline"
              style={{ color: "var(--brand)" }}
            >
              hi@therapistreferralnetwork.com
            </a>{" "}
            or contact us by post at:
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Gabriel Borges
            <br />
            Toronto, Ontario
            <br />
            Canada
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>Privacy accountability.</strong> Gabriel Borges is
            responsible for our privacy compliance practices and can be reached at the contact
            information above.
          </p>
        </section>

        {/* 18. Review, update, delete */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            18. How can you review, update, or delete the data we collect from you?
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Based on the applicable laws of your country, you have the right to request access to the
            personal information we collect from you, details about how we have processed it, correct
            inaccuracies, or delete your personal information. You may also have the right to
            withdraw your consent to our processing of your personal information.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            To review or update your personal information, log in to your account settings. To
            request account deletion or to exercise any other privacy right, please contact us at{" "}
            <a
              href="mailto:hi@therapistreferralnetwork.com"
              className="underline"
              style={{ color: "var(--brand)" }}
            >
              hi@therapistreferralnetwork.com
            </a>
            . We will respond to all requests within 30 days.
          </p>
        </section>
      </div>
    </div>
  );
}
