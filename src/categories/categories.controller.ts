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

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create category',
  })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
  })
  create(
    @Body()
    createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all categories',
  })
  @Get()
  @ApiOperation({
    summary: 'Get all categories',
  })
  findAll(
    @Query('search')
    search?: string,
  ) {
    return this.categoriesService.findAll(search);
  }

  @Get(':id/books')
  @ApiOperation({
    summary: 'Get all books by category',
  })
  getBooks(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.categoriesService.getBooks(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get category by id',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update category',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete category',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.categoriesService.remove(id);
  }
}
