import { inngest } from "@/inngest/client";
import { getResend } from "@/lib/email/resend";
import {
  paymentConfirmationEmail,
  ownerNewPaymentEmail,
} from "@/lib/email/templates";
import { siteConfig } from "@/site.config";

/**
 * Triggered when a payment is confirmed (webhook marks it as paid).
 *
 * Steps:
 * 1. Send payment confirmation to customer
 * 2. Send notification to site owner
 */
export const onPaymentCompleted = inngest.createFunction(
  { id: "on-payment-completed", name: "Payment completed" },
  { event: "payment/completed" },
  async ({ event, step }) => {
    const { customerEmail, customerName, amountCents, currency } =
      event.data as {
        customerEmail: string;
        customerName: string;
        amountCents: number;
        currency: string;
      };

    const amountFormatted = new Intl.NumberFormat("en", {
      style: "currency",
      currency: currency || "eur",
    }).format(amountCents / 100);

    const fromAddress = `${siteConfig.name} <noreply@${siteConfig.domain}>`;

    // Step 1: Confirm to customer
    await step.run("send-payment-confirmation", async () => {
      const resend = getResend();
      const template = paymentConfirmationEmail(
        customerName || "there",
        amountFormatted,
      );

      await resend.emails.send({
        from: fromAddress,
        to: customerEmail,
        subject: template.subject,
        html: template.html,
      });

      return { sent: true, to: customerEmail };
    });

    // Step 2: Notify owner
    await step.run("notify-owner-payment", async () => {
      const resend = getResend();
      const template = ownerNewPaymentEmail({
        customerEmail,
        customerName: customerName || "",
        amountFormatted,
      });

      await resend.emails.send({
        from: fromAddress,
        to: siteConfig.contact.email,
        subject: template.subject,
        html: template.html,
      });

      return { sent: true, to: siteConfig.contact.email };
    });
  },
);
