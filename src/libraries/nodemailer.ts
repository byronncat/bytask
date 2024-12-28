'use server';

import path from 'path';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

type MailOptions = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export async function sendEmail(mailOptions: MailOptions) {
  try {
    await transporter.sendMail({
      ...mailOptions,
      from: `Bytask ${process.env.EMAIL_USER}`,
      html: mailOptions.html,
      attachments: [
        {
          filename: 'icon.png',
          path: path.join(process.cwd(), 'public', 'icon.png'),
          cid: 'logo',
        },
      ],
    });
  } catch (error) {
    console.error('[Nodemailer]', error);
  }
}
