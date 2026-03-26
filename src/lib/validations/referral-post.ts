import { z } from "zod";

export const referralPostSchema = z.object({
  presentingIssue: z.string().min(1, "Presenting issue is required"),
  ageGroup: z.string().min(1, "Age group is required"),
  locationCity: z.string().optional(),
  locationProvince: z.string().min(1, "Province is required"),
  modality: z.enum(["in-person", "virtual", "both"], {
    message: "Modality must be in-person, virtual, or both",
  }),
  additionalNotes: z.string().max(1000).optional(),
});

export type ReferralPostFormData = z.infer<typeof referralPostSchema>;
