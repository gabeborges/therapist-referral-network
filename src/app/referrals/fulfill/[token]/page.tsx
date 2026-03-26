import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Referral Fulfillment — Match Ring",
};

type FulfillmentPageProps = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ fulfilled?: string }>;
};

export default async function FulfillmentPage({
  params,
  searchParams,
}: FulfillmentPageProps): Promise<React.ReactElement> {
  const { token } = await params;
  const { fulfilled: fulfilledParam } = await searchParams;

  // Look up the fulfillment check by its secure token
  const fulfillmentCheck = await prisma.fulfillmentCheck.findUnique({
    where: { token },
    include: {
      referralPost: {
        select: { id: true, status: true, presentingIssue: true },
      },
    },
  });

  // Invalid or expired token
  if (!fulfillmentCheck) {
    return (
      <FulfillmentLayout>
        <StatusIcon variant="error" />
        <h1 className="text-[1.25rem] font-semibold tracking-[-0.01em] text-fg mt-6 mb-2">
          Invalid or Expired Link
        </h1>
        <p className="text-[0.875rem] leading-[1.5] text-fg-2 max-w-[400px]">
          This fulfillment link is no longer valid. It may have expired or
          already been used.
        </p>
      </FulfillmentLayout>
    );
  }

  // Already responded
  if (fulfillmentCheck.respondedAt !== null && fulfilledParam === undefined) {
    const previousResponse = fulfillmentCheck.fulfilled
      ? "fulfilled"
      : "still looking";

    return (
      <FulfillmentLayout>
        <StatusIcon variant="info" />
        <h1 className="text-[1.25rem] font-semibold tracking-[-0.01em] text-fg mt-6 mb-2">
          Already Responded
        </h1>
        <p className="text-[0.875rem] leading-[1.5] text-fg-2 max-w-[400px]">
          You&apos;ve already responded to this fulfillment check. Your referral
          was marked as <strong>{previousResponse}</strong>.
        </p>
      </FulfillmentLayout>
    );
  }

  // Process the response if a fulfilled parameter was provided
  if (fulfilledParam !== undefined) {
    const isFulfilled = fulfilledParam === "true";

    // Record the response (idempotent: skip if already responded)
    if (fulfillmentCheck.respondedAt === null) {
      await prisma.fulfillmentCheck.update({
        where: { id: fulfillmentCheck.id },
        data: {
          fulfilled: isFulfilled,
          respondedAt: new Date(),
        },
      });

      // If fulfilled, also mark the referral post as FULFILLED
      if (isFulfilled) {
        await prisma.referralPost.update({
          where: { id: fulfillmentCheck.referralPostId },
          data: { status: "FULFILLED" },
        });
      }
    }

    const statusLabel = isFulfilled ? "fulfilled" : "still looking";

    return (
      <FulfillmentLayout>
        <StatusIcon variant={isFulfilled ? "success" : "info"} />
        <h1 className="text-[1.25rem] font-semibold tracking-[-0.01em] text-fg mt-6 mb-2">
          Thank You!
        </h1>
        <p className="text-[0.875rem] leading-[1.5] text-fg-2 max-w-[400px]">
          Your referral has been marked as{" "}
          <strong>{statusLabel}</strong>.
          {!isFulfilled && (
            <span>
              {" "}
              We&apos;ll send you additional therapist matches shortly.
            </span>
          )}
        </p>
      </FulfillmentLayout>
    );
  }

  // No fulfilled parameter — show the choice prompt
  return (
    <FulfillmentLayout>
      <MatchRingLogo />
      <h1 className="text-[1.25rem] font-semibold tracking-[-0.01em] text-fg mt-6 mb-2">
        Referral Fulfillment Check
      </h1>
      <p className="text-[0.875rem] leading-[1.5] text-fg-2 max-w-[400px] mb-8">
        Has your client found a therapist from the referrals we sent?
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[320px]">
        <a
          href={`/referrals/fulfill/${token}?fulfilled=true`}
          className="flex-1 inline-flex items-center justify-center h-11 px-6 bg-brand text-brand-on border-none rounded-sm text-[0.875rem] font-semibold tracking-[0.01em] no-underline transition-[background] duration-150 ease-out hover:bg-brand-h focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2"
        >
          Yes, Fulfilled
        </a>
        <a
          href={`/referrals/fulfill/${token}?fulfilled=false`}
          className="flex-1 inline-flex items-center justify-center h-11 px-6 bg-surface-2 text-fg border border-border rounded-sm text-[0.875rem] font-semibold tracking-[0.01em] no-underline transition-[background] duration-150 ease-out hover:bg-surface-3 focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2"
        >
          No, Still Looking
        </a>
      </div>
    </FulfillmentLayout>
  );
}

// ─── Layout wrapper ─────────────────────────────────────────────────────────────

function FulfillmentLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-[480px] bg-surface-2 border border-border rounded-lg p-8 sm:p-10 flex flex-col items-center text-center">
        {children}
      </div>
    </div>
  );
}

// ─── Match Ring Logo ────────────────────────────────────────────────────────────

function MatchRingLogo(): React.ReactElement {
  return (
    <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Match Ring"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="2"
          className="text-brand-on"
        />
        <circle cx="12" cy="12" r="4" className="fill-brand-on" />
      </svg>
    </div>
  );
}

// ─── Status icons ───────────────────────────────────────────────────────────────

function StatusIcon({
  variant,
}: {
  variant: "success" | "error" | "info";
}): React.ReactElement {
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
