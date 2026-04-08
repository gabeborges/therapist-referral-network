"use client";

import { signOut } from "next-auth/react";

export function OnboardingSignOutLink(): React.ReactElement {
  return (
    <p className="text-center text-[0.8125rem] text-fg-3 mt-6">
      Signed in with the wrong account?{" "}
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="underline hover:text-brand transition-colors cursor-pointer"
      >
        Sign out
      </button>
    </p>
  );
}
