import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create author',
  })
  @ApiResponse({
    status: 201,
    description: 'Author created successfully',
  })
  create(
    @Body()
    createAuthorDto: CreateAuthorDto,
  ) {
    return this.authorsService.create(createAuthorDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get all authors',
  })
  findAll() {
    return this.authorsService.findAll();
  }

  @Get(':id/books')
  @ApiOperation({
    summary: 'Get all books by author',
  })
  getBooks(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.authorsService.getBooks(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get author by id',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.authorsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update author',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    updateAuthorDto: UpdateAuthorDto,
  ) {
    return this.authorsService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete author',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.authorsService.remove(id);
  }
}
