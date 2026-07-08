import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Student extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'student' })
  role: string;

  @Prop({ required: false })
  studentId: string;

  @Prop({ required: false })
  department: string;

  @Prop({ required: false })
  semester: string;

  @Prop({ required: false })
  phone: string;

  @Prop({ required: false })
  address: string;

  @Prop({ required: false })
  dateOfBirth: string;

  @Prop({ default: 'Active' })
  status: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  otp: string;

  @Prop()
  otpExpiry: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Course' }], default: [] })
  enrolledCourses: Types.ObjectId[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);