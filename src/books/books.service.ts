import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  create(createBookDto: CreateBookDto) {
    return this.prisma.book.create({
      data: createBookDto,
    });
  }

  findAll(title?: string, author?: string, category?: string) {
    return this.prisma.book.findMany({
      where: {
        title: title
          ? {
              contains: title,
              mode: 'insensitive',
            }
          : undefined,

        author: author
          ? {
              name: {
                contains: author,
                mode: 'insensitive',
              },
            }
          : undefined,

        category: category
          ? {
              name: {
                contains: category,
                mode: 'insensitive',
              },
            }
          : undefined,
      },

      include: {
        author: true,
        category: true,
      },

      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    await this.findOne(id);

    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.book.delete({
      where: { id },
    });
  }
  async getSummary(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        orders: {
          include: {
            student: true,
          },
          orderBy: {
            id: 'desc',
          },
        },
      },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return {
      book: {
        id: book.id,
        title: book.title,
        isbn: book.isbn,
        stock: book.stock,
        author: book.author.name,
        category: book.category.name,
      },

      totalBorrowed: book.orders.length,

      borrowedBy: book.orders.map((order) => ({
        orderId: order.id,
        studentId: order.student.id,
        studentName: order.student.name,
        status: order.status,
        orderDate: order.orderDate,
        returnDate: order.returnDate,
      })),
    };
  }
}
