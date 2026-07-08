import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private mailerService: MailerService) {}

  async sendLoginNotification(email: string, name: string) {
    const loginTime = new Date().toLocaleString('en-US', {
      dateStyle: 'long',
      timeStyle: 'short',
    });

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '🔐 New Login to Your Student Portal',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">Login Notification</h2>
            <p>Hello ${name},</p>
            <p>A successful login to your Student Portal was detected.</p>
            <p><strong>Date:</strong> ${loginTime}</p>
            <p>If this wasn't you, please reset your password immediately.</p>
            <br>
            <p style="color: #6b7280; font-size: 12px;">Student Records — ESTAM University</p>
          </div>
        `,
      });
      this.logger.log(`Login notification sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send login email to ${email}:`, error.message);
    }
  }

  async sendWelcomeEmail(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '🎓 Welcome to Student Records',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">Welcome, ${name}!</h2>
            <p>Your Student Records account has been created successfully.</p>
            <p>You can now sign in and access your dashboard, courses, and grades.</p>
            <br>
            <p style="color: #6b7280; font-size: 12px;">Student Records — ESTAM University</p>
          </div>
        `,
      });
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error.message);
    }
  }

  async sendOtpEmail(email: string, name: string, otp: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '🔑 Verify Your Student Records Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">Verify Your Account</h2>
            <p>Hello ${name},</p>
            <p>Use the code below to verify your Student Records account:</p>
            <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e293b;">${otp}</span>
            </div>
            <p>This code expires in <strong>10 minutes</strong>.</p>
            <p>If you didn't create this account, please ignore this email.</p>
            <br>
            <p style="color: #6b7280; font-size: 12px;">Student Records — ESTAM University</p>
          </div>
        `,
      });
      this.logger.log(`OTP email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${email}:`, error.message);
    }
  }
}