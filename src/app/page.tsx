import Link from "next/link";
import { MatchRingLogo } from "@/features/auth/components/match-ring-logo";

const FACEBOOK_COMMUNITY_URL = "https://www.facebook.com/groups/canadiantherapyreferralnetwork";

const STEPS = [
  {
    number: 1,
    title: "Create your profile",
    description: "Add your specialties, location, modalities, and availability.",
  },
  {
    number: 2,
    title: "Post a referral",
    description: "Describe the presenting issue, preferred location, and modality.",
  },
  {
    number: 3,
    title: "Get matched",
    description: "We notify matching therapists. You stay in the loop until the client connects.",
  },
];

const BENEFITS = [
  {
    title: "Matched by specialty, not guesswork",
    description:
      "Referrals are matched by presenting issue, modality, location, and availability. No more scrolling directories or asking around.",
  },
  {
    title: "Stay in the loop",
    description:
      "Know when a therapist responds to your referral and when your client connects. No more wondering if it went anywhere.",
  },
  {
    title: "A network of your colleagues",
    description:
      "A growing community of Canadian therapists who refer to each other. The more who join, the better the matches.",
  },
];

export default function LandingPage(): React.ReactElement {
  return (
    <div
      data-theme="light"
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      {/* ─── Hero ─── */}
      <section
        aria-label="Hero"
        className="flex flex-col items-center px-6 pt-16 pb-14 sm:pt-20 sm:pb-16 text-center"
      >
        <div className="mb-5">
          <MatchRingLogo size={72} />
        </div>

        <h1
          className="text-[1.75rem] sm:text-[2.25rem] font-bold tracking-[-0.025em] leading-[1.15] m-0 mb-3 max-w-[520px]"
          style={{ color: "var(--fg)" }}
        >
          The right therapist for every referral
        </h1>

        <p
          className="text-[0.9375rem] sm:text-[1rem] leading-[1.6] m-0 mb-7 max-w-[420px]"
          style={{ color: "var(--fg-2)" }}
        >
          Structured referral matching for Canadian therapists. Post a referral, get matched by
          specialty, and know when your client connects.
        </p>

        <Link
          href="/auth/signup"
          className="inline-flex items-center justify-center h-12 px-8 bg-brand text-brand-on border-none rounded-sm text-[0.9375rem] font-semibold tracking-[0.01em] no-underline transition-[background] duration-150 ease-out hover:bg-brand-h focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2"
        >
          Sign up
        </Link>

        <p className="text-[0.8125rem] mt-3 m-0" style={{ color: "var(--fg-3)" }}>
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="no-underline font-medium hover:underline"
            style={{ color: "var(--brand)" }}
          >
            Sign in
          </Link>
        </p>
      </section>

      {/* ─── How it works ─── */}
      <section
        aria-label="How it works"
        className="px-6 py-12 sm:py-16"
        style={{ background: "var(--s1)" }}
      >
        <div className="max-w-[800px] mx-auto">
          <h2
            className="text-[0.8125rem] font-semibold tracking-[0.06em] uppercase text-center mb-8 m-0"
            style={{ color: "var(--fg-3)" }}
          >
            How It Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="rounded-[10px] p-5 sm:p-6"
                style={{
                  background: "var(--s2)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-1)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[0.8125rem] font-bold mb-3"
                  style={{
                    background: "var(--brand)",
                    color: "var(--brand-on)",
                  }}
                >
                  {step.number}
                </div>

                <h3
                  className="text-[0.9375rem] font-semibold tracking-[-0.005em] m-0 mb-1.5"
                  style={{ color: "var(--fg)" }}
                >
                  {step.title}
                </h3>

                <p className="text-[0.8125rem] leading-[1.55] m-0" style={{ color: "var(--fg-2)" }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why therapists use it ─── */}
      <section aria-label="Why therapists use it" className="px-6 py-12 sm:py-16">
        <div className="max-w-[600px] mx-auto">
          <h2
            className="text-[0.8125rem] font-semibold tracking-[0.06em] uppercase text-center mb-8 m-0"
            style={{ color: "var(--fg-3)" }}
          >
            Why Therapists Use It
          </h2>

          <div className="flex flex-col gap-4">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="flex gap-4 rounded-[10px] p-5"
                style={{
                  background: "var(--s2)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-1)",
                }}
              >
                <div className="w-1 shrink-0 rounded-full" style={{ background: "var(--brand)" }} />
                <div>
                  <h3
                    className="text-[0.9375rem] font-semibold tracking-[-0.005em] m-0 mb-1"
                    style={{ color: "var(--fg)" }}
                  >
                    {benefit.title}
                  </h3>
                  <p
                    className="text-[0.8125rem] leading-[1.55] m-0"
                    style={{ color: "var(--fg-2)" }}
                  >
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Community + CTA band ─── */}
      <section
        aria-label="Community and signup"
        className="px-6 py-12 sm:py-16"
        style={{ background: "var(--brand-l)" }}
      >
        <div className="max-w-[520px] mx-auto text-center">
          <h2
            className="text-[1.25rem] sm:text-[1.375rem] font-semibold m-0 mb-3"
            style={{ color: "var(--fg)" }}
          >
            Your next referral deserves a better process
          </h2>

          <p className="text-[0.9375rem] leading-[1.6] m-0 mb-6" style={{ color: "var(--fg-2)" }}>
            Join a growing network of Canadian therapists who refer to each other with confidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center h-11 px-7 bg-brand text-brand-on border-none rounded-sm text-[0.875rem] font-semibold tracking-[0.01em] no-underline transition-[background] duration-150 ease-out hover:bg-brand-h focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2"
            >
              Sign up
            </Link>

            <a
              href={FACEBOOK_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-11 px-7 bg-s2 text-fg border border-border rounded-sm text-[0.875rem] font-semibold tracking-[0.01em] no-underline transition-[border-color,box-shadow] duration-150 ease-out hover:border-border-e hover:shadow-1 focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2"
            >
              Join the Facebook group
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer
        className="px-6 py-6 text-center mt-auto"
        style={{ borderTop: "1px solid var(--border-s)" }}
      >
        <nav aria-label="Footer" className="flex items-center justify-center gap-4 flex-wrap">
          <span className="text-[0.75rem] font-medium" style={{ color: "var(--fg-3)" }}>
            Therapist Referral Network
          </span>
          <span className="text-[0.75rem]" style={{ color: "var(--border-e)" }}>
            &middot;
          </span>
          <a
            href={FACEBOOK_COMMUNITY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.75rem] no-underline hover:underline"
            style={{ color: "var(--fg-4)" }}
          >
            Community
          </a>
          <Link
            href="/terms"
            className="text-[0.75rem] no-underline hover:underline"
            style={{ color: "var(--fg-4)" }}
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-[0.75rem] no-underline hover:underline"
            style={{ color: "var(--fg-4)" }}
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
