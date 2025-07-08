import crypto from "crypto";

// Function to generate a 4-digit OTP
export function generateOTP(): number {
    return crypto.randomInt(1000, 10000); // 1000 to 9999 inclusive
}

// Function to calculate the expiry timestamp for the OTP (duration in minutes)
export function getOTPExpiry(durationMinutes: number): Date {
    return new Date(Date.now() + durationMinutes * 60 * 1000);
}