import { z } from "zod";

export const waitlistSchema = z.object({
  email: z.email("Please enter a valid email address"),
  country: z.string().min(1, "Country is required"),
});

export type WaitlistFormData = z.infer<typeof waitlistSchema>;
