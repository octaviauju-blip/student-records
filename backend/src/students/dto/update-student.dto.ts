import { IsString, IsEmail, IsOptional } from 'class-validator';

// Update DTO - all fields optional
// User can update any field they want

export class UpdateStudentDto {
  @IsString()
  @IsOptional()
  studentId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;
}