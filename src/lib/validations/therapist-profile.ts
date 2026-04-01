import { z } from "zod";

export const PRONOUNS_OPTIONS = [
  "she/her",
  "he/him",
  "they/them",
  "ze/hir",
  "ze/zir",
  "ey/em",
  "other",
] as const;

export const AGE_OPTIONS = [
  "Toddler",
  "Children (6-10)",
  "Preteen",
  "Teen",
  "Adults",
  "Elders (65+)",
] as const;

export const PARTICIPANT_OPTIONS = ["Individual", "Couples", "Family", "Group"] as const;

export const PAYMENT_METHOD_OPTIONS = [
  "ACH Bank transfer",
  "American Express",
  "Cash",
  "Cheque",
  "Direct billing",
  "Discover",
  "e-Transfer",
  "Health Savings Account",
  "Mastercard",
  "Paypal",
  "Visa",
  "Wire",
] as const;

export const GENDER_OPTIONS = ["Female", "Male", "Non-binary", "Prefer not to say"] as const;

export const therapistProfileSchema = z.object({
  // Core identity
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  displayName: z.string().optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  imageUrl: z.string().url().optional().or(z.literal("")).or(z.literal(null)),
  pronouns: z
    .enum(["she/her", "he/him", "they/them", "ze/hir", "ze/zir", "ey/em", "other"])
    .or(z.string().max(20))
    .optional()
    .or(z.literal("")),
  therapistGender: z.string().optional(),
  primaryCredential: z.string().optional(),
  credentials: z.array(z.string()).max(3, "Maximum 3 credentials").optional(),

  // Practice info
  websiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  psychologyTodayUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  contactEmail: z.string().email("Must be a valid email").optional().or(z.literal("")),
  licensingLevel: z.string().optional(),
  freeConsultation: z.boolean(),

  // Location
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  country: z.literal("CA"),

  // Specialties & approaches (taxonomy IDs)
  specialties: z.array(z.string()).min(1, "Select at least one specialty"),
  topSpecialties: z.array(z.string()).max(3, "Maximum 3 top specialties").optional(),
  therapeuticApproach: z.array(z.string()).optional(),

  // Session details
  modalities: z.array(z.string()).min(1, "Select at least one modality"),
  languages: z.array(z.string()).optional(),
  ages: z.array(z.string()).min(1, "Select at least one age group"),

  // Communities served
  participants: z.array(z.string()).min(1, "Select at least one participant type"),
  groups: z.array(z.string()).optional(),
  faithOrientation: z.array(z.string()).default([]),
  ethnicity: z.array(z.string()).optional(),
  therapyStyle: z.array(z.string()).optional(),

  // Insurance & pricing
  insurers: z.array(z.string()).optional(),
  paymentMethods: z.array(z.string()).optional(),
  rateIndividual: z.number().positive().optional(),
  rateGroup: z.number().positive().optional(),
  rateFamily: z.number().positive().optional(),
  rateCouples: z.number().positive().optional(),
  proBono: z.boolean(),
  reducedFees: z.boolean(),
  acceptsInsurance: z.boolean(),

  // Availability
  acceptingClients: z.boolean(),
});

export type TherapistProfileFormData = z.infer<typeof therapistProfileSchema>;
