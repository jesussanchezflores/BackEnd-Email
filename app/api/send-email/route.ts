import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { to, subject, html, attachments } = await request.json();

    if (!process.env.ZOHO_USER || !process.env.ZOHO_PASSWORD) {
      console.error('Missing environment variables: ZOHO_USER or ZOHO_PASSWORD');
      return NextResponse.json({ error: 'Server configuration error: Missing credentials' }, { status: 500 });
    }

    // API Key Validation
    const apiKey = request.headers.get('x-api-key');
    if (!process.env.API_KEY || apiKey !== process.env.API_KEY) {
      return NextResponse.json({ error: 'Unauthorized: Invalid or missing API Key' }, { status: 401 });
    }

    if (!to || !subject || !html) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true, // ssl
      auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.ZOHO_USER,
      to,
      subject,
      html,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

    return NextResponse.json({ message: 'Email sent successfully', messageId: info.messageId }, { status: 200 });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email', details: error.message }, { status: 500 });
  }
}
