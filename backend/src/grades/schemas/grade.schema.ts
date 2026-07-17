import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Grade extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  student: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  course: Types.ObjectId;

  @Prop({ required: true, min: 0, max: 100 })
  score: number;

  @Prop({ required: true, enum: ['A', 'B', 'C', 'D', 'E', 'F'] })
  letterGrade: string;

  @Prop({ default: 0 })
  gradePoint: number;

  @Prop({ default: false })
  published: boolean;

  @Prop({ default: '' })
  remarks: string;
}

export const GradeSchema = SchemaFactory.createForClass(Grade);
GradeSchema.index({ student: 1, course: 1 }, { unique: true });