import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use — Therapist Referral Network",
};

const sectionTitle = "text-[1.125rem] font-semibold tracking-[-0.01em] mt-10 mb-3";
const subSectionTitle = "text-[0.9375rem] font-semibold mt-6 mb-2";
const bodyText = "text-[0.9375rem] leading-[1.7] mb-4";
const listStyle = "text-[0.9375rem] leading-[1.7] mb-4 pl-5 list-disc space-y-1";
const capsBlock = "text-[0.8125rem] leading-[1.7] mb-4 uppercase";

export default function TermsPage(): React.ReactElement {
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
          Terms of use
        </h1>
        <p className="text-[0.8125rem] mb-8" style={{ color: "var(--fg-3)" }}>
          Last updated: April 4, 2026 &middot; Version 1.0
        </p>

        {/* Agreement intro */}
        <p className={bodyText} style={{ color: "var(--fg-2)" }}>
          We are Therapist Referral Network, operated by Gabriel Borges
          (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;).
        </p>
        <p className={bodyText} style={{ color: "var(--fg-2)" }}>
          We operate the Therapist Referral Network (therapistreferralnetwork.com), a web-based
          platform where licensed therapists create professional profiles and post referral requests
          to find other therapists for their clients, as well as any other related products and
          services that refer or link to these legal terms (the &ldquo;Legal Terms&rdquo;)
          (collectively, the &ldquo;Services&rdquo;).
        </p>
        <p className={bodyText} style={{ color: "var(--fg-2)" }}>
          You can contact us by email at{" "}
          <a
            href="mailto:hi@therapistreferralnetwork.com"
            className="underline"
            style={{ color: "var(--brand)" }}
          >
            hi@therapistreferralnetwork.com
          </a>{" "}
          or by mail to Gabriel Borges, Toronto, Ontario, Canada.
        </p>
        <p className={bodyText} style={{ color: "var(--fg-2)" }}>
          These Legal Terms constitute a legally binding agreement made between you, whether
          personally or on behalf of an entity (&ldquo;you&rdquo;), and Therapist Referral Network,
          concerning your access to and use of the Services. You agree that by accessing the
          Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF
          YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM
          USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
        </p>
        <p className={bodyText} style={{ color: "var(--fg-2)" }}>
          We reserve the right, in our sole discretion, to make changes or modifications to these
          Legal Terms at any time and for any reason. We will alert you about any changes by updating
          the &ldquo;Last updated&rdquo; date of these Legal Terms. For material changes, we will
          provide notice by email or by prominently posting a notice on the Services at least thirty
          (30) days before the changes take effect. Your continued use of the Services after such
          notice period constitutes acceptance of the revised Legal Terms. If you do not agree with
          the revised terms, you may delete your account before the changes take effect.
        </p>

        {/* 1. Our Services */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            1. Our Services
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            The Therapist Referral Network is a platform for licensed therapists and therapists in
            supervised practice. The Services enable therapists to:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>
              Create professional profiles with their specialties, location, modalities, languages,
              and other practice details
            </li>
            <li>
              Post referral requests describing client needs (in general, non-identifying terms) to
              find appropriate therapists
            </li>
            <li>
              Receive email notifications when their profile matches a referral request
            </li>
            <li>Track referral fulfillment</li>
          </ul>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            The Services are currently available in Canada, excluding the Province of Quebec. If you
            are located in the United States, you may join our waitlist to be notified when the
            service becomes available in your region.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            The platform does not collect or process any client or patient health information. All
            data on the platform belongs to therapists. Referral requests describe client needs in
            general terms (presenting issue, age group, location) and do not constitute personal
            information about the client being referred.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            The information provided when using the Services is not intended for distribution to or
            use by any person or entity in any jurisdiction or country where such distribution or use
            would be contrary to law or regulation or which would subject us to any registration
            requirement within such jurisdiction or country.
          </p>
        </section>

        {/* 2. Intellectual property rights */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            2. Intellectual property rights
          </h2>

          <h3 className={subSectionTitle} style={{ color: "var(--fg)" }}>
            Our intellectual property
          </h3>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We are the owner or the licensee of all intellectual property rights in our Services,
            including all source code, databases, functionality, software, website designs, text,
            photographs, and graphics in the Services (collectively, the &ldquo;Content&rdquo;), as
            well as the trademarks, service marks, and logos contained therein (the
            &ldquo;Marks&rdquo;).
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Our Content and Marks are protected by copyright and trademark laws and treaties around
            the world. The Content and Marks are provided in or through the Services &ldquo;AS
            IS&rdquo; for your personal, non-commercial use or internal business purpose only.
          </p>

          <h3 className={subSectionTitle} style={{ color: "var(--fg)" }}>
            Your use of our Services
          </h3>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Subject to your compliance with these Legal Terms, including the &ldquo;Prohibited
            activities&rdquo; section below, we grant you a non-exclusive, non-transferable,
            revocable license to: access the Services; and download or print a copy of any portion of
            the Content to which you have properly gained access, solely for your personal,
            non-commercial use or internal business purpose.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Except as set out in this section or elsewhere in our Legal Terms, no part of the
            Services and no Content or Marks may be copied, reproduced, aggregated, republished,
            uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed,
            sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our
            express prior written permission.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            If you wish to make any use of the Services, Content, or Marks other than as set out in
            this section or elsewhere in our Legal Terms, please address your request to{" "}
            <a
              href="mailto:hi@therapistreferralnetwork.com"
              className="underline"
              style={{ color: "var(--brand)" }}
            >
              hi@therapistreferralnetwork.com
            </a>
            .
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We reserve all rights not expressly granted to you in and to the Services, Content, and
            Marks. Any breach of these intellectual property rights will constitute a material breach
            of our Legal Terms and your right to use our Services will terminate immediately.
          </p>

          <h3 className={subSectionTitle} style={{ color: "var(--fg)" }}>
            Your submissions
          </h3>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            By directly sending us any question, comment, suggestion, idea, feedback, or other
            information about the Services (&ldquo;Submissions&rdquo;), you agree to assign to us
            all intellectual property rights in such Submission. You agree that we shall own this
            Submission and be entitled to its unrestricted use and dissemination for any lawful
            purpose, commercial or otherwise, without acknowledgment or compensation to you.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            By sending us Submissions through any part of the Services you:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>
              Confirm that you have read and agree with our &ldquo;Prohibited activities&rdquo; and
              will not post, send, publish, upload, or transmit through the Services any Submission
              that is illegal, harassing, hateful, harmful, defamatory, obscene, abusive,
              discriminatory, threatening to any person or group, sexually explicit, false,
              inaccurate, deceitful, or misleading
            </li>
            <li>
              To the extent permissible by applicable law, waive any and all moral rights to any such
              Submission
            </li>
            <li>
              Warrant that any such Submissions are original to you or that you have the necessary
              rights and licenses to submit such Submissions
            </li>
            <li>
              Warrant and represent that your Submissions do not constitute confidential information
            </li>
          </ul>
        </section>

        {/* 3. User representations */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            3. User representations
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            By using the Services, you represent and warrant that:
          </p>
          <ol
            className="text-[0.9375rem] leading-[1.7] mb-4 pl-5 list-decimal space-y-1"
            style={{ color: "var(--fg-2)" }}
          >
            <li>You have the legal capacity and you agree to comply with these Legal Terms</li>
            <li>You are at least 18 years of age</li>
            <li>
              You are a licensed therapist, a therapist in supervised practice, or a practicum
              student operating under the supervision of a licensed therapist, in good standing with
              your applicable regulatory body
            </li>
            <li>
              The credentials, licensing information, and professional details you provide on the
              platform are accurate and current
            </li>
            <li>
              You will not access the Services through automated or non-human means, whether through
              a bot, script, or otherwise
            </li>
            <li>You will not use the Services for any illegal or unauthorized purpose</li>
            <li>
              Your use of the Services will not violate any applicable law or regulation
            </li>
          </ol>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            If you provide any information that is untrue, inaccurate, not current, or incomplete, we
            have the right to suspend or terminate your account and refuse any and all current or
            future use of the Services (or any portion thereof).
          </p>
        </section>

        {/* 4. Professional conduct */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            4. Professional conduct
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            As a therapist using the Therapist Referral Network, you agree to:
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>Credential accuracy.</strong> Maintain accurate
            and current information about your professional credentials, licensing status, and
            regulatory standing. You must update your profile promptly if your licensing status
            changes (e.g., if you move from supervised practice to full licensure, or if your license
            is suspended or revoked).
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>Regulatory compliance.</strong> Comply with all
            obligations imposed by your professional regulatory body (e.g., College of Registered
            Psychotherapists of Ontario, College of Psychologists and Behaviour Analysts of Ontario,
            or equivalent in your province). Nothing in these Legal Terms overrides or limits your
            professional obligations.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>No client-identifying information.</strong> Do not
            include client names, contact information, or other personally identifying information
            about clients in referral requests or any other content on the platform. Referral
            requests should describe client needs in general terms only (e.g., presenting issue, age
            group, location, modality preference).
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>Referral responsibility.</strong> The Therapist
            Referral Network facilitates introductions between therapists. We do not verify the
            clinical qualifications, competence, or suitability of any therapist on the platform. You
            are solely responsible for evaluating the appropriateness of any therapist you refer a
            client to or accept a referral from.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            <strong style={{ color: "var(--fg)" }}>No therapeutic relationship.</strong> The
            Therapist Referral Network does not create, facilitate, or imply any therapeutic
            relationship between you and any client. The platform is a tool for therapist-to-therapist
            referrals only.
          </p>
        </section>

        {/* 5. Prohibited activities */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            5. Prohibited activities
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            You may not access or use the Services for any purpose other than that for which we make
            the Services available. As a user of the Services, you agree not to:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>
              Systematically retrieve data or other content from the Services to create or compile,
              directly or indirectly, a collection, compilation, database, or directory without
              written permission from us
            </li>
            <li>
              Trick, defraud, or mislead us and other users, especially in any attempt to learn
              sensitive account information such as user passwords
            </li>
            <li>
              Circumvent, disable, or otherwise interfere with security-related features of the
              Services
            </li>
            <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services</li>
            <li>
              Use any information obtained from the Services in order to harass, abuse, or harm
              another person
            </li>
            <li>
              Make improper use of our support services or submit false reports of abuse or misconduct
            </li>
            <li>
              Use the Services in a manner inconsistent with any applicable laws or regulations
            </li>
            <li>
              Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or
              other material that interferes with any party&apos;s uninterrupted use and enjoyment of
              the Services
            </li>
            <li>
              Engage in any automated use of the system, such as using scripts to send comments or
              messages, or using any data mining, robots, or similar data gathering and extraction
              tools
            </li>
            <li>
              Attempt to impersonate another user or person or use the username of another user
            </li>
            <li>
              Interfere with, disrupt, or create an undue burden on the Services or the networks or
              services connected to the Services
            </li>
            <li>
              Attempt to bypass any measures of the Services designed to prevent or restrict access to
              the Services, or any portion of the Services
            </li>
            <li>
              Except as permitted by applicable law, decipher, decompile, disassemble, or reverse
              engineer any of the software comprising or in any way making up a part of the Services
            </li>
            <li>
              Make any unauthorized use of the Services, including collecting usernames and/or email
              addresses of users by electronic or other means for the purpose of sending unsolicited
              email, or creating user accounts by automated means or under false pretenses
            </li>
            <li>
              Include client names, health conditions, contact information, or other personally
              identifying information about clients in referral requests, profile fields, or any
              other content on the platform
            </li>
          </ul>
        </section>

        {/* 6. User content and contributions */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            6. User content and contributions
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            The Services allow you to create and publish content, including therapist profiles and
            referral requests (collectively, &ldquo;Contributions&rdquo;). Contributions may be
            viewable by other registered users of the Services.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            When you create or make available any Contributions, you represent and warrant that:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>
              Your Contributions are accurate and truthful, particularly regarding professional
              credentials, licensing status, and practice details
            </li>
            <li>
              Your Contributions do not violate any applicable law or regulation, including the
              regulations of your professional regulatory body
            </li>
            <li>
              Your Contributions do not contain any personally identifying information about clients
            </li>
            <li>
              Your Contributions do not infringe on the intellectual property rights or privacy rights
              of any third party
            </li>
            <li>
              Your Contributions are not false, inaccurate, deceitful, or misleading
            </li>
          </ul>
        </section>

        {/* 7. Contribution license */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            7. Contribution license
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            You retain ownership of your profile data and Contributions. By creating or making
            available Contributions on the Services, you grant us a non-exclusive, worldwide,
            royalty-free license to use, display, reproduce, and distribute your Contributions solely
            for the purposes of operating and providing the Services, including:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>Displaying your therapist profile to other registered users</li>
            <li>Matching your profile against referral requests</li>
            <li>
              Sending referral notification emails that include your name, credentials, and relevant
              profile information to matched therapists
            </li>
            <li>Improving the Services through aggregate, anonymized analysis</li>
          </ul>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            This license terminates when you delete your account or remove your Contributions,
            subject to the data retention schedule described in our{" "}
            <a href="/privacy" className="underline" style={{ color: "var(--brand)" }}>
              Privacy Policy
            </a>
            .
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            By submitting suggestions or other feedback regarding the Services, you agree that we can
            use and share such feedback for any purpose without compensation to you.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We are not liable for any statements or representations in your Contributions. You are
            solely responsible for your Contributions to the Services.
          </p>
        </section>

        {/* 8. Affiliated services */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            8. Affiliated services and communications
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            The Therapist Referral Network is a free service. Referral notification emails may
            contain a clearly delineated section with information about affiliated services that
            provide tools for therapist practices:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>
              <strong style={{ color: "var(--fg)" }}>Curio</strong>{" "}
              (curio.health)&nbsp;&mdash; email encryption for therapist practices
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Quitewell</strong>{" "}
              (quitewell.marketing)&nbsp;&mdash; marketing tools for therapist practices
            </li>
          </ul>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            This content is informational and incidental to the primary transactional purpose of the
            email (delivering a referral match you signed up to receive). We do not send standalone
            marketing emails promoting affiliated services without your separate, express consent.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            By using the Services, you acknowledge that referral notification emails may include this
            affiliated service information. If you prefer not to see affiliated service content, you
            may contact us at{" "}
            <a
              href="mailto:hi@therapistreferralnetwork.com"
              className="underline"
              style={{ color: "var(--brand)" }}
            >
              hi@therapistreferralnetwork.com
            </a>{" "}
            to opt out of the sponsor section while continuing to receive referral notifications.
          </p>
        </section>

        {/* 9. Account deletion and data */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            9. Account deletion and data
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            You may request deletion of your account at any time through your account settings or by
            contacting us at{" "}
            <a
              href="mailto:hi@therapistreferralnetwork.com"
              className="underline"
              style={{ color: "var(--brand)" }}
            >
              hi@therapistreferralnetwork.com
            </a>
            .
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            When you delete your account:
          </p>
          <ul className={listStyle} style={{ color: "var(--fg-2)" }}>
            <li>Sensitive data (ethnicity, faith orientation) is deleted immediately</li>
            <li>Login credentials and sessions are deleted immediately</li>
            <li>Profile data (name, email, credentials) is deleted within 30 days</li>
            <li>Referral history is anonymized or deleted within 30 days</li>
            <li>
              Consent records are retained for 24 months after account closure as required for
              regulatory compliance
            </li>
            <li>Customer support logs are retained for 12 months</li>
          </ul>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            For complete details on how we handle your data, including backup retention and
            anonymization standards, see our{" "}
            <a href="/privacy" className="underline" style={{ color: "var(--brand)" }}>
              Privacy Policy
            </a>
            , Section 9.
          </p>
        </section>

        {/* 10. Services management */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            10. Services management
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We reserve the right, but not the obligation, to: (1) monitor the Services for
            violations of these Legal Terms; (2) take appropriate legal action against anyone who, in
            our sole discretion, violates the law or these Legal Terms, including without limitation,
            reporting such user to law enforcement authorities or their professional regulatory body;
            (3) in our sole discretion and without limitation, refuse, restrict access to, limit the
            availability of, or disable any of your Contributions or any portion thereof; (4) in our
            sole discretion and without limitation, notice, or liability, remove from the Services or
            otherwise disable all files and content that are excessive in size or are in any way
            burdensome to our systems; and (5) otherwise manage the Services in a manner designed to
            protect our rights and property and to facilitate the proper functioning of the Services.
          </p>
        </section>

        {/* 11. Term and termination */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            11. Term and termination
          </h2>
          <p className={capsBlock} style={{ color: "var(--fg-2)" }}>
            These Legal Terms shall remain in full force and effect while you use the Services.
            Without limiting any other provision of these Legal Terms, we reserve the right to, in
            our sole discretion and without notice or liability, deny access to and use of the
            Services (including blocking certain IP addresses), to any person for any reason or for
            no reason, including without limitation for breach of any representation, warranty, or
            covenant contained in these Legal Terms or of any applicable law or regulation. We may
            terminate your use or participation in the Services or delete any content or information
            that you posted at any time, without warning, in our sole discretion.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            If we terminate or suspend your account for any reason, you are prohibited from
            registering and creating a new account under your name, a fake or borrowed name, or the
            name of any third party, even if you may be acting on behalf of the third party. In
            addition to terminating or suspending your account, we reserve the right to take
            appropriate legal action, including without limitation pursuing civil, criminal, and
            injunctive redress.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Upon termination, your data will be handled in accordance with the retention schedule
            described in our{" "}
            <a href="/privacy" className="underline" style={{ color: "var(--brand)" }}>
              Privacy Policy
            </a>
            , Section 9.
          </p>
        </section>

        {/* 12. Modifications and interruptions */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            12. Modifications and interruptions
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We reserve the right to change, modify, or remove the contents of the Services at any
            time or for any reason at our sole discretion without notice. However, we have no
            obligation to update any information on our Services. We will not be liable to you or any
            third party for any modification, suspension, or discontinuance of the Services.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We cannot guarantee the Services will be available at all times. We may experience
            hardware, software, or other problems or need to perform maintenance related to the
            Services, resulting in interruptions, delays, or errors. We reserve the right to change,
            revise, update, suspend, discontinue, or otherwise modify the Services at any time or for
            any reason without notice to you. You agree that we have no liability whatsoever for any
            loss, damage, or inconvenience caused by your inability to access or use the Services
            during any downtime or discontinuance of the Services. Nothing in these Legal Terms will
            be construed to obligate us to maintain and support the Services or to supply any
            corrections, updates, or releases in connection therewith.
          </p>
        </section>

        {/* 13. Governing law */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            13. Governing law
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            These Legal Terms shall be governed by and construed in accordance with the laws of the
            Province of Ontario and the federal laws of Canada applicable therein. Therapist Referral
            Network and yourself irrevocably consent that the courts of the Province of Ontario shall
            have exclusive jurisdiction to resolve any dispute which may arise in connection with
            these Legal Terms.
          </p>
        </section>

        {/* 14. Dispute resolution */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            14. Dispute resolution
          </h2>

          <h3 className={subSectionTitle} style={{ color: "var(--fg)" }}>
            Informal negotiations
          </h3>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            To expedite resolution and control the cost of any dispute, controversy, or claim related
            to these Legal Terms (each a &ldquo;Dispute&rdquo; and collectively, the
            &ldquo;Disputes&rdquo;) brought by either you or us (individually, a &ldquo;Party&rdquo;
            and collectively, the &ldquo;Parties&rdquo;), the Parties agree to first attempt to
            negotiate any Dispute informally for at least thirty (30) days before initiating any
            court proceeding. Such informal negotiations commence upon written notice from one Party
            to the other Party.
          </p>

          <h3 className={subSectionTitle} style={{ color: "var(--fg)" }}>
            Jurisdiction
          </h3>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Any Dispute not resolved through informal negotiations shall be resolved exclusively in
            the courts of the Province of Ontario, Canada. The Parties agree to submit to the
            personal jurisdiction of the courts of the Province of Ontario.
          </p>

          <h3 className={subSectionTitle} style={{ color: "var(--fg)" }}>
            Restrictions
          </h3>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            The Parties agree that any proceedings shall be limited to the Dispute between the
            Parties individually. To the full extent permitted by law, (a) no proceeding shall be
            joined with any other proceeding; (b) there is no right or authority for any Dispute to
            be brought on a class-action basis or to utilize class action procedures; and (c) there
            is no right or authority for any Dispute to be brought in a purported representative
            capacity on behalf of the general public or any other persons. If any part of this
            restrictions provision is found to be unenforceable under applicable law, that part shall
            be severed and the remaining restrictions shall continue in full force and effect.
          </p>

          <h3 className={subSectionTitle} style={{ color: "var(--fg)" }}>
            Exceptions
          </h3>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            The Parties agree that the following Disputes are not subject to the above provisions
            concerning informal negotiations: (a) any Disputes seeking to enforce or protect, or
            concerning the validity of, any of the intellectual property rights of a Party; (b) any
            Dispute related to, or arising from, allegations of theft, piracy, invasion of privacy,
            or unauthorized use; and (c) any claim for injunctive relief.
          </p>
        </section>

        {/* 15. Corrections */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            15. Corrections
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            There may be information on the Services that contains typographical errors,
            inaccuracies, or omissions, including descriptions, availability, and various other
            information. We reserve the right to correct any errors, inaccuracies, or omissions and
            to change or update the information on the Services at any time, without prior notice.
          </p>
        </section>

        {/* 16. Disclaimer */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            16. Disclaimer
          </h2>
          <p className={capsBlock} style={{ color: "var(--fg-2)" }}>
            The Services are provided on an as-is and as-available basis. You agree that your use of
            the Services will be at your sole risk. To the fullest extent permitted by law, we
            disclaim all warranties, express or implied, in connection with the Services and your use
            thereof, including, without limitation, the implied warranties of merchantability, fitness
            for a particular purpose, and non-infringement. We make no warranties or representations
            about the accuracy or completeness of the Services&apos; content or the content of any
            websites linked to the Services and we will assume no liability or responsibility for any
            (1) errors, mistakes, or inaccuracies of content and materials, (2) personal injury or
            property damage, of any nature whatsoever, resulting from your access to and use of the
            Services, (3) any unauthorized access to or use of our secure servers and/or any and all
            personal information stored therein, (4) any interruption or cessation of transmission to
            or from the Services, (5) any bugs, viruses, Trojan horses, or the like which may be
            transmitted to or through the Services by any third party, and/or (6) any errors or
            omissions in any content and materials or for any loss or damage of any kind incurred as
            a result of the use of any content posted, transmitted, or otherwise made available via
            the Services.
          </p>
          <p className={capsBlock} style={{ color: "var(--fg-2)" }}>
            We do not verify the professional credentials, licensing status, clinical competence, or
            suitability of any therapist on the platform. The Therapist Referral Network is a
            matching tool only. You are solely responsible for evaluating the appropriateness of any
            referral and for all clinical decisions.
          </p>
        </section>

        {/* 17. Limitations of liability */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            17. Limitations of liability
          </h2>
          <p className={capsBlock} style={{ color: "var(--fg-2)" }}>
            In no event will we or our directors, employees, or agents be liable to you or any third
            party for any direct, indirect, consequential, exemplary, incidental, special, or
            punitive damages, including lost profit, lost revenue, loss of data, or other damages
            arising from your use of the Services, even if we have been advised of the possibility of
            such damages. Notwithstanding anything to the contrary contained herein, our liability to
            you for any cause whatsoever and regardless of the form of the action, will at all times
            be limited to the amount paid, if any, by you to us during the twelve (12) month period
            prior to any cause of action arising. The Services are provided free of charge, and
            accordingly our maximum liability is zero dollars ($0). Certain Canadian provincial laws
            do not allow limitations on implied warranties or the exclusion or limitation of certain
            damages. If these laws apply to you, some or all of the above disclaimers or limitations
            may not apply to you, and you may have additional rights.
          </p>
        </section>

        {/* 18. Indemnification */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            18. Indemnification
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            You agree to defend, indemnify, and hold us harmless, including our affiliates and all of
            our respective officers, agents, partners, and employees, from and against any loss,
            damage, liability, claim, or demand, including reasonable attorneys&apos; fees and
            expenses, made by any third party due to or arising out of: (1) use of the Services; (2)
            breach of these Legal Terms; (3) any breach of your representations and warranties set
            forth in these Legal Terms; (4) your violation of the rights of a third party, including
            but not limited to intellectual property rights; (5) any overt harmful act toward any
            other user of the Services with whom you connected via the Services; or (6) any
            personally identifying client information you include on the platform in violation of
            Section 4. Notwithstanding the foregoing, we reserve the right, at your expense, to
            assume the exclusive defense and control of any matter for which you are required to
            indemnify us, and you agree to cooperate, at your expense, with our defense of such
            claims. We will use reasonable efforts to notify you of any such claim, action, or
            proceeding which is subject to this indemnification upon becoming aware of it.
          </p>
        </section>

        {/* 19. User data */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            19. User data
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            We will maintain certain data that you transmit to the Services for the purpose of
            managing the performance of the Services, as well as data relating to your use of the
            Services. Although we perform regular routine backups of data, you are solely responsible
            for all data that you transmit or that relates to any activity you have undertaken using
            the Services. You agree that we shall have no liability to you for any loss or corruption
            of any such data, and you hereby waive any right of action against us arising from any
            such loss or corruption of such data.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            For full details about what data we collect, how we use it, and your rights regarding
            your data, see our{" "}
            <a href="/privacy" className="underline" style={{ color: "var(--brand)" }}>
              Privacy Policy
            </a>
            .
          </p>
        </section>

        {/* 20. Electronic communications */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            20. Electronic communications, transactions, and signatures
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Visiting the Services, sending us emails, and completing online forms constitute
            electronic communications. You consent to receive electronic communications, and you
            agree that all agreements, notices, disclosures, and other communications we provide to
            you electronically, via email and on the Services, satisfy any legal requirement that
            such communication be in writing. YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES,
            CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES,
            AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SERVICES. You hereby
            waive any rights or requirements under any statutes, regulations, rules, ordinances, or
            other laws in any jurisdiction which require an original signature or delivery or
            retention of non-electronic records, or to payments or the granting of credits by any
            means other than electronic means.
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Nothing in this section limits your rights under PIPEDA or applicable provincial privacy
            legislation, including your right to access, correct, or request deletion of your
            personal information, or to withdraw consent as described in our{" "}
            <a href="/privacy" className="underline" style={{ color: "var(--brand)" }}>
              Privacy Policy
            </a>
            .
          </p>
        </section>

        {/* 21. Miscellaneous */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            21. Miscellaneous
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            These Legal Terms and any policies or operating rules posted by us on the Services or in
            respect to the Services constitute the entire agreement and understanding between you and
            us. Our failure to exercise or enforce any right or provision of these Legal Terms shall
            not operate as a waiver of such right or provision. These Legal Terms operate to the
            fullest extent permissible by law. We may assign any or all of our rights and obligations
            to others at any time. We shall not be responsible or liable for any loss, damage, delay,
            or failure to act caused by any cause beyond our reasonable control. If any provision or
            part of a provision of these Legal Terms is determined to be unlawful, void, or
            unenforceable, that provision or part of the provision is deemed severable from these
            Legal Terms and does not affect the validity and enforceability of any remaining
            provisions. There is no joint venture, partnership, employment, or agency relationship
            created between you and us as a result of these Legal Terms or use of the Services. You
            agree that these Legal Terms will not be construed against us by virtue of having drafted
            them. You hereby waive any and all defenses you may have based on the electronic form of
            these Legal Terms and the lack of signing by the parties hereto to execute these Legal
            Terms.
          </p>
        </section>

        {/* 22. Contact us */}
        <section>
          <h2 className={sectionTitle} style={{ color: "var(--fg)" }}>
            22. Contact us
          </h2>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            In order to resolve a complaint regarding the Services or to receive further information
            regarding use of the Services, please contact us at:
          </p>
          <p className={bodyText} style={{ color: "var(--fg-2)" }}>
            Therapist Referral Network
            <br />
            Operated by Gabriel Borges
            <br />
            Toronto, Ontario, Canada
            <br />
            <a
              href="mailto:hi@therapistreferralnetwork.com"
              className="underline"
              style={{ color: "var(--brand)" }}
            >
              hi@therapistreferralnetwork.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
