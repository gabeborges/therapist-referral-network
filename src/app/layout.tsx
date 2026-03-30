import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { TRPCReactProvider } from "@/lib/trpc/provider";
import { SessionProvider } from "@/app/providers/session-provider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Therapist Referral Network",
  description:
    "Structured referral matching for Canadian therapists — find the right fit for every client.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} antialiased bg-[var(--bg)] text-[var(--fg)]`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand focus:text-brand-on focus:rounded-sm focus:text-[0.875rem] focus:font-semibold"
        >
          Skip to main content
        </a>
        <SessionProvider>
          <TRPCReactProvider>
            <main id="main-content">{children}</main>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
