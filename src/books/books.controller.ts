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

import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({
    summary: 'Create book',
  })
  @ApiResponse({
    status: 201,
    description: 'Book created successfully',
  })
  create(
    @Body()
    createBookDto: CreateBookDto,
  ) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all books',
  })
  findAll(
    @Query('title') title?: string,
    @Query('author') author?: string,
    @Query('category') category?: string,
  ) {
    return this.booksService.findAll(title, author, category);
  }
  @Get(':id/summary')
  @ApiOperation({
    summary: 'Book borrowing summary',
  })
  getSummary(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.booksService.getSummary(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get book by id',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update book',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete book',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.booksService.remove(id);
  }
}
