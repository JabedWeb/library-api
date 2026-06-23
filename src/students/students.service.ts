import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  create(createStudentDto: CreateStudentDto) {
    return this.prisma.student.create({
      data: createStudentDto,
    });
  }

  findAll(id?: string, email?: string, phone?: string) {
    return this.prisma.student.findMany({
      where: {
        id: id ? Number(id) : undefined,

        email: email
          ? {
              contains: email,
              mode: 'insensitive',
            }
          : undefined,

        phone: phone
          ? {
              contains: phone,
            }
          : undefined,
      },
      include: {
        profile: true,
        orders: {
          include: {
            book: true,
          },
        },
      },

      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        profile: true,
        orders: {
          include: {
            book: true,
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }

    return student;
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    await this.findOne(id);

    return this.prisma.student.update({
      where: { id },
      data: updateStudentDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.student.delete({
      where: { id },
    });
  }
  async getSummary(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            book: true,
          },
          orderBy: {
            id: 'desc',
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return {
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        phone: student.phone,
      },

      totalBooksBorrowed: student.orders.length,

      currentlyBorrowed: student.orders
        .filter((order) => order.status === 'BORROWED')
        .map((order) => ({
          id: order.book.id,
          title: order.book.title,
        })),

      orderHistory: student.orders,
    };
  }
}
