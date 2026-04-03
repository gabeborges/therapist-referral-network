import { z } from "zod";
import { MODALITIES } from "./therapist-profile";

export const referralPostSchema = z.object({
  // Core fields
  presentingIssue: z.string().min(1, "Presenting issue is required"),
  details: z.string().min(1, "Details are required").max(1000),
  participants: z.string().optional(),
  ageGroup: z.string().min(1, "Select an age group"),
  modalities: z.array(z.enum(MODALITIES)).min(1, "Select at least one modality"),
  city: z.string().optional(),
  province: z.string().optional(),
  rate: z.string().optional(),
  insuranceRequired: z.boolean().optional(),

  // Additional details (expandable section)
  therapistGenderPref: z.string().optional(),
  therapyTypes: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
});

export type ReferralPostFormData = z.infer<typeof referralPostSchema>;
