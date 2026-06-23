import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateStudentProfileDto {
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  studentId!: number;

  @ApiProperty({
    example: 'Dhaka, Bangladesh',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: 22,
    required: false,
  })
  @IsOptional()
  @Min(1)
  age?: number;
}
