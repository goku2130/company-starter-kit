import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { onLeadCaptured } from "@/inngest/functions/on-lead-captured";
import { onPaymentCompleted } from "@/inngest/functions/on-payment-completed";

/**
 * Inngest serve endpoint.
 * Registers all functions and handles incoming events.
 */
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [onLeadCaptured, onPaymentCompleted],
});
