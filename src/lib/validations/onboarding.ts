import { z } from "zod";
import { therapistProfileSchema } from "./therapist-profile";

// Full onboarding schema — subset of profile fields
export const onboardingSchema = therapistProfileSchema.pick({
  // Step 1: Bio
  imageUrl: true,
  firstName: true,
  middleName: true,
  lastName: true,
  pronouns: true,
  displayName: true,
  contactEmail: true,
  city: true,
  province: true,
  // Step 2: Communities served
  specialties: true,
  participants: true,
  ages: true,
  modalities: true,
  // Step 3: Your services
  rateIndividual: true,
  rateGroup: true,
  rateFamily: true,
  rateCouples: true,
  acceptsInsurance: true,
  reducedFees: true,
  proBono: true,
  freeConsultation: true,
  acceptingClients: true,
});

// Per-step schemas for wizard validation
export const stepBioSchema = therapistProfileSchema.pick({
  imageUrl: true,
  firstName: true,
  middleName: true,
  lastName: true,
  pronouns: true,
  displayName: true,
  contactEmail: true,
  city: true,
  province: true,
});

export const stepCommunitiesSchema = therapistProfileSchema.pick({
  specialties: true,
  participants: true,
  ages: true,
  modalities: true,
});

export const stepServicesSchema = therapistProfileSchema.pick({
  rateIndividual: true,
  rateGroup: true,
  rateFamily: true,
  rateCouples: true,
  acceptsInsurance: true,
  reducedFees: true,
  proBono: true,
  freeConsultation: true,
  acceptingClients: true,
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type StepBioFormData = z.infer<typeof stepBioSchema>;
export type StepCommunitiesFormData = z.infer<typeof stepCommunitiesSchema>;
export type StepServicesFormData = z.infer<typeof stepServicesSchema>;
