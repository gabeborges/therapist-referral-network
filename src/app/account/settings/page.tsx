import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Navbar } from "@/features/layout/components/Navbar";
import { Card } from "@/components/ui/Card";
import { ConsentSettingsForm } from "@/features/consent/components/ConsentSettingsForm";
import { DeleteAccountForm } from "@/features/account/components/DeleteAccountForm";

export const metadata: Metadata = {
  title: "Account Settings — Therapist Referral Network",
};

export default async function AccountSettingsPage(): Promise<React.ReactElement> {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <>
      <Navbar />
      <div className="px-4 sm:px-6 pt-12 pb-24">
        <div className="max-w-[640px] mx-auto">
          <h1 className="text-[1.5rem] font-semibold tracking-[-0.015em] leading-[1.3] text-fg mb-8">
            Account settings
          </h1>

          {/* Cookie & Analytics */}
          <section>
            <p
              className="text-[0.6875rem] font-semibold tracking-[0.06em] uppercase mb-4"
              style={{ color: "var(--fg-3)" }}
            >
              Cookie & analytics
            </p>
            <Card className="p-6">
              <ConsentSettingsForm />
            </Card>
          </section>

          {/* Danger Zone */}
          <section className="mt-10">
            <p
              className="text-[0.6875rem] font-semibold tracking-[0.06em] uppercase mb-4"
              style={{ color: "var(--err)" }}
            >
              Danger zone
            </p>
            <Card className="p-6">
              <h2 className="text-[1rem] font-semibold mb-1" style={{ color: "var(--fg)" }}>
                Delete your account
              </h2>
              <p className="text-[0.8125rem] mb-6" style={{ color: "var(--fg-3)" }}>
                This action is permanent and cannot be undone. Your profile, referral history, and
                all associated data will be removed.
              </p>
              <DeleteAccountForm />
            </Card>
          </section>
        </div>
      </div>
    </>
  );
}
