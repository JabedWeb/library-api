import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

import { PrismaService } from '../prisma/prisma.service';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { MailService } from 'src/mail/mail.service';
import { PdfService } from 'src/pdf/pdf.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private readonly orderPdfDirectory = join(process.cwd(), 'uploads', 'orders');

  constructor(
    private prisma: PrismaService,
    private pdfService: PdfService,
    private mailService: MailService,
  ) {}

  private getOrderStatus(order: { status: string; dueDate: Date }) {
    if (order.status === 'BORROWED' && order.dueDate < new Date()) {
      return 'OVERDUE';
    }

    return order.status;
  }

  async create(createOrderDto: CreateOrderDto) {
    const { studentId, bookId, dueDate } = createOrderDto;

    const student = await this.prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const book = await this.prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.stock <= 0) {
      throw new BadRequestException('Book is out of stock');
    }

    const order = await this.prisma.$transaction(async (tx) => {
      await tx.book.update({
        where: {
          id: bookId,
        },
        data: {
          stock: {
            decrement: 1,
          },
        },
      });

      return tx.order.create({
        data: {
          studentId,
          bookId,
          dueDate: new Date(dueDate),
        },
        include: {
          student: true,
          book: true,
        },
      });
    });

    let persistedOrder = order as typeof order & { pdfPath?: string };

    try {
      const pdf = await this.pdfService.generateOrderPdf(order);
      const fileName = `order-${order.id}.pdf`;
      const relativePdfPath = `/uploads/orders/${fileName}`;

      await mkdir(this.orderPdfDirectory, { recursive: true });
      await writeFile(join(this.orderPdfDirectory, fileName), pdf);

      await this.prisma.$executeRaw`
        UPDATE "Order"
        SET "pdfPath" = ${relativePdfPath}
        WHERE "id" = ${order.id}
      `;

      persistedOrder = {
        ...order,
        pdfPath: relativePdfPath,
      };

      await this.mailService.sendOrderEmail(
        persistedOrder.student.email,
        persistedOrder.student.name,
        persistedOrder.book.title,
        join(process.cwd(), relativePdfPath.replace(/^\//, '')),
      );
    } catch (error) {
      this.logger.error(
        `Order ${order.id} was created, but the confirmation email could not be sent.`,
        error instanceof Error ? error.stack : undefined,
      );
    }

    return persistedOrder;
  }

  async findAll() {
    const orders = await this.prisma.order.findMany({
      include: {
        student: true,
        book: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return orders.map((order) => ({
      ...order,
      status: this.getOrderStatus(order),
    }));
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        student: true,
        book: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    return { ...order, status: this.getOrderStatus(order) };
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.$transaction(async (tx) => {
      if (
        existingOrder.status !== 'RETURNED' &&
        updateOrderDto.status === 'RETURNED'
      ) {
        await tx.book.update({
          where: {
            id: existingOrder.bookId,
          },
          data: {
            stock: {
              increment: 1,
            },
          },
        });
      }

      return tx.order.update({
        where: { id },
        data: {
          ...updateOrderDto,

          returnDate: updateOrderDto.returnDate
            ? new Date(updateOrderDto.returnDate)
            : undefined,
        },
        include: {
          student: true,
          book: true,
        },
      });
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.order.delete({
      where: { id },
    });
  }
}
