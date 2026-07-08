import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../email/email.service';

export class UserRegisteredEvent {
  constructor(
    public readonly email: string,
    public readonly name: string,
    public readonly otp: string,
  ) {}
}

@Injectable()
export class RegistrationListener {
  constructor(private emailService: EmailService) {}

  @OnEvent('user.registered')
  handleUserRegisteredEvent(event: UserRegisteredEvent) {
    this.emailService.sendOtpEmail(event.email, event.name, event.otp);
  }
}