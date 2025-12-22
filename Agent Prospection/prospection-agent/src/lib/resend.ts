import { Resend } from 'resend';

let resendClient: Resend | null = null;

function getResend(): Resend {
    if (!resendClient) {
        resendClient = new Resend(process.env.RESEND_API_KEY);
    }
    return resendClient;
}

interface SendEmailParams {
    to: string;
    subject: string;
    body: string;
    from?: string;
    replyTo?: string;
}

export async function sendEmail({ to, subject, body, from, replyTo }: SendEmailParams) {
    const fromEmail = from || process.env.FROM_EMAIL || 'onboarding@resend.dev';

    const { data, error } = await getResend().emails.send({
        from: fromEmail,
        to: [to],
        subject: subject,
        html: formatEmailAsHtml(body),
        replyTo: replyTo || fromEmail,
    });

    if (error) {
        throw new Error(`Failed to send email: ${error.message}`);
    }

    return data;
}

export async function sendBatchEmails(
    emails: Array<{
        to: string;
        subject: string;
        body: string;
    }>,
    delayMs: number = 1000
) {
    const results: Array<{ success: boolean; to: string; id?: string; error?: string }> = [];

    for (const email of emails) {
        try {
            const result = await sendEmail(email);
            results.push({
                success: true,
                to: email.to,
                id: result?.id,
            });
        } catch (error) {
            results.push({
                success: false,
                to: email.to,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }

        // Rate limiting - wait between emails
        if (delayMs > 0) {
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }

    return results;
}

function formatEmailAsHtml(body: string): string {
    // Convert plain text with line breaks to HTML
    const htmlBody = body
        .split('\n')
        .map(line => {
            if (line.trim() === '') {
                return '<br>';
            }
            return `<p style="margin: 0 0 10px 0; line-height: 1.6;">${line}</p>`;
        })
        .join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 16px; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      ${htmlBody}
    </body>
    </html>
  `;
}
