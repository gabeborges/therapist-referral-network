-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('OPEN', 'FULFILLED', 'EXPIRED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "TherapistProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "bio" TEXT,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'CA',
    "specialties" TEXT[],
    "modalities" TEXT[],
    "therapeuticApproach" TEXT[],
    "languages" TEXT[],
    "ageGroups" TEXT[],
    "acceptsInsurance" BOOLEAN NOT NULL DEFAULT false,
    "directBilling" BOOLEAN NOT NULL DEFAULT false,
    "insurers" TEXT[],
    "hourlyRate" INTEGER,
    "reducedFees" BOOLEAN NOT NULL DEFAULT false,
    "acceptingClients" BOOLEAN NOT NULL DEFAULT true,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TherapistProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralPost" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "presentingIssue" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "locationCity" TEXT,
    "locationProvince" TEXT NOT NULL,
    "modality" TEXT NOT NULL,
    "additionalNotes" TEXT,
    "status" "ReferralStatus" NOT NULL DEFAULT 'OPEN',
    "currentBatch" INTEGER NOT NULL DEFAULT 0,
    "lastDrippedAt" TIMESTAMP(3),
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferralPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralNotification" (
    "id" TEXT NOT NULL,
    "referralPostId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "batch" INTEGER NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailId" TEXT,

    CONSTRAINT "ReferralNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FulfillmentCheck" (
    "id" TEXT NOT NULL,
    "referralPostId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "fulfilled" BOOLEAN,
    "token" TEXT NOT NULL,

    CONSTRAINT "FulfillmentCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Waitlist" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Waitlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "TherapistProfile_userId_key" ON "TherapistProfile"("userId");

-- CreateIndex
CREATE INDEX "TherapistProfile_country_province_city_idx" ON "TherapistProfile"("country", "province", "city");

-- CreateIndex
CREATE INDEX "TherapistProfile_acceptingClients_lastActiveAt_idx" ON "TherapistProfile"("acceptingClients", "lastActiveAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralPost_slug_key" ON "ReferralPost"("slug");

-- CreateIndex
CREATE INDEX "ReferralPost_status_createdAt_idx" ON "ReferralPost"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ReferralPost_slug_idx" ON "ReferralPost"("slug");

-- CreateIndex
CREATE INDEX "ReferralNotification_referralPostId_batch_idx" ON "ReferralNotification"("referralPostId", "batch");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralNotification_referralPostId_recipientId_key" ON "ReferralNotification"("referralPostId", "recipientId");

-- CreateIndex
CREATE UNIQUE INDEX "FulfillmentCheck_token_key" ON "FulfillmentCheck"("token");

-- CreateIndex
CREATE INDEX "FulfillmentCheck_referralPostId_idx" ON "FulfillmentCheck"("referralPostId");

-- CreateIndex
CREATE INDEX "FulfillmentCheck_token_idx" ON "FulfillmentCheck"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Waitlist_email_key" ON "Waitlist"("email");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapistProfile" ADD CONSTRAINT "TherapistProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralPost" ADD CONSTRAINT "ReferralPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "TherapistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralNotification" ADD CONSTRAINT "ReferralNotification_referralPostId_fkey" FOREIGN KEY ("referralPostId") REFERENCES "ReferralPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralNotification" ADD CONSTRAINT "ReferralNotification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "TherapistProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FulfillmentCheck" ADD CONSTRAINT "FulfillmentCheck_referralPostId_fkey" FOREIGN KEY ("referralPostId") REFERENCES "ReferralPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
