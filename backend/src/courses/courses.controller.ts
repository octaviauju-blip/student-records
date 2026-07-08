import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Post()
  async createCourse(@Body() courseData: any) {
    return this.coursesService.createCourse(courseData);
  }

  @Get()
  async getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  @Get(':id')
  async getCourse(@Param('id') id: string) {
    return this.coursesService.getCourse(id);
  }

  @Put(':id')
  async updateCourse(@Param('id') id: string, @Body() updateData: any) {
    return this.coursesService.updateCourse(id, updateData);
  }

  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    return this.coursesService.deleteCourse(id);
  }

  @Post(':id/enroll')
  async enrollStudent(@Param('id') courseId: string, @Body('studentId') studentId: string) {
    return this.coursesService.enrollStudent(courseId, studentId);
  }

  @Post(':id/unenroll')
  async unenrollStudent(@Param('id') courseId: string, @Body('studentId') studentId: string) {
    return this.coursesService.unenrollStudent(courseId, studentId);
  }

  @Get('student/:studentId')
  async getStudentCourses(@Param('studentId') studentId: string) {
    return this.coursesService.getStudentCourses(studentId);
  }
}