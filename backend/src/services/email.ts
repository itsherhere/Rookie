import { resend, FROM_EMAIL } from '../lib/resend';
import type {
  ApplicationEmailPayload,
  InterviewEmailPayload,
  StatusUpdateEmailPayload,
} from '../types';

// ─── Application Emails ────────────────────────────────────────────────────────

export async function sendApplicationReceivedToCandidate(
  payload: ApplicationEmailPayload
): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: payload.candidateEmail,
    subject: `Application received — ${payload.jobTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0F0F1A;">Hi ${payload.candidateName},</h2>
        <p>Your application for <strong>${payload.jobTitle}</strong> at <strong>${payload.companyName}</strong> has been received.</p>
        <p>We'll keep you updated as the hiring team reviews your profile.</p>
        <p style="color: #6B6888; font-size: 14px;">— The Rookie team</p>
      </div>
    `,
  });
}

export async function sendNewApplicationToEmployer(
  payload: ApplicationEmailPayload
): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: payload.employerEmail,
    subject: `New application for ${payload.jobTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0F0F1A;">New application received</h2>
        <p><strong>${payload.candidateName}</strong> has applied for <strong>${payload.jobTitle}</strong>.</p>
        <p>Log in to Rookie to review their profile and update the application status.</p>
        <p style="color: #6B6888; font-size: 14px;">— The Rookie team</p>
      </div>
    `,
  });
}

// ─── Interview Emails ─────────────────────────────────────────────────────────

export async function sendInterviewInviteToCandidate(
  payload: InterviewEmailPayload
): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: payload.candidateEmail,
    subject: `Interview invitation — ${payload.jobTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0F0F1A;">Hi ${payload.candidateName},</h2>
        <p>You have been invited to an interview for <strong>${payload.jobTitle}</strong>.</p>
        <table style="margin: 20px 0; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 16px 6px 0; color: #6B6888; font-size: 14px;">Date</td>
            <td style="padding: 6px 0; font-weight: 500;">${payload.interviewDate}</td>
          </tr>
          <tr>
            <td style="padding: 6px 16px 6px 0; color: #6B6888; font-size: 14px;">Time</td>
            <td style="padding: 6px 0; font-weight: 500;">${payload.interviewTime}</td>
          </tr>
          <tr>
            <td style="padding: 6px 16px 6px 0; color: #6B6888; font-size: 14px;">Format</td>
            <td style="padding: 6px 0; font-weight: 500; text-transform: capitalize;">${payload.interviewType}</td>
          </tr>
          ${payload.meetingLink ? `
          <tr>
            <td style="padding: 6px 16px 6px 0; color: #6B6888; font-size: 14px;">Link</td>
            <td style="padding: 6px 0;"><a href="${payload.meetingLink}" style="color: #5046E4;">${payload.meetingLink}</a></td>
          </tr>` : ''}
        </table>
        <p>Please log in to Rookie to accept or decline this invitation.</p>
        <p style="color: #6B6888; font-size: 14px;">— The Rookie team</p>
      </div>
    `,
  });
}

// ─── Status Update Emails ─────────────────────────────────────────────────────

export async function sendStatusUpdateToCandidate(
  payload: StatusUpdateEmailPayload
): Promise<void> {
  const statusMessages: Record<string, string> = {
    reviewed: 'Your application is being reviewed by the hiring team.',
    shortlisted: 'Congratulations! You have been shortlisted for the next stage.',
    interview: 'You have been invited to an interview. Check your Rookie dashboard.',
    rejected: 'After careful consideration, the team has decided not to move forward at this time.',
    hired: 'Congratulations! You have been selected for this role.',
  };

  const message = statusMessages[payload.newStatus] || `Your application status has been updated to: ${payload.newStatus}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: payload.candidateEmail,
    subject: `Application update — ${payload.jobTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0F0F1A;">Hi ${payload.candidateName},</h2>
        <p>${message}</p>
        <p>Log in to Rookie to view your full application status.</p>
        <p style="color: #6B6888; font-size: 14px;">— The Rookie team</p>
      </div>
    `,
  });
}
