import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  studentId!: number;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  bookId!: number;

  @ApiProperty({
    example: '2026-07-01',
  })
  @IsDateString()
  dueDate!: string;
}
