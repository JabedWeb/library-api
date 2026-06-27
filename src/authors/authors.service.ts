import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService) {}

  create(createAuthorDto: CreateAuthorDto) {
    return this.prisma.author.create({
      data: createAuthorDto,
    });
  }

  findAll(search?: string) {
    return this.prisma.author.findMany({
      where: search
        ? {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : undefined,

      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const author = await this.prisma.author.findUnique({
      where: { id },
    });

    if (!author) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }

    return author;
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    await this.findOne(id);

    return this.prisma.author.update({
      where: { id },
      data: updateAuthorDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.author.delete({
      where: { id },
    });
  }

  async getBooks(id: number) {
    const author = await this.prisma.author.findUnique({
      where: { id },
      include: {
        books: {
          include: {
            categories: true,
          },
        },
      },
    });

    if (!author) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }

    return author;
  }
}
