// Interface for storing hashed password and its associated salt
export interface HashPassword {
    salt: string; // Unique cryptographic salt used for hashing
    hash: string; // Resulting hash of the password with salt
}

// Interface representing OTP-related data
export interface OtpDetails {
    otp: string; // One-time password value
    otpExpires: Date; // Expiration time for the OTP
    resendTimeLimit: number; // Optional field to limit how soon the OTP can be resent
}

// Interface used for verifying a password; extends the hashed password with raw input
export interface VerifyPasswordType extends HashPassword {
    password: string; // Raw password provided for verification
}

// Generic identifier used for OTP and authentication flows (email or phone)
export interface Identifier {
    identifier: string; // Can be an email address or a phone number
}

// Enum representing different use cases for sending an OTP
export type PurposeEnum = "REGISTER" | "LOGIN";

// Interface combining an identifier with the purpose of OTP
export interface Purpose {
    purpose: PurposeEnum; // Specifies whether the OTP is for REGISTER or LOGIN
}

// Structure for sending an OTP to a user
export interface SendOtpType extends Identifier {
    otp: string; // The OTP to send to the user
    name?: string; // Optional name of the user, useful for personalized messages
    purpose?: PurposeEnum; // Purpose of the OTP, e.g., REGISTER or LOGIN
}

// Structure for verifying an OTP; combines identifier, OTP, and purpose
export type VerifyOtpType = SendOtpType & Purpose;

// Type used to check if an action (like resend) is allowed under throttle rules
export type IsValidThrottleType = Identifier & Purpose;

// Structure for saving OTP details in the database or cache
export type SaveOtpType = Identifier & Purpose & {
    otpDetails: OtpDetails; // Contains OTP value, expiry, and resend limit
};
