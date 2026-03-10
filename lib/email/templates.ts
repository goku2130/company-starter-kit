import { siteConfig } from "@/site.config";

/* ═══════════════════════════════════════════════════════════════════
   Email templates — plain HTML strings.

   Kept intentionally simple. No heavy templating library needed.
   The agent can customise these per company vertical.
   ═══════════════════════════════════════════════════════════════════ */

const baseStyles = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1a1a2e;
  line-height: 1.6;
`;

function wrap(content: string): string {
  return `
    <div style="max-width: 560px; margin: 0 auto; padding: 40px 20px; ${baseStyles}">
      ${content}
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />
      <p style="font-size: 12px; color: #999;">
        ${siteConfig.name} · ${siteConfig.tagline}<br />
        <a href="${siteConfig.url}" style="color: #999;">${siteConfig.domain}</a>
      </p>
    </div>
  `;
}

/* ─── Lead confirmation ─────────────────────────────────────────── */

export function leadConfirmationEmail(name: string): {
  subject: string;
  html: string;
} {
  const firstName = name.split(" ")[0];
  return {
    subject: `Welcome to ${siteConfig.name} — you're on the list!`,
    html: wrap(`
      <h2 style="font-size: 22px; font-weight: 600; margin: 0 0 16px;">
        Hey ${firstName}, welcome aboard!
      </h2>
      <p>
        Thanks for joining the ${siteConfig.name} early adopters program.
        We're building this with our first users, and you're now one of them.
      </p>
      <p>Here's what happens next:</p>
      <ol style="padding-left: 20px;">
        <li>We'll review your sign-up (usually within a few hours)</li>
        <li>You'll get access to try everything free for 14 days</li>
        <li>We'll be in touch personally to help you get started</li>
      </ol>
      <p>
        In the meantime, feel free to reply to this email with any questions.
        We read every message.
      </p>
      <p style="margin-top: 24px;">
        Cheers,<br />
        The ${siteConfig.name} team
      </p>
    `),
  };
}

/* ─── Owner notification — new lead ─────────────────────────────── */

export function ownerNewLeadEmail(lead: {
  name: string;
  email: string;
  company: string;
}): { subject: string; html: string } {
  return {
    subject: `New lead: ${lead.name} (${lead.email})`,
    html: wrap(`
      <h2 style="font-size: 22px; font-weight: 600; margin: 0 0 16px;">
        New lead captured
      </h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 8px 12px; font-weight: 600; color: #666; width: 100px;">Name</td>
          <td style="padding: 8px 12px;">${lead.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: 600; color: #666;">Email</td>
          <td style="padding: 8px 12px;">
            <a href="mailto:${lead.email}" style="color: #2563eb;">${lead.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: 600; color: #666;">Company</td>
          <td style="padding: 8px 12px;">${lead.company || "—"}</td>
        </tr>
      </table>
      <p style="margin-top: 20px;">
        <a href="${siteConfig.url}/admin/leads"
           style="display: inline-block; background: #2563eb; color: #fff; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">
          View in admin
        </a>
      </p>
    `),
  };
}

/* ─── Payment confirmation ──────────────────────────────────────── */

export function paymentConfirmationEmail(
  customerName: string,
  amountFormatted: string,
): { subject: string; html: string } {
  const firstName = customerName.split(" ")[0] || "there";
  return {
    subject: `Payment confirmed — welcome to ${siteConfig.name}!`,
    html: wrap(`
      <h2 style="font-size: 22px; font-weight: 600; margin: 0 0 16px;">
        You're in, ${firstName}!
      </h2>
      <p>
        Your payment of <strong>${amountFormatted}</strong> has been received.
        You now have full access to ${siteConfig.name} as an early adopter.
      </p>
      <p>
        Your founding member rate is locked in forever — it will never increase,
        even as we add more features.
      </p>
      <p>
        If you have any questions, just reply to this email. We're here to help.
      </p>
      <p style="margin-top: 24px;">
        Cheers,<br />
        The ${siteConfig.name} team
      </p>
    `),
  };
}

/* ─── Owner notification — new payment ──────────────────────────── */

export function ownerNewPaymentEmail(payment: {
  customerEmail: string;
  customerName: string;
  amountFormatted: string;
}): { subject: string; html: string } {
  return {
    subject: `Payment received: ${payment.amountFormatted} from ${payment.customerEmail}`,
    html: wrap(`
      <h2 style="font-size: 22px; font-weight: 600; margin: 0 0 16px;">
        Payment received
      </h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 8px 12px; font-weight: 600; color: #666; width: 100px;">Customer</td>
          <td style="padding: 8px 12px;">${payment.customerName || payment.customerEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: 600; color: #666;">Email</td>
          <td style="padding: 8px 12px;">
            <a href="mailto:${payment.customerEmail}" style="color: #2563eb;">${payment.customerEmail}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: 600; color: #666;">Amount</td>
          <td style="padding: 8px 12px; font-weight: 600; color: #16a34a;">${payment.amountFormatted}</td>
        </tr>
      </table>
      <p style="margin-top: 20px;">
        <a href="${siteConfig.url}/admin/payments"
           style="display: inline-block; background: #2563eb; color: #fff; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">
          View in admin
        </a>
      </p>
    `),
  };
}
