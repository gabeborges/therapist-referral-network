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
        <SessionProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
