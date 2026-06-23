import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({
    example: 'Humayun Ahmed',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'Famous Bangladeshi novelist',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;
}
