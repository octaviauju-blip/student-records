export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOtpExpiry(minutes: number = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}