import { z } from "zod";

export const therapistProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  displayName: z.string().min(1, "Display name is required"),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  country: z.literal("CA"),
  specialties: z.array(z.string()).min(1, "Select at least one specialty"),
  modalities: z.array(z.string()).min(1, "Select at least one modality"),
  therapeuticApproach: z.array(z.string()).min(1, "Select at least one approach"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  ageGroups: z.array(z.string()).min(1, "Select at least one age group"),
  acceptsInsurance: z.boolean(),
  directBilling: z.boolean(),
  insurers: z.array(z.string()).optional(),
  hourlyRate: z.number().positive().optional(),
  reducedFees: z.boolean(),
  acceptingClients: z.boolean(),
});

export type TherapistProfileFormData = z.infer<typeof therapistProfileSchema>;
