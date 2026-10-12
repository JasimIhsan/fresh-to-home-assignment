import { AuthFormFallback } from "../(components)/AuthFormFallback";
import { safeRedirectPath } from "../(components)/safe-redirect";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { OtpForm } from "./(components)/OtpForm";

interface OtpPageProps {
  readonly searchParams: Promise<{
    readonly email?: string | string[];
    readonly redirect?: string | string[];
  }>;
}

/** Guards against repeated params (`?email=a&email=b`) and oversized input. */
function firstParam(value: string | string[] | undefined, max: number): string {
  const first = Array.isArray(value) ? value[0] : value;
  return (first ?? "").trim().slice(0, max);
}

export default function OtpVerificationPage({ searchParams }: OtpPageProps) {
  return (
    <Suspense fallback={<AuthFormFallback />}>
      <OtpVerification searchParams={searchParams} />
    </Suspense>
  );
}

async function OtpVerification({ searchParams }: OtpPageProps) {
  const params = await searchParams;
  const email = firstParam(params.email, 254);
  // The code is tied to an email address; without one, start over
  if (!email) redirect("/signup");

  const redirectTo = safeRedirectPath(firstParam(params.redirect, 512), "");
  return <OtpForm email={email} redirectTo={redirectTo || "/catalog"} />;
}
