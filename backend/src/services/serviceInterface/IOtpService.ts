export interface IOTPService {
  generateOTP(length?: number): string;
}