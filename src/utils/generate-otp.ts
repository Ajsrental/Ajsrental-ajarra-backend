import crypto from "crypto";

// Function to generate a 6-digit OTP
export function generateOTP(): number {
    return crypto.randomInt(100000, 999999);
}

// Function to calculate the expiry timestamp for the OTP (duration in minutes)
export function getOTPExpiry(durationMinutes: number): Date {
    return new Date(Date.now() + durationMinutes * 60 * 1000);
}