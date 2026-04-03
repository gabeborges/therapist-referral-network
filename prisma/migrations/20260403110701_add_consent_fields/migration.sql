-- AlterTable
ALTER TABLE "TherapistProfile" ADD COLUMN     "consentCommunitiesServed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "agreedToTermsAt" TIMESTAMP(3),
ADD COLUMN     "termsVersion" TEXT;
