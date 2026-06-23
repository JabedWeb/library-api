import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';

@Injectable()
export class StudentProfilesService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentProfileDto: CreateStudentProfileDto) {
    const existingProfile = await this.prisma.studentProfile.findUnique({
      where: {
        studentId: createStudentProfileDto.studentId,
      },
    });

    if (existingProfile) {
      throw new NotFoundException('This student already has a profile');
    }

    return this.prisma.studentProfile.create({
      data: createStudentProfileDto,
      include: {
        student: true,
      },
    });
  }

  findAll() {
    return this.prisma.studentProfile.findMany({
      include: {
        student: true,
      },
    });
  }

  async findOne(id: number) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { id },
      include: {
        student: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async update(id: number, updateStudentProfileDto: UpdateStudentProfileDto) {
    await this.findOne(id);

    return this.prisma.studentProfile.update({
      where: { id },
      data: updateStudentProfileDto,
      include: {
        student: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.studentProfile.delete({
      where: { id },
    });
  }
}
