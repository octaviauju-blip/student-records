import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ default: "" })
  description: string;

  @Prop({ default: "" })
  instructor: string;

  @Prop({ default: 3 })
  credits: number;

  @Prop({ default: "ACTIVE" })
  status: string;

  @Prop({ default: 1 })
  semester: number;

  @Prop({ default: 0 })
  students: number;

  @Prop({ type: [String], default: [] })
  enrolledStudents: string[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
