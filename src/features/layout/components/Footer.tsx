import Link from "next/link";
import { CookiePreferencesLink } from "@/features/consent/components/CookiePreferencesLink";

const FACEBOOK_COMMUNITY_URL = "https://www.facebook.com/groups/canadiantherapyreferralnetwork";

export function Footer(): React.ReactElement {
  return (
    <footer
      className="px-6 py-6 mt-auto max-w-[1120px] mx-auto w-full"
      style={{ borderTop: "1px solid var(--border-s)" }}
    >
      <nav aria-label="Footer" className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 no-underline text-[0.975rem] font-medium"
            style={{ color: "var(--fg-3)" }}
          >
            <svg width="22" height="22" viewBox="0 0 48 48" style={{ color: "var(--brand)" }}>
              <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="3.5" />
              <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="3.5" />
              <circle cx="24" cy="24" r="11" fill="none" stroke="currentColor" strokeWidth="3.5" />
              <circle cx="24" cy="24" r="6" fill="none" stroke="currentColor" strokeWidth="3.5" />
            </svg>
            Therapist Referral Network
          </Link>
          <span className="ml-3 text-[0.6875rem]" style={{ color: "var(--fg-4)" }}>
            &copy; {new Date().getFullYear()}
          </span>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <a
            href={FACEBOOK_COMMUNITY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.75rem] no-underline hover:underline"
            style={{ color: "var(--fg-4)" }}
          >
            Join community
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
          <Link
            href="/cookies"
            className="text-[0.75rem] no-underline hover:underline"
            style={{ color: "var(--fg-4)" }}
          >
            Cookies
          </Link>
          <CookiePreferencesLink
            className="text-[0.75rem] no-underline hover:underline cursor-pointer bg-transparent border-none p-0"
            style={{ color: "var(--fg-4)" }}
          >
            Cookie Preferences
          </CookiePreferencesLink>
        </div>
      </nav>
    </footer>
  );
}
