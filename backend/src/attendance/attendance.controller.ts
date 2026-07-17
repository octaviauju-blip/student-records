import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('roster/:courseId')
  getRoster(@Param('courseId') courseId: string, @Query('date') date: string) {
    return this.attendanceService.getRosterForCourse(courseId, date);
  }

  @Post('mark')
  markAttendance(
    @Body()
    body: {
      courseId: string;
      date: string;
      records: { studentId: string; status: string; remarks?: string }[];
    },
  ) {
    return this.attendanceService.markAttendance(
      body.courseId,
      body.date,
      body.records,
    );
  }

  @Get('student/:studentId')
  getStudentAttendance(@Param('studentId') studentId: string) {
    return this.attendanceService.getStudentAttendance(studentId);
  }

  @Get('student/:studentId/stats')
  getStudentStats(@Param('studentId') studentId: string) {
    return this.attendanceService.getStudentAttendanceStats(studentId);
  }

  @Delete(':id')
  deleteRecord(@Param('id') id: string) {
    return this.attendanceService.deleteRecord(id);
  }
}