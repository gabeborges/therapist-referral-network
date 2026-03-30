import { z } from "zod";

export const therapistProfileSchema = z.object({
  // Core identity
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  displayName: z.string().min(1, "Display name is required"),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  imageUrl: z.string().url().optional().or(z.literal("")).or(z.literal(null)),
  pronouns: z.string().optional(),
  therapistGender: z.string().optional(),
  primaryCredential: z.string().optional(),
  credentials: z.array(z.string()).max(3, "Maximum 3 credentials").optional(),

  // Practice info
  websiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  psychologyTodayUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  professionalEmail: z.string().email("Must be a valid email").optional().or(z.literal("")),
  licensingLevel: z.string().optional(),
  freeConsultation: z.boolean(),

  // Location
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  country: z.literal("CA"),

  // Specialties & approaches (taxonomy IDs)
  specialties: z.array(z.string()).min(1, "Select at least one specialty"),
  topSpecialties: z.array(z.string()).max(3, "Maximum 3 top specialties").optional(),
  therapeuticApproach: z.array(z.string()).min(1, "Select at least one approach"),
  otherTreatmentOrientation: z.string().optional(),

  // Session details
  modalities: z.array(z.string()).min(1, "Select at least one modality"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  ageGroups: z.array(z.string()).min(1, "Select at least one age group"),

  // Communities served
  participants: z.array(z.string()).optional(),
  alliedGroups: z.array(z.string()).optional(),
  faithOrientation: z.string().optional(),
  clientEthnicity: z.array(z.string()).optional(),
  styleDescriptors: z.array(z.string()).optional(),

  // Insurance & pricing
  acceptsInsurance: z.boolean(),
  directBilling: z.boolean(),
  insurers: z.array(z.string()).optional(),
  hourlyRate: z.number().positive().optional(),
  reducedFees: z.boolean(),
  proBono: z.boolean(),
  paymentMethods: z.array(z.string()).optional(),

  // Availability
  acceptingClients: z.boolean(),
});

export type TherapistProfileFormData = z.infer<typeof therapistProfileSchema>;
