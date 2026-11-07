import { Resend } from 'resend';
import { config } from '../config.js';

let resendClient = null;

export function getResendClient() {
  if (!resendClient && config.resendApiKey) {
    resendClient = new Resend(config.resendApiKey);
  }
  return resendClient;
}

/**
 * Send an enterprise transactional email using Resend API with verified custom domain
 */
export async function sendResendEmail({
  to,
  subject,
  html,
  replyTo,
  from = `BioLink Agritech <${config.emailFromAddress || 'info@biolinkagri.in'}>`,
}) {
  const resend = getResendClient();

  if (!resend) {
    throw new Error('Resend client is not initialized. Please configure RESEND_API_KEY.');
  }

  const { data, error } = await resend.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    ...(replyTo ? { reply_to: replyTo } : {}),
  });

  if (error) {
    console.error('❌ Resend API Error:', error);
    throw new Error(`Resend delivery failed: ${error.message || JSON.stringify(error)}`);
  }

  return data;
}
