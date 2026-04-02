/*
  Warnings:

  - You are about to drop the column `additionalNotes` on the `ReferralPost` table. All the data in the column will be lost.
  - You are about to drop the column `clientAge` on the `ReferralPost` table. All the data in the column will be lost.
  - You are about to drop the column `clientGender` on the `ReferralPost` table. All the data in the column will be lost.
  - You are about to drop the column `languageRequirements` on the `ReferralPost` table. All the data in the column will be lost.
  - You are about to drop the column `locationCity` on the `ReferralPost` table. All the data in the column will be lost.
  - You are about to drop the column `locationProvince` on the `ReferralPost` table. All the data in the column will be lost.
  - You are about to drop the column `modality` on the `ReferralPost` table. All the data in the column will be lost.
  - You are about to drop the column `rateBilling` on the `ReferralPost` table. All the data in the column will be lost.
  - You are about to drop the column `ageGroups` on the `TherapistProfile` table. All the data in the column will be lost.
  - You are about to drop the column `clientEthnicity` on the `TherapistProfile` table. All the data in the column will be lost.
  - You are about to drop the column `directBilling` on the `TherapistProfile` table. All the data in the column will be lost.
  - You are about to drop the column `hourlyRate` on the `TherapistProfile` table. All the data in the column will be lost.
  - You are about to drop the column `otherTreatmentOrientation` on the `TherapistProfile` table. All the data in the column will be lost.
  - You are about to drop the column `professionalEmail` on the `TherapistProfile` table. All the data in the column will be lost.
  - You are about to drop the column `styleDescriptors` on the `TherapistProfile` table. All the data in the column will be lost.
  - The `faithOrientation` column on the `TherapistProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `_ProfileAlliedGroups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProfilePaymentMethods` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "ReferralStatus" ADD VALUE 'CANCELLED';

-- DropForeignKey
ALTER TABLE "_ProfileAlliedGroups" DROP CONSTRAINT "_ProfileAlliedGroups_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProfileAlliedGroups" DROP CONSTRAINT "_ProfileAlliedGroups_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProfilePaymentMethods" DROP CONSTRAINT "_ProfilePaymentMethods_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProfilePaymentMethods" DROP CONSTRAINT "_ProfilePaymentMethods_B_fkey";

-- AlterTable
ALTER TABLE "ReferralPost" DROP COLUMN "additionalNotes",
DROP COLUMN "clientAge",
DROP COLUMN "clientGender",
DROP COLUMN "languageRequirements",
DROP COLUMN "locationCity",
DROP COLUMN "locationProvince",
DROP COLUMN "modality",
DROP COLUMN "rateBilling",
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "city" TEXT,
ADD COLUMN     "details" TEXT,
ADD COLUMN     "fulfilledAt" TIMESTAMP(3),
ADD COLUMN     "insuranceRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "modalities" TEXT[],
ADD COLUMN     "province" TEXT,
ADD COLUMN     "rate" TEXT;

-- AlterTable
ALTER TABLE "TherapistProfile" DROP COLUMN "ageGroups",
DROP COLUMN "clientEthnicity",
DROP COLUMN "directBilling",
DROP COLUMN "hourlyRate",
DROP COLUMN "otherTreatmentOrientation",
DROP COLUMN "professionalEmail",
DROP COLUMN "styleDescriptors",
ADD COLUMN     "ages" TEXT[],
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "ethnicity" TEXT[],
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "paymentMethods" TEXT[],
ADD COLUMN     "rateCouples" INTEGER,
ADD COLUMN     "rateFamily" INTEGER,
ADD COLUMN     "rateGroup" INTEGER,
ADD COLUMN     "rateIndividual" INTEGER,
ADD COLUMN     "therapyStyle" TEXT[],
DROP COLUMN "faithOrientation",
ADD COLUMN     "faithOrientation" TEXT[];

-- DropTable
DROP TABLE "_ProfileAlliedGroups";

-- DropTable
DROP TABLE "_ProfilePaymentMethods";

-- CreateTable
CREATE TABLE "_ProfileGroups" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProfileGroups_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProfileGroups_B_index" ON "_ProfileGroups"("B");

-- AddForeignKey
ALTER TABLE "_ProfileGroups" ADD CONSTRAINT "_ProfileGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "AlliedGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileGroups" ADD CONSTRAINT "_ProfileGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "TherapistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
