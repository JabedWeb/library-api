import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly mailPort = Number(process.env.MAIL_PORT ?? 587);
  private readonly mailSecure =
    process.env.MAIL_SECURE !== undefined
      ? process.env.MAIL_SECURE === 'true'
      : this.mailPort === 465;

  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: this.mailPort,
    secure: this.mailSecure,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendOrderEmail(
    studentEmail: string,
    studentName: string,
    bookTitle: string,
    pdfPath: string,
  ) {
    return this.transporter.sendMail({
      from: 'library@pixelvega.com',
      to: studentEmail,
      subject: 'Book Borrow Confirmation',

      html: `
        <h2>Library Book Borrow Confirmation</h2>

        <p>Hello ${studentName},</p>

        <p>You have successfully borrowed:</p>

        <strong>${bookTitle}</strong>

        <p>Please find the PDF receipt attached.</p>
      `,

      attachments: [
        {
          filename: 'order.pdf',
          contentType: 'application/pdf',
          path: pdfPath,
        },
      ],
    });
  }
}
