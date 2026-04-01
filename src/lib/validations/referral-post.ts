import { z } from "zod";

export const referralPostSchema = z.object({
  // Core fields
  presentingIssue: z.string().min(1, "Presenting issue is required"),
  details: z.string().max(1000).optional(),
  participants: z.string().optional(),
  ageGroup: z.string().min(1, "Age group is required"),
  modalities: z
    .array(z.enum(["in-person", "virtual", "phone"]))
    .min(1, "Select at least one modality"),
  city: z.string().optional(),
  province: z.string().optional(),
  rate: z.string().optional(),

  // Additional details (expandable section)
  therapistGenderPref: z.string().optional(),
  therapyTypes: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  additionalContext: z.string().max(2000).optional(),
});

export type ReferralPostFormData = z.infer<typeof referralPostSchema>;
