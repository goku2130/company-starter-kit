import { inngest } from "@/inngest/client";
import { getResend } from "@/lib/email/resend";
import {
  leadConfirmationEmail,
  ownerNewLeadEmail,
} from "@/lib/email/templates";
import { siteConfig } from "@/site.config";

/**
 * Triggered when a new lead is captured via the website form.
 *
 * Steps:
 * 1. Send confirmation email to the lead
 * 2. Send notification email to the site owner
 */
export const onLeadCaptured = inngest.createFunction(
  { id: "on-lead-captured", name: "Lead captured" },
  { event: "lead/captured" },
  async ({ event, step }) => {
    const { name, email, company } = event.data as {
      name: string;
      email: string;
      company: string;
    };

    const fromAddress = `${siteConfig.name} <noreply@${siteConfig.domain}>`;

    // Step 1: Send confirmation to lead
    await step.run("send-lead-confirmation", async () => {
      const resend = getResend();
      const template = leadConfirmationEmail(name);

      await resend.emails.send({
        from: fromAddress,
        to: email,
        subject: template.subject,
        html: template.html,
      });

      return { sent: true, to: email };
    });

    // Step 2: Notify site owner
    await step.run("notify-owner", async () => {
      const resend = getResend();
      const template = ownerNewLeadEmail({ name, email, company });

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
