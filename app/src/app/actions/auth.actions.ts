"use server";

import { fail, ok, type ActionResult } from "@/lib/action-result";
import {
  resendOtpSchema,
  signupSchema,
  verifyOtpSchema,
  type SignupInput,
  type VerifyOtpInput,
} from "@/lib/schemas/auth.schema";
import { createSessionClient } from "@/lib/supabase/server";
import { logAuthIssue, normalizeAuthError } from "@/services/auth/auth-errors";
import type { AuthErrorCode } from "@/services/auth/auth.types";
import { revalidatePath } from "next/cache";

function authFail<T>(context: string, err: unknown): ActionResult<T> {
  const error = normalizeAuthError(err);
  logAuthIssue(context, error);
  return fail(error.code);
}

/** Auth actions fail with an `AuthErrorCode` so the client can translate it. */
function failWith<T>(code: AuthErrorCode): ActionResult<T> {
  return fail(code);
}

/**
 * Step 1 of sign up: creates the auth user and emails a one-time code. The
 * `profiles` row (role "customer") is provisioned by a database trigger from
 * the `full_name` stored in user_metadata.
 */
export async function signUp(
  input: SignupInput
): Promise<ActionResult<{ email: string; needsVerification: boolean }>> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) return failWith("validation_failed");

  const { fullName, email, password } = parsed.data;
  try {
    const supabase = await createSessionClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return authFail("signUp", error);

    // With "Confirm email" enabled, an already-confirmed address returns an
    // obfuscated user with no identities instead of an error.
    if (data.user && data.user.identities?.length === 0) {
      return failWith("user_already_exists");
    }

    // A session is only issued here when email confirmation is disabled.
    if (data.session) revalidatePath("/", "layout");
    return ok({ email, needsVerification: !data.session });
  } catch (err) {
    return authFail("signUp", err);
  }
}

/** Step 2 of sign up: confirms the emailed code and signs the user in. */
export async function verifySignupOtp(
  input: VerifyOtpInput
): Promise<ActionResult<null>> {
  const parsed = verifyOtpSchema.safeParse(input);
  if (!parsed.success) return failWith("invalid_otp");

  try {
    const supabase = await createSessionClient();
    const { error } = await supabase.auth.verifyOtp({
      email: parsed.data.email,
      token: parsed.data.token,
      type: "email",
    });
    if (error) return authFail("verifySignupOtp", error);

    revalidatePath("/", "layout");
    return ok(null);
  } catch (err) {
    return authFail("verifySignupOtp", err);
  }
}

export async function resendSignupOtp(input: {
  email: string;
}): Promise<ActionResult<null>> {
  const parsed = resendOtpSchema.safeParse(input);
  if (!parsed.success) return failWith("invalid_email");

  try {
    const supabase = await createSessionClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: parsed.data.email,
    });
    if (error) return authFail("resendSignupOtp", error);
    return ok(null);
  } catch (err) {
    return authFail("resendSignupOtp", err);
  }
}
