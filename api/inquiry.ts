import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const recipient = 'inquiries@jointambitions.com';
const sender = 'Website Inquiry <website@jointambitions.com>';

type InquiryPayload = {
  name?: unknown;
  email?: unknown;
  business?: unknown;
  website?: unknown;
  message?: unknown;
  timeline?: unknown;
  investment?: unknown;
  websiteUrl?: unknown;
};

const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const data = (typeof request.body === 'string'
      ? JSON.parse(request.body)
      : request.body) as InquiryPayload;

    // Silently accept honeypot submissions so bots do not learn they were blocked.
    if (asText(data.websiteUrl)) {
      return response.status(200).json({ success: true });
    }

    const name = asText(data.name);
    const email = asText(data.email);
    const business = asText(data.business);
    const website = asText(data.website);
    const message = asText(data.message);
    const timeline = asText(data.timeline);
    const investment = asText(data.investment);

    if (!name || !email || !message) {
      return response.status(400).json({ error: 'Name, email, and message are required.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return response.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured.');
      return response.status(500).json({ error: 'Email service is not configured.' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: sender,
      to: recipient,
      replyTo: email,
      subject: `New inquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Business / Venture: ${business}`,
        `Website or Instagram: ${website}`,
        `Desired Timeline: ${timeline}`,
        `Estimated Investment: ${investment}`,
        '',
        'What are you building or refining?',
        message,
      ].join('\n'),
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return response.status(502).json({ error: 'Unable to send inquiry.' });
    }

    return response.status(200).json({ success: true });
  } catch (error) {
    console.error('Inquiry request error:', error);
    return response.status(400).json({ error: 'Invalid request.' });
  }
}
