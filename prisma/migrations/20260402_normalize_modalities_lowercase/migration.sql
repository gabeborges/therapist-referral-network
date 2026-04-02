-- Normalize modalities to lowercase in TherapistProfile
-- Profile previously stored Title-case ("In-Person", "Virtual", "Phone")
-- while ReferralPost stored lowercase ("in-person", "virtual", "phone").
-- This migration aligns both to lowercase for consistent matching.

UPDATE "TherapistProfile"
SET modalities = ARRAY(
  SELECT lower(unnest(modalities))
)
WHERE array_length(modalities, 1) > 0;
