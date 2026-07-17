import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance } from './schemas/attendance.schema';
import { Student } from '../students/schemas/student.schema';
import { Course } from '../courses/schemas/course.schema';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name) private attendanceModel: Model<Attendance>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
  ) {}

  async getRosterForCourse(courseId: string, date: string) {
    const course = await this.courseModel.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    const students = await this.studentModel
      .find({ _id: { $in: course.enrolledStudents } })
      .select('name email studentId');

    const existingRecords = await this.attendanceModel.find({
      course: courseId,
      date: new Date(date),
    });

    const statusMap = new Map(
      existingRecords.map((r) => [r.student.toString(), r.status]),
    );

    return students.map((s) => ({
      studentId: s._id,
      name: s.name,
      email: s.email,
      studentIdNumber: s.studentId || '',
      status: statusMap.get((s._id as any).toString()) || 'Present',
    }));
  }

  async markAttendance(
    courseId: string,
    date: string,
    records: { studentId: string; status: string; remarks?: string }[],
  ) {
    const attendanceDate = new Date(date);

    const results = await Promise.all(
      records.map((record) =>
        this.attendanceModel.findOneAndUpdate(
          { student: record.studentId, course: courseId, date: attendanceDate },
          {
            student: record.studentId,
            course: courseId,
            date: attendanceDate,
            status: record.status,
            remarks: record.remarks || '',
          },
          { upsert: true, new: true },
        ),
      ),
    );

    return { message: 'Attendance saved', count: results.length };
  }

  async getStudentAttendance(studentId: string) {
    return this.attendanceModel
      .find({ student: studentId })
      .populate('course', 'code name')
      .sort({ date: -1 });
  }

  async getStudentAttendanceStats(studentId: string) {
    const records = await this.attendanceModel.find({ student: studentId });

    const total = records.length;
    const present = records.filter((r) => r.status === 'Present').length;
    const absent = records.filter((r) => r.status === 'Absent').length;
    const late = records.filter((r) => r.status === 'Late').length;
    const percentage = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 0;
    return { total, present, absent, late, percentage };
  }

  async deleteRecord(id: string) {
    const deleted = await this.attendanceModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Attendance record not found');
    return { message: 'Attendance record deleted' };
  }
}