import { ResetPasswordForm } from "./(components)/ResetPasswordForm";

// Landing page for Supabase password recovery links. Lives outside the
// (auth) group because the recovery link signs the user in, and the proxy
// redirects signed-in users away from the guest-only auth routes.
export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
