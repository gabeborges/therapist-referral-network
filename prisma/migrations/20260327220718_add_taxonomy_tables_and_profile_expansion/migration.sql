-- AlterTable
ALTER TABLE "ReferralPost" ADD COLUMN     "additionalContext" TEXT,
ADD COLUMN     "clientAge" TEXT,
ADD COLUMN     "clientGender" TEXT,
ADD COLUMN     "languageRequirements" TEXT[],
ADD COLUMN     "participants" TEXT,
ADD COLUMN     "rateBilling" TEXT,
ADD COLUMN     "therapistGenderPref" TEXT,
ADD COLUMN     "therapyTypes" TEXT[];

-- AlterTable
ALTER TABLE "TherapistProfile" ADD COLUMN     "clientEthnicity" TEXT[],
ADD COLUMN     "credentials" TEXT[],
ADD COLUMN     "faithOrientation" TEXT,
ADD COLUMN     "freeConsultation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "licensingLevel" TEXT,
ADD COLUMN     "otherTreatmentOrientation" TEXT,
ADD COLUMN     "participants" TEXT[],
ADD COLUMN     "primaryCredential" TEXT,
ADD COLUMN     "proBono" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "professionalEmail" TEXT,
ADD COLUMN     "pronouns" TEXT,
ADD COLUMN     "psychologyTodayUrl" TEXT,
ADD COLUMN     "styleDescriptors" TEXT[],
ADD COLUMN     "therapistGender" TEXT,
ADD COLUMN     "topSpecialties" TEXT[],
ADD COLUMN     "websiteUrl" TEXT;

-- CreateTable
CREATE TABLE "Specialty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TherapyType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TherapyType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlliedGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlliedGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProfileSpecialties" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProfileSpecialties_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProfileLanguages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProfileLanguages_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProfileAlliedGroups" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProfileAlliedGroups_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProfilePaymentMethods" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProfilePaymentMethods_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProfileTherapyTypes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProfileTherapyTypes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_name_key" ON "Specialty"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TherapyType_name_key" ON "TherapyType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AlliedGroup_name_key" ON "AlliedGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_name_key" ON "PaymentMethod"("name");

-- CreateIndex
CREATE INDEX "_ProfileSpecialties_B_index" ON "_ProfileSpecialties"("B");

-- CreateIndex
CREATE INDEX "_ProfileLanguages_B_index" ON "_ProfileLanguages"("B");

-- CreateIndex
CREATE INDEX "_ProfileAlliedGroups_B_index" ON "_ProfileAlliedGroups"("B");

-- CreateIndex
CREATE INDEX "_ProfilePaymentMethods_B_index" ON "_ProfilePaymentMethods"("B");

-- CreateIndex
CREATE INDEX "_ProfileTherapyTypes_B_index" ON "_ProfileTherapyTypes"("B");

-- AddForeignKey
ALTER TABLE "_ProfileSpecialties" ADD CONSTRAINT "_ProfileSpecialties_A_fkey" FOREIGN KEY ("A") REFERENCES "Specialty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileSpecialties" ADD CONSTRAINT "_ProfileSpecialties_B_fkey" FOREIGN KEY ("B") REFERENCES "TherapistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileLanguages" ADD CONSTRAINT "_ProfileLanguages_A_fkey" FOREIGN KEY ("A") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileLanguages" ADD CONSTRAINT "_ProfileLanguages_B_fkey" FOREIGN KEY ("B") REFERENCES "TherapistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileAlliedGroups" ADD CONSTRAINT "_ProfileAlliedGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "AlliedGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileAlliedGroups" ADD CONSTRAINT "_ProfileAlliedGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "TherapistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfilePaymentMethods" ADD CONSTRAINT "_ProfilePaymentMethods_A_fkey" FOREIGN KEY ("A") REFERENCES "PaymentMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfilePaymentMethods" ADD CONSTRAINT "_ProfilePaymentMethods_B_fkey" FOREIGN KEY ("B") REFERENCES "TherapistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileTherapyTypes" ADD CONSTRAINT "_ProfileTherapyTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "TherapistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileTherapyTypes" ADD CONSTRAINT "_ProfileTherapyTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "TherapyType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
