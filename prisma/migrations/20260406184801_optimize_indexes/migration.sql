-- DropIndex
DROP INDEX "FulfillmentCheck_token_idx";

-- DropIndex
DROP INDEX "ReferralPost_slug_idx";

-- DropIndex
DROP INDEX "TherapistProfile_acceptingClients_lastActiveAt_idx";

-- CreateIndex
CREATE INDEX "ReferralNotification_recipientId_sentAt_idx" ON "ReferralNotification"("recipientId", "sentAt" DESC);

-- CreateIndex
CREATE INDEX "ReferralPost_authorId_createdAt_idx" ON "ReferralPost"("authorId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "TherapistProfile_acceptingClients_country_idx" ON "TherapistProfile"("acceptingClients", "country");
