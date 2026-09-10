import { Resend } from "resend";
import { siteConfig } from "@/lib/data";
import {
  buildWelcomeHtml,
  buildWelcomeText,
  buildSubscribeNotificationHtml,
  buildSubscribeNotificationText,
} from "@/lib/email";

export async function sendOwnerSubscribeNotification(email: string) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;
  if (!resendApiKey || !notifyEmail) return;

  const resend = new Resend(resendApiKey);
  const { error } = await resend.emails.send({
    from: "Jeevesh Krishna <notifications@jeeveshkrishna.com>",
    to: notifyEmail,
    subject: `New subscriber: ${email}`,
    html: buildSubscribeNotificationHtml({ email }),
    text: buildSubscribeNotificationText({ email }),
  });

  if (error) {
    console.error("[subscribe notification] Delivery failed.");
  }
}

export async function sendWelcomeEmail(email: string, unsubscribeToken: string) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) return; // Fail silently - subscription still succeeded

  const unsubscribeUrl = `${siteConfig.siteUrl}/api/unsubscribe?token=${unsubscribeToken}`;
  const resend = new Resend(resendApiKey);

  const { error } = await resend.emails.send({
    from: "Jeevesh Krishna <newsletter@jeeveshkrishna.com>",
    to: email,
    subject: "You are subscribed.",
    html: buildWelcomeHtml({ unsubscribeUrl }),
    text: buildWelcomeText({ unsubscribeUrl }),
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });

  if (error) {
    console.error("[subscribe welcome email] Delivery failed.");
  }
}
