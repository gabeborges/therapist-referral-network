-- Enable Row Level Security on all tables.
-- Strategy: deny-all for PostgREST (anon/authenticated roles).
-- Prisma connects as postgres superuser and bypasses RLS.
-- No permissive policies needed — the app does not use PostgREST for data access.

-- Auth.js tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;

-- Taxonomy tables (read-only lookups)
ALTER TABLE "Specialty" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TherapyType" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Language" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AlliedGroup" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PaymentMethod" ENABLE ROW LEVEL SECURITY;

-- Core domain tables
ALTER TABLE "TherapistProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ReferralPost" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ReferralNotification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FulfillmentCheck" ENABLE ROW LEVEL SECURITY;

-- Compliance
ALTER TABLE "ConsentLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Waitlist" ENABLE ROW LEVEL SECURITY;

-- Prisma implicit many-to-many junction tables
ALTER TABLE "_ProfileSpecialties" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_ProfileTherapyTypes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_ProfileLanguages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_ProfileGroups" ENABLE ROW LEVEL SECURITY;
