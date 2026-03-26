import Link from "next/link";
import { auth } from "@/lib/auth";
import { NavLink } from "@/features/layout/components/NavLink";
import { UserAvatar } from "@/features/layout/components/UserAvatar";
import { NavbarMobile } from "@/features/layout/components/NavbarMobile";

function getInitials(name: string | null | undefined): string {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    const first = parts[0]?.[0] ?? "";
    const last = parts[parts.length - 1]?.[0] ?? "";
    return (first + last).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export async function Navbar(): Promise<React.ReactElement> {
  const session = await auth();

  if (!session?.user) {
    return <></>;
  }

  const initials = getInitials(session.user.name);

  return (
    <nav
      className="w-full sticky top-0 z-50"
      style={{
        borderBottom: "1px solid var(--border)",
        background: "color-mix(in srgb, var(--s1) 90%, transparent)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-[1120px] mx-auto h-14 px-6 flex items-center justify-between">
        {/* Left: Logo + brand name */}
        <Link
          href="/referrals"
          className="flex items-center gap-2 no-underline text-[1rem] font-semibold tracking-[-0.005em] leading-[1.4]"
          style={{ color: "var(--fg)" }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 48 48"
            style={{ color: "var(--brand)" }}
          >
            <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="3.5" />
            <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="3.5" />
            <circle cx="24" cy="24" r="11" fill="none" stroke="currentColor" strokeWidth="3.5" />
            <circle cx="24" cy="24" r="6" fill="none" stroke="currentColor" strokeWidth="3.5" />
          </svg>
          <span className="hidden sm:inline">Therapist Referral Network</span>
        </Link>

        {/* Right: Desktop nav */}
        <div className="hidden sm:flex items-center gap-5">
          <NavLink href="/referrals">Referrals</NavLink>
          <NavLink href="/profile">Profile</NavLink>
          <Link
            href="/referrals/new"
            className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-sm text-[0.8125rem] font-semibold tracking-[0.01em] no-underline transition-[background] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              background: "var(--brand)",
              color: "var(--brand-on)",
              border: "none",
            }}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Referral
          </Link>
          <UserAvatar initials={initials} />
        </div>

        {/* Right: Mobile nav */}
        <div className="flex sm:hidden items-center gap-3">
          <Link
            href="/referrals/new"
            className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-sm text-[0.75rem] font-semibold no-underline transition-[background] duration-150 ease-out"
            style={{
              background: "var(--brand)",
              color: "var(--brand-on)",
              border: "none",
            }}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New
          </Link>
          <NavbarMobile initials={initials} />
        </div>
      </div>
    </nav>
  );
}
