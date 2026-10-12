/** Static placeholder shown while an auth form reads its search params. */
export function AuthFormFallback() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
  );
}
