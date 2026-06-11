import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

export const resend = new Resend(apiKey);

export const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev';
