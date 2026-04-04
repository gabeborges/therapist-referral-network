import { auth } from "@/lib/auth";
import { Navbar } from "@/features/layout/components/Navbar";
import { Footer } from "@/features/layout/components/Footer";
import { BackLink } from "@/components/ui/BackLink";

export default async function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const session = await auth();
  const isAuthenticated = !!session?.user && !session.needsConsent;

  return (
    <>
      {isAuthenticated && <Navbar />}
      {!isAuthenticated && (
        <div className="flex flex-col items-center px-6 pt-6">
          <div className="max-w-[640px] w-full">
            <BackLink href="/">Back to homepage</BackLink>
          </div>
        </div>
      )}
      {children}
      {!isAuthenticated && <Footer />}
    </>
  );
}
