import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: {
    sendMail: (arg0: {
      from: string;
      to: string;
      subject: string;
      html: string;
    }) => any;
  };

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
      port: parseInt(process.env.EMAIL_PORT ?? '2525'),
      auth: {
        user: process.env.EMAIL_USER || 'your_mailtrap_username',
        pass: process.env.EMAIL_PASS || 'your_mailtrap_password',
      },
    });
  }

  async sendPasswordResetCode(email: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM || 'reconfortdanny@gmail.com',
      to: email,
      subject: 'Password Reset Code',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Use the following code to reset your password:</p>
        <h2>${code}</h2>
        <p>This code will expire in 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
      `,
    });
  }
}