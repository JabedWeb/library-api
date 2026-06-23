import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

@Injectable()
export class PdfService {
  generateOrderPdf(order: any) {
    const doc = new PDFDocument();

    const buffers: Buffer[] = [];

    doc.on('data', (chunk) => {
      buffers.push(chunk);
    });

    return new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });

      doc.fontSize(20);
      doc.text('Library Order Receipt');

      doc.moveDown();

      doc.fontSize(12);
      doc.text(`Order ID: ${order.id}`);
      doc.text(`Student: ${order.student.name}`);
      doc.text(`Email: ${order.student.email}`);

      doc.moveDown();

      doc.text(`Book: ${order.book.title}`);
      doc.text(`Status: ${order.status}`);

      doc.moveDown();

      doc.text(`Borrow Date: ${order.orderDate}`);
      doc.text(`Due Date: ${order.dueDate}`);
      doc.text(`Return Date: ${order.returnDate ?? 'N/A'}`);

      doc.end();
    });
  }
}
