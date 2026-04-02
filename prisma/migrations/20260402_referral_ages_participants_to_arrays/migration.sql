-- AlterTable: Convert ageGroup from single string to array
-- Step 1: Add new array column
ALTER TABLE "ReferralPost" ADD COLUMN "ageGroup_new" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Step 2: Migrate existing data (wrap single value in array)
UPDATE "ReferralPost" SET "ageGroup_new" = ARRAY["ageGroup"] WHERE "ageGroup" IS NOT NULL AND "ageGroup" != '';

-- Step 3: Drop old column and rename
ALTER TABLE "ReferralPost" DROP COLUMN "ageGroup";
ALTER TABLE "ReferralPost" RENAME COLUMN "ageGroup_new" TO "ageGroup";

-- Step 4: Remove default
ALTER TABLE "ReferralPost" ALTER COLUMN "ageGroup" DROP DEFAULT;

-- AlterTable: Convert participants from nullable string to array
-- Step 1: Add new array column
ALTER TABLE "ReferralPost" ADD COLUMN "participants_new" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Step 2: Migrate existing data (wrap single value in array)
UPDATE "ReferralPost" SET "participants_new" = ARRAY["participants"] WHERE "participants" IS NOT NULL AND "participants" != '';

-- Step 3: Drop old column and rename
ALTER TABLE "ReferralPost" DROP COLUMN "participants";
ALTER TABLE "ReferralPost" RENAME COLUMN "participants_new" TO "participants";

-- Step 4: Remove default
ALTER TABLE "ReferralPost" ALTER COLUMN "participants" DROP DEFAULT;
