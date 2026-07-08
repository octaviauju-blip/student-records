import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './schemas/student.schema';
import { Course } from '../courses/schemas/course.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
  ) {}

  async findAll() {
    return await this.studentModel.find().select('-password').populate('enrolledCourses');
  }

  async findOne(id: string) {
    const student = await this.studentModel.findById(id).select('-password').populate('enrolledCourses');
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async create(createStudentDto: any) {
    const existing = await this.studentModel.findOne({ email: createStudentDto.email });
    if (existing) throw new ConflictException('A student with this email already exists');

    const defaultPassword = createStudentDto.password || 'student123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const newStudent = new this.studentModel({
      ...createStudentDto,
      password: hashedPassword,
      role: 'student',
    });

    const saved = await newStudent.save();
    const savedObj: any = saved.toObject();
    const { password, ...result } = savedObj;
    return result;
  }

  async update(id: string, updateStudentDto: any) {
    const { password, ...safeData } = updateStudentDto;

    const updated = await this.studentModel
      .findByIdAndUpdate(id, safeData, { new: true })
      .select('-password');

    if (!updated) throw new NotFoundException('Student not found');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.studentModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Student not found');
    return { message: 'Student deleted successfully' };
  }

  async getDashboardStats(studentId: string) {
    const student = await this.studentModel.findById(studentId);
    if (!student) throw new NotFoundException('Student not found');

    // Source of truth for enrollment is Course.enrolledStudents (plain string array)
    const enrolledCourses: any = await this.courseModel.find({ enrolledStudents: studentId });

    const totalCredits = enrolledCourses.reduce(
      (sum: number, c: any) => sum + (c.credits || 0),
      0
    );

    return {
      enrolledCoursesCount: enrolledCourses.length,
      totalCredits,
      courses: enrolledCourses,
    };
  }
}