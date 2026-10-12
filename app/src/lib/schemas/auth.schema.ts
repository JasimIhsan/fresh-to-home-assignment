import {
  MIN_NAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  OTP_LENGTH,
} from "@/services/validation";
import { z } from "zod";

const emailSchema = z.string().trim().toLowerCase().max(254).pipe(z.email());

export const signupSchema = z.object({
  fullName: z.string().trim().min(MIN_NAME_LENGTH).max(120),
  email: emailSchema,
  password: z.string().min(MIN_PASSWORD_LENGTH).max(128),
  consent: z.boolean().refine((value) => value, "consent_required"),
});

export const verifyOtpSchema = z.object({
  email: emailSchema,
  token: z.string().regex(new RegExp(`^\\d{${OTP_LENGTH}}$`)),
});

export const resendOtpSchema = z.object({ email: emailSchema });

export type SignupInput = z.input<typeof signupSchema>;
export type VerifyOtpInput = z.input<typeof verifyOtpSchema>;
