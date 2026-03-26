import { z } from "zod";

export const fulfillmentResponseSchema = z.object({
  token: z.string().min(1, "Token is required"),
  fulfilled: z.boolean(),
});

export type FulfillmentResponseData = z.infer<typeof fulfillmentResponseSchema>;
