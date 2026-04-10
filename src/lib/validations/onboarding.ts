import { z } from "zod";
import { therapistProfileSchema } from "./therapist-profile";

// Full onboarding schema — subset of profile fields
export const onboardingSchema = therapistProfileSchema.pick({
  // Step 2: Bio
  imageUrl: true,
  firstName: true,
  middleName: true,
  lastName: true,
  city: true,
  province: true,
  // Step 3: Communities served
  participants: true,
  ages: true,
  modalities: true,
});

// Per-step schemas for wizard validation
export const stepBioSchema = therapistProfileSchema.pick({
  imageUrl: true,
  firstName: true,
  middleName: true,
  lastName: true,
  city: true,
  province: true,
});

export const stepCommunitiesSchema = therapistProfileSchema.pick({
  participants: true,
  ages: true,
  modalities: true,
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type StepBioFormData = z.infer<typeof stepBioSchema>;
export type StepCommunitiesFormData = z.infer<typeof stepCommunitiesSchema>;
