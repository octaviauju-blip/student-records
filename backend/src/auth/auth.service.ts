import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcryptjs';
import { Student } from '../students/schemas/student.schema';
import { EmailService } from '../email/email.service';
import { generateOtp, getOtpExpiry } from '../common/otp.util';
import { UserRegisteredEvent } from './registration.listener';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private eventEmitter: EventEmitter2,
  ) {}

  private buildAuthResponse(student: any) {
    const payload = {
      sub: student._id,
      email: student.email,
      role: student.role,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        isVerified: student.isVerified,
      },
    };
  }

  async register(registerDto: any) {
    const { name, email, password } = registerDto;

    const existing = await this.studentModel.findOne({ email });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpiry = getOtpExpiry(10);

    const newStudent = new this.studentModel({
      name,
      email,
      password: hashedPassword,
      role: 'student',
      isVerified: false,
      otp,
      otpExpiry,
    });

    const saved = await newStudent.save();

    // Fire event -> listener sends the OTP email
    this.eventEmitter.emit('user.registered', new UserRegisteredEvent(email, name, otp));

    // Auto-login: return token immediately, same shape as login()
    return this.buildAuthResponse(saved);
  }

  async login(loginDto: any) {
    const { email, password } = loginDto;

    const student: any = await this.studentModel.findOne({ email });
    if (!student) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, student.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    this.emailService.sendLoginNotification(student.email, student.name);

    return this.buildAuthResponse(student);
  }

  async verifyOtp(verifyDto: any) {
    const { email, otp } = verifyDto;

    const student: any = await this.studentModel.findOne({ email });
    if (!student) {
      throw new BadRequestException('Account not found');
    }

    if (student.isVerified) {
      return { message: 'Account already verified' };
    }

    if (!student.otp || student.otp !== otp) {
      throw new BadRequestException('Invalid verification code');
    }

    if (!student.otpExpiry || new Date() > new Date(student.otpExpiry)) {
      throw new BadRequestException('Verification code has expired. Please request a new one.');
    }

    student.isVerified = true;
    student.otp = undefined;
    student.otpExpiry = undefined;
    await student.save();

    return { message: 'Account verified successfully', isVerified: true };
  }

  async resendOtp(resendDto: any) {
    const { email } = resendDto;

    const student: any = await this.studentModel.findOne({ email });
    if (!student) {
      throw new BadRequestException('Account not found');
    }

    if (student.isVerified) {
      return { message: 'Account already verified' };
    }

    const otp = generateOtp();
    const otpExpiry = getOtpExpiry(10);

    student.otp = otp;
    student.otpExpiry = otpExpiry;
    await student.save();

    this.eventEmitter.emit('user.registered', new UserRegisteredEvent(student.email, student.name, otp));

    return { message: 'Verification code resent' };
  }
}