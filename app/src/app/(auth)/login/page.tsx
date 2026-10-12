import { AuthFormFallback } from "@/components/auth/AuthFormFallback";
import { Suspense } from "react";
import { LoginForm } from "./(components)/LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthFormFallback />}>
      <LoginForm />
    </Suspense>
  );
}
