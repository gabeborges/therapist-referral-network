import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { BackLink } from "@/components/ui/BackLink";
import { DeleteAccountForm } from "@/features/account/components/DeleteAccountForm";

export const metadata: Metadata = {
  title: "Delete Account — Therapist Referral Network",
};

export default async function DeleteAccountPage(): Promise<React.ReactElement> {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <div
      className="min-h-screen flex flex-col items-center px-6 py-20"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-[640px] w-full">
        <BackLink href="/dashboard">Back to dashboard</BackLink>

        <h1
          className="text-[1.75rem] font-bold tracking-[-0.02em] mt-6 mb-2"
          style={{ color: "var(--fg)" }}
        >
          Delete your account
        </h1>
        <p className="text-[0.9375rem] leading-[1.7] mb-8" style={{ color: "var(--fg-2)" }}>
          This action is permanent. Your profile, referral history, and all associated data will be
          removed. Sensitive data (faith orientation, ethnicity) is deleted immediately. Remaining
          profile data is removed within 30 days.
        </p>

        <DeleteAccountForm />
      </div>
    </div>
  );
}
