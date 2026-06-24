import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';

import { readFile } from 'fs/promises';

import { join } from 'path';

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

  private async renderTemplate(
    templateName: string,
    data: Record<string, unknown>,
  ) {
    const templatePath = join(
      process.cwd(),
      'src',
      'mail',
      'templates',
      `${templateName}.hbs`,
    );

    const source = await readFile(templatePath, 'utf8');

    const template = handlebars.compile(source);

    return template(data);
  }

  async sendOrderEmail(
    studentEmail: string,
    studentName: string,
    bookTitle: string,
    orderId: number,
    status: string,
    borrowDate: string,
    dueDate: string,
    pdfPath: string,
  ) {
    const html = await this.renderTemplate('order-confirmation', {
      studentName,
      orderId,
      bookTitle,
      status,
      borrowDate,
      dueDate,
    });
    return this.transporter.sendMail({
      from: process.env.MAIL_USER,
      to: studentEmail,
      subject: 'Book Borrow Confirmation',

      html,

      attachments: [
        {
          filename: `order-${orderId}.pdf`,
          contentType: 'application/pdf',
          path: pdfPath,
        },
      ],
    });
  }
}
