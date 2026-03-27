import Link from "next/link";

const STEPS = [
  {
    number: 1,
    title: "Create your profile",
    description:
      "Set up your therapist profile with your specialties, location, modalities, and availability.",
  },
  {
    number: 2,
    title: "Post a referral",
    description:
      "When a client needs a different fit, post a referral with the presenting issue, location, and modality.",
  },
  {
    number: 3,
    title: "Get matched",
    description:
      "Our matching engine finds the right therapists and notifies them. You stay in the loop until the client is connected.",
  },
];

export default function LandingPage(): React.ReactElement {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      <main>
      {/* Hero */}
      <section aria-label="Hero" className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center">
        {/* Match Ring Logo */}
        <div className="mb-6">
          <svg
            aria-hidden="true"
            width="80"
            height="80"
            viewBox="0 0 48 48"
            style={{ color: "var(--brand)" }}
          >
            <circle
              cx="24"
              cy="24"
              r="21"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle
              cx="24"
              cy="24"
              r="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle
              cx="24"
              cy="24"
              r="11"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle
              cx="24"
              cy="24"
              r="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1
          className="text-[2rem] sm:text-[2.5rem] font-bold tracking-[-0.02em] leading-[1.15] m-0 mb-4 max-w-[600px]"
          style={{ color: "var(--fg)" }}
        >
          Therapist Referral Network
        </h1>

        {/* Tagline */}
        <p
          className="text-[1.0625rem] sm:text-[1.125rem] leading-[1.6] m-0 mb-8 max-w-[480px]"
          style={{ color: "var(--fg-2)" }}
        >
          Structured referral matching for Canadian therapists. Find the right
          fit for every client.
        </p>

        {/* Primary CTA */}
        <Link
          href="/auth/signup"
          className="inline-flex items-center justify-center gap-3 h-12 px-8 rounded-sm text-[0.9375rem] font-semibold tracking-[0.01em] no-underline transition-[background] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            background: "var(--brand)",
            color: "var(--brand-on)",
            border: "none",
          }}
        >
          {/* Google icon */}
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign up with Google
        </Link>

        {/* Sign in link */}
        <p
          className="text-[0.875rem] mt-4 m-0"
          style={{ color: "var(--fg-3)" }}
        >
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

      {/* How it works */}
      <section
        aria-label="How it works"
        className="px-6 py-16 sm:py-20"
        style={{ borderTop: "1px solid var(--border-s)" }}
      >
        <div className="max-w-[720px] mx-auto">
          <h2
            className="text-[0.8125rem] font-semibold tracking-[0.06em] uppercase text-center mb-10 m-0"
            style={{ color: "var(--fg-3)" }}
          >
            How It Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
            {STEPS.map((step) => (
              <div key={step.number} className="text-center sm:text-left">
                {/* Numbered circle */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[0.875rem] font-bold mx-auto sm:mx-0 mb-3"
                  style={{
                    background: "var(--brand)",
                    color: "var(--brand-on)",
                  }}
                >
                  {step.number}
                </div>

                <h3
                  className="text-[1rem] font-semibold tracking-[-0.005em] m-0 mb-2"
                  style={{ color: "var(--fg)" }}
                >
                  {step.title}
                </h3>

                <p
                  className="text-[0.875rem] leading-[1.6] m-0"
                  style={{ color: "var(--fg-2)" }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary CTA */}
      <section aria-label="Call to action" className="px-6 pb-20 pt-4">
        <div className="text-center">
          <p
            className="text-[1.125rem] font-medium m-0 mb-5"
            style={{ color: "var(--fg)" }}
          >
            Ready to make better referrals?
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center h-11 px-8 rounded-sm text-[0.8125rem] font-semibold tracking-[0.01em] no-underline transition-[background] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              background: "var(--brand)",
              color: "var(--brand-on)",
              border: "none",
            }}
          >
            Join the network
          </Link>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer
        className="px-6 py-6 text-center"
        style={{ borderTop: "1px solid var(--border-s)" }}
      >
        <p className="text-[0.75rem] m-0" style={{ color: "var(--fg-4)" }}>
          Therapist Referral Network
        </p>
      </footer>
    </div>
  );
}
