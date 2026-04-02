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

export const MODALITIES = ["in-person", "virtual", "phone"] as const;
export const MODALITY_LABELS: Record<string, string> = {
  "in-person": "In-person",
  virtual: "Virtual",
  phone: "Phone",
};

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
  modalities: z.array(z.enum(MODALITIES)).min(1, "Select at least one modality"),
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

export const PROVINCES = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
] as const;

export const INSURERS = [
  "Aetna",
  "Alberta Blue Cross",
  "Alberta School Employee",
  "Alliance",
  "Any/Out-of-network Insurance",
  "Arete",
  "Beneva | SSQ",
  "Blue Cross",
  "Blue Shield",
  "BlueCross and BlueShield",
  "Canada Life | Great-West Life",
  "Chambers Plan",
  "CINUP",
  "ComPsych",
  "CVAP | Crime Victim",
  "Desjardins",
  "Empire Blue Cross Blue Shield",
  "Equitable Life of Canada",
  "First Canadian Health",
  "First Choice Health | FCH",
  "First Nations Health Authority",
  "Great-West Life",
  "Green Shield Canada",
  "Guardian",
  "Health Net",
  "Homewood Health",
  "Humana",
  "iA Financial Group",
  "Insurance Corporation of British Columbia",
  "Johnson",
  "Johnston Group",
  "LifeWise",
  "Manulife",
  "Maximum Benefit",
  "Medavie Blue Cross",
  "Medicare",
  "Meridian",
  "Military OneSource",
  "MultiPlan",
  "Pacific Blue Cross",
  "Royal Canadian Mounted Police",
  "Sentara Health Plans",
  "SunLife",
  "TELUS Health",
  "The Co-operators",
  "UHC UnitedHealthcare UBH United Behavioral Health",
  "Veterans Affairs Canada",
  "WSIB",
] as const;

export const STYLE_DESCRIPTORS = [
  "Structured",
  "Direct",
  "Relational",
  "Anti-oppressive",
  "Skills-based",
  "Warm",
  "Gentle",
] as const;

export const CLIENT_ETHNICITY_OPTIONS = [
  "Asian",
  "Black",
  "Hispanic and Latino",
  "Indigenous Peoples",
  "Other Racial or Ethnic Background",
  "Pacific Islander",
] as const;

export const FAITH_ORIENTATIONS = [
  "Any",
  "Buddhist",
  "Christian",
  "Hindu",
  "Jewish",
  "Muslim",
  "Other Spiritual or Religious Affiliations",
  "Secular and Non-Religious",
  "Sikh",
  "The Church of Jesus Christ of Latter-day Saints",
] as const;

export const LICENSING_LEVELS = [
  "Fully Licensed",
  "Supervised Practice",
  "Practicum Student",
] as const;

export const PARTICIPANT_RATE_MAP: Record<
  string,
  { field: "rateIndividual" | "rateGroup" | "rateFamily" | "rateCouples"; label: string }
> = {
  Individual: { field: "rateIndividual", label: "Individual session rate" },
  Group: { field: "rateGroup", label: "Group session rate" },
  Family: { field: "rateFamily", label: "Family session rate" },
  Couples: { field: "rateCouples", label: "Couples session rate" },
};
