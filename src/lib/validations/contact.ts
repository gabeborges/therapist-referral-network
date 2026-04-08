import { z } from "zod";

export const contactSchema = z.object({
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(150, "Subject must be 150 characters or less"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(2000, "Message must be 2000 characters or less"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
