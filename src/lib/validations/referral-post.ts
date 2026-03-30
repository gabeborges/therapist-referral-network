import { z } from "zod";

export const referralPostSchema = z.object({
  // Core fields (always visible)
  presentingIssue: z.string().min(1, "Presenting issue is required"),
  ageGroup: z.string().min(1, "Age group is required"),
  locationCity: z.string().optional(),
  locationProvince: z.string().min(1, "Province is required"),
  modality: z.enum(["in-person", "virtual", "both"], {
    message: "Modality must be in-person, virtual, or both",
  }),
  participants: z.string().optional(),
  rateBilling: z.string().optional(),
  additionalNotes: z.string().max(1000).optional(),

  // Additional details (expandable section)
  clientGender: z.string().optional(),
  clientAge: z.string().optional(),
  therapistGenderPref: z.string().optional(),
  therapyTypes: z.array(z.string()).optional(),
  languageRequirements: z.array(z.string()).optional(),
  additionalContext: z.string().max(2000).optional(),
});

export type ReferralPostFormData = z.infer<typeof referralPostSchema>;
