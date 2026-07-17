import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GradesService } from './grades.service';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get('roster/:courseId')
  getRoster(@Param('courseId') courseId: string) {
    return this.gradesService.getRosterForCourse(courseId);
  }

  @Post('save')
  saveGrades(
    @Body() body: { courseId: string; records: { studentId: string; score: number }[] },
  ) {
    return this.gradesService.saveGrades(body.courseId, body.records);
  }

  @Post('publish/:courseId')
  publishGrades(@Param('courseId') courseId: string) {
    return this.gradesService.publishGrades(courseId);
  }

  @Get('student/:studentId')
  getStudentGrades(@Param('studentId') studentId: string) {
    return this.gradesService.getStudentGrades(studentId);
  }

  @Get('student/:studentId/gpa')
  getStudentGpa(@Param('studentId') studentId: string) {
    return this.gradesService.getStudentGpa(studentId);
  }
}