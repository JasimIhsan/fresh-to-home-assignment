import { AuthFormFallback } from "@/components/auth/AuthFormFallback";
import { Suspense } from "react";
import { SignupForm } from "./(components)/SignupForm";

export default function SignupPage() {
  return (
    <Suspense fallback={<AuthFormFallback />}>
      <SignupForm />
    </Suspense>
  );
}
