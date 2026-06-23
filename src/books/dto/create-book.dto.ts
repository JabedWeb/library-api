import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    example: 'NestJS Fundamentals',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: '9781234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiProperty({
    example: 10,
  })
  @IsInt()
  @Min(0)
  stock!: number;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  authorId!: number;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  categoryId!: number;
}
