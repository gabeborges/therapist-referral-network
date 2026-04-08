import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Navbar } from "@/features/layout/components/Navbar";
import { Card } from "@/components/ui/Card";
import { ContactForm } from "@/features/contact/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — Therapist Referral Network",
};

export default async function ContactPage(): Promise<React.ReactElement> {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <>
      <Navbar />
      <div className="px-4 sm:px-6 pt-12 pb-24">
        <div className="max-w-[640px] mx-auto">
          <h1 className="text-[1.5rem] font-semibold tracking-[-0.015em] leading-[1.3] text-fg mb-2">
            Contact us
          </h1>
          <p className="text-[0.875rem] text-fg-3 mb-8">
            Have a question, feedback, or need help? Send us a message and we&apos;ll get back to
            you.
          </p>

          <Card className="p-6">
            <ContactForm />
          </Card>
        </div>
      </div>
    </>
  );
}
