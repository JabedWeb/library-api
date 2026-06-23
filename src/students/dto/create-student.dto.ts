import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({
    example: 'Arifur Rahman',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'arifur@pixelvega.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '01712345678',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
