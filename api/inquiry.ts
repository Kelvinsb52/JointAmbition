import { Resend } from 'resend';

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

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed.' }, { status: 405 });
  }

  try {
    const data = await request.json() as InquiryPayload;

    // Silently accept honeypot submissions so bots do not learn they were blocked.
    if (asText(data.websiteUrl)) {
      return Response.json({ success: true });
    }

    const name = asText(data.name);
    const email = asText(data.email);
    const business = asText(data.business);
    const website = asText(data.website);
    const message = asText(data.message);
    const timeline = asText(data.timeline);
    const investment = asText(data.investment);

    if (!name || !email || !message) {
      return Response.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 },
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured.');
      return Response.json({ error: 'Email service is not configured.' }, { status: 500 });
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
      return Response.json({ error: 'Unable to send inquiry.' }, { status: 502 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Inquiry request error:', error);
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
