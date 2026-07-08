import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('students')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get()
  async findAll() {
    return await this.studentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.studentService.findOne(id);
  }

  @Get(':id/dashboard-stats')
  async getDashboardStats(@Param('id') id: string) {
    return await this.studentService.getDashboardStats(id);
  }

  @Post()
  async create(@Body() createStudentDto: any) {
    return await this.studentService.create(createStudentDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateStudentDto: any) {
    return await this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.studentService.delete(id);
  }
}