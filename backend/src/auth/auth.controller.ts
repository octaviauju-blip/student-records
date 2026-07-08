import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: any) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: any) {
    return await this.authService.login(loginDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyDto: any) {
    return await this.authService.verifyOtp(verifyDto);
  }

  @Post('resend-otp')
  async resendOtp(@Body() resendDto: any) {
    return await this.authService.resendOtp(resendDto);
  }
}