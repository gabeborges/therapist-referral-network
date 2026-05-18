import { prisma } from "@/lib/prisma";
import { MatchRingLogo } from "@/features/auth/components/match-ring-logo";
import { submitFulfillmentResponse } from "./actions";

export const metadata = {
  title: "Referral Fulfillment — Therapist Referral Network",
  robots: { index: false, follow: false },
};

// Page is GET-safe (no DB mutations). The mutation lives behind the
// `submitFulfillmentResponse` Server Action so that email prefetchers
// and link scanners cannot record a response by GET-fetching this URL.
// Always served fresh — never cached.
export const dynamic = "force-dynamic";

type FulfillmentPageProps = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ confirmed?: string }>;
};

export default async function FulfillmentPage({
  params,
  searchParams,
}: FulfillmentPageProps): Promise<React.ReactElement> {
  const { token } = await params;
  const { confirmed } = await searchParams;

  const fulfillmentCheck = await prisma.fulfillmentCheck.findUnique({
    where: { token },
    select: {
      id: true,
      respondedAt: true,
      fulfilled: true,
    },
  });

  if (!fulfillmentCheck) {
    return (
      <FulfillmentLayout>
        <StatusIcon variant="error" />
        <h1 className="text-[1.25rem] font-semibold tracking-[-0.01em] text-fg mt-6 mb-2">
          Invalid or Expired Link
        </h1>
        <p className="text-[0.875rem] leading-[1.5] text-fg-2 max-w-[400px]">
          This fulfillment link is no longer valid. It may have expired or already been used.
        </p>
      </FulfillmentLayout>
    );
  }

  // Already responded — show the recorded status and stop here.
  if (fulfillmentCheck.respondedAt !== null) {
    const previousResponse = fulfillmentCheck.fulfilled ? "fulfilled" : "still looking";
    const isJustSubmitted = confirmed !== undefined;

    return (
      <FulfillmentLayout>
        <StatusIcon variant={fulfillmentCheck.fulfilled ? "success" : "info"} />
        <h1 className="text-[1.25rem] font-semibold tracking-[-0.01em] text-fg mt-6 mb-2">
          {isJustSubmitted ? "Thank You!" : "Already Responded"}
        </h1>
        <p className="text-[0.875rem] leading-[1.5] text-fg-2 max-w-[400px]">
          {isJustSubmitted ? (
            <>
              Your referral has been marked as <strong>{previousResponse}</strong>.
              {!fulfillmentCheck.fulfilled && (
                <span> We&apos;ll send you additional therapist matches shortly.</span>
              )}
            </>
          ) : (
            <>
              You&apos;ve already responded to this fulfillment check. Your referral was marked as{" "}
              <strong>{previousResponse}</strong>.
            </>
          )}
        </p>
      </FulfillmentLayout>
    );
  }

  // No response yet — show the choice form. Submitting POSTs to the
  // Server Action, so prefetchers visiting this URL only see the form.
  return (
    <FulfillmentLayout>
      <h1 className="text-[1.25rem] font-semibold tracking-[-0.01em] text-fg mt-6 mb-2">
        Referral Fulfillment Check
      </h1>
      <p className="text-[0.875rem] leading-[1.5] text-fg-2 max-w-[400px] mb-8">
        Has your client found a therapist from the referrals we sent?
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[320px]">
        <form action={submitFulfillmentResponse} className="flex-1">
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="fulfilled" value="true" />
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center h-11 px-6 bg-brand text-brand-on border-none rounded-sm text-[0.875rem] font-semibold tracking-[0.01em] cursor-pointer transition-[background] duration-150 ease-out hover:bg-brand-h focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2"
          >
            Yes, Fulfilled
          </button>
        </form>
        <form action={submitFulfillmentResponse} className="flex-1">
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="fulfilled" value="false" />
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center h-11 px-6 bg-s2 text-fg border border-border rounded-sm text-[0.875rem] font-semibold tracking-[0.01em] cursor-pointer transition-[background] duration-150 ease-out hover:bg-s1 focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2"
          >
            No, Still Looking
          </button>
        </form>
      </div>
    </FulfillmentLayout>
  );
}

// ─── Layout wrapper ─────────────────────────────────────────────────────────────

function FulfillmentLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4 py-12">
      <div className="flex flex-col items-center gap-2 mb-6">
        <MatchRingLogo size={40} />
        <span className="text-[1.125rem] font-semibold text-fg">Therapist Referral Network</span>
      </div>
      <div className="w-full max-w-[480px] bg-s2 border border-border rounded-lg p-8 sm:p-10 flex flex-col items-center text-center">
        {children}
      </div>
    </div>
  );
}

// ─── Status icons ───────────────────────────────────────────────────────────────

function StatusIcon({ variant }: { variant: "success" | "error" | "info" }): React.ReactElement {
  const colorClasses = {
    success: "bg-green-100 text-green-600",
    error: "bg-red-100 text-red-600",
    info: "bg-blue-100 text-blue-600",
  };

  const icons = {
    success: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 12l2 2 4-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    error: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M15 9l-6 6M9 9l6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    info: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 8v4M12 16h.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  return (
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[variant]}`}
    >
      {icons[variant]}
    </div>
  );
}
