import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Grade } from './schemas/grade.schema';
import { Course } from '../courses/schemas/course.schema';
import { calculateLetterGrade } from './grade.util';

@Injectable()
export class GradesService {
  constructor(
    @InjectModel(Grade.name) private gradeModel: Model<Grade>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
  ) {}

  async getRosterForCourse(courseId: string) {
    const course = await this.courseModel
      .findById(courseId)
      .populate('enrolledStudents');

    if (!course) throw new NotFoundException('Course not found');

    const existingGrades = await this.gradeModel.find({ course: courseId });
    const gradeMap = new Map(existingGrades.map((g) => [g.student.toString(), g]));

    return course.enrolledStudents.map((s: any) => {
      const existing = gradeMap.get(s._id?.toString?.() || s.toString());
      return {
        studentId: s._id || s,
        name: s.name || '',
        email: s.email || '',
        score: existing?.score ?? null,
        letterGrade: existing?.letterGrade ?? null,
        published: existing?.published ?? false,
      };
    });
  }

  async saveGrades(
    courseId: string,
    records: { studentId: string; score: number }[],
  ) {
    const results = await Promise.all(
      records.map((record) => {
        const { letterGrade, gradePoint } = calculateLetterGrade(record.score);
        return this.gradeModel.findOneAndUpdate(
          { student: record.studentId, course: courseId },
          {
            student: record.studentId,
            course: courseId,
            score: record.score,
            letterGrade,
            gradePoint,
          },
          { upsert: true, new: true },
        );
      }),
    );
    return { message: 'Grades saved', count: results.length };
  }

  async publishGrades(courseId: string) {
    const result = await this.gradeModel.updateMany(
      { course: courseId },
      { published: true },
    );
    return { message: 'Grades published', count: result.modifiedCount };
  }

  async getStudentGrades(studentId: string) {
    return this.gradeModel
      .find({ student: studentId, published: true })
      .populate('course', 'code name credits');
  }

  async getStudentGpa(studentId: string) {
    const grades = await this.gradeModel
      .find({ student: studentId, published: true })
      .populate('course', 'credits');

    if (grades.length === 0) return { gpa: 0, totalCredits: 0, coursesGraded: 0 };

    let totalPoints = 0;
    let totalCredits = 0;

    for (const g of grades) {
      const credits = (g.course as any)?.credits || 0;
      totalPoints += g.gradePoint * credits;
      totalCredits += credits;
    }

    const gpa = totalCredits > 0 ? +(totalPoints / totalCredits).toFixed(2) : 0;
    return { gpa, totalCredits, coursesGraded: grades.length };
  }
}