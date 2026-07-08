import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

// DTO for creating a student
// Validates all required fields

export class CreateStudentDto {
  // Student ID (like "S001", "S002")
  @IsString()
  @IsNotEmpty()
  studentId: string;

  // Full name
  @IsString()
  @IsNotEmpty()
  name: string;

  // Email address
  @IsEmail()
  email: string;

  // Phone number
  @IsString()
  @IsNotEmpty()
  phone: string;

  // Address (optional)
  @IsString()
  address: string;
}