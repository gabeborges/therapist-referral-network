-- DropForeignKey
ALTER TABLE "ReferralNotification" DROP CONSTRAINT "ReferralNotification_recipientId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deleteReason" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ConsentLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "consentType" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "policyVersion" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConsentLog_userId_consentType_idx" ON "ConsentLog"("userId", "consentType");

-- CreateIndex
CREATE INDEX "ConsentLog_createdAt_idx" ON "ConsentLog"("createdAt");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- AddForeignKey
ALTER TABLE "ReferralNotification" ADD CONSTRAINT "ReferralNotification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "TherapistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
