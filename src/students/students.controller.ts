import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@ApiTags('Students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create student',
  })
  @ApiResponse({
    status: 201,
    description: 'Student created successfully',
  })
  create(
    @Body()
    createStudentDto: CreateStudentDto,
  ) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all students or search students',
  })
  findAll(
    @Query('id') id?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
  ) {
    return this.studentsService.findAll(id, email, phone);
  }
  @Get(':id/summary')
  @ApiOperation({
    summary: 'Student borrowing summary',
  })
  getSummary(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.studentsService.getSummary(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get student by id',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update student',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete student',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.studentsService.remove(id);
  }
}
