import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { AdminLoginForm } from "./(components)/AdminLoginForm";
import { AdminLoginScreen } from "./(components)/AdminLoginScreen";

export default function AdminLoginPage() {
  return (
    <AdminLoginScreen footerYear={<CopyrightYear />}>
      {/* useSearchParams (redirect target) needs a Suspense boundary. */}
      <Suspense
        fallback={
          <div className="h-56 animate-pulse rounded-xl bg-slate-100" />
        }
      >
        <AdminLoginForm />
      </Suspense>
    </AdminLoginScreen>
  );
}

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
