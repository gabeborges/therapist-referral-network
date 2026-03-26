import { z } from "zod";

export const referralPostSchema = z.object({
  presentingIssue: z.string().min(1, "Presenting issue is required"),
  ageGroup: z.string().min(1, "Age group is required"),
  location: z.string().min(1, "Location is required"),
  modality: z.string().min(1, "Modality preference is required"),
  additionalNotes: z.string().max(1000).optional(),
});

export type ReferralPostFormData = z.infer<typeof referralPostSchema>;
