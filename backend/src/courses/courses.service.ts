import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from './schemas/course.schema';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

  async createCourse(courseData: any) {
    try {
      const newCourse = new this.courseModel(courseData);
      return await newCourse.save();
    } catch (error) {
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyValue)[0];
        const duplicateValue = error.keyValue[duplicateField];
        throw new ConflictException(
          `A course with ${duplicateField} "${duplicateValue}" already exists`
        );
      }
      throw error;
    }
  }

  async getAllCourses() {
    return this.courseModel.find();
  }

  async getPublicOverview() {
    const totalCourses = await this.courseModel.countDocuments();

    const sampleCourses = await this.courseModel
      .find({ status: 'ACTIVE' })
      .select('code name credits')
      .limit(6);

    const enrollmentTotals = await this.courseModel.aggregate([
      { $group: { _id: null, total: { $sum: '$students' } } },
    ]);

    return {
      totalCourses,
      totalEnrollments: enrollmentTotals[0]?.total || 0,
      sampleCourses: sampleCourses.map((c) => ({
        code: c.code,
        name: c.name,
        credits: c.credits,
      })),
    };
  }

  async getCourse(id: string) {
    return this.courseModel.findById(id);
  }

  async updateCourse(id: string, updateData: any) {
    return this.courseModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteCourse(id: string) {
    return this.courseModel.findByIdAndDelete(id);
  }

  async enrollStudent(courseId: string, studentId: string) {
    const course: any = await this.courseModel.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    if (course.enrolledStudents.includes(studentId)) {
      throw new BadRequestException('Student already enrolled in this course');
    }

    course.enrolledStudents.push(studentId);
    course.students = course.enrolledStudents.length;
    await course.save();

    return { message: 'Successfully enrolled', course };
  }

  async unenrollStudent(courseId: string, studentId: string) {
    const course: any = await this.courseModel.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    course.enrolledStudents = course.enrolledStudents.filter((id: string) => id !== studentId);
    course.students = course.enrolledStudents.length;
    await course.save();

    return { message: 'Successfully unenrolled', course };
  }

  async getStudentCourses(studentId: string) {
    return this.courseModel.find({ enrolledStudents: studentId });
  }
}