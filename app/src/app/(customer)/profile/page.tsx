import { ProfileHeader } from "./(components)/ProfileHeader";
import { ProfileIdentityCard } from "./(components)/ProfileIdentityCard";
import { ProfileLanguageFeature } from "./(components)/ProfileLanguageFeature";
import { ProfileQuickActions } from "./(components)/ProfileQuickActions";
import { ProfileSecuritySection } from "./(components)/ProfileSecuritySection";
import { ProfileStats } from "./(components)/ProfileStats";
import { requireUser } from "@/lib/dal/auth.dal";
import { getMyOrders } from "@/lib/dal/order.dal";
import { Suspense } from "react";
import { ProfileLogoutSection } from "./(components)/ProfileLogoutSection";

export default function ProfilePage() {
  return (
    <div className="via-background to-background min-h-screen bg-linear-to-b from-purple-50/40 pb-20">
      <ProfileHeader />

      <main className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 sm:pt-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Identity & Metric Cards (session-dependent) */}
          <div className="space-y-5 lg:col-span-5">
            <Suspense fallback={<ProfileIdentitySkeleton />}>
              <ProfileIdentity />
            </Suspense>
          </div>

          {/* Right Column: Language, Navigation Groups & Logout Action */}
          <div className="space-y-5 lg:col-span-7">
            <ProfileLanguageFeature />
            <Suspense fallback={<ProfileActionsSkeleton />}>
              <ProfileActions />
            </Suspense>
            <ProfileLogoutSection />
          </div>
        </div>
      </main>
    </div>
  );
}

async function ProfileIdentity() {
  const [user, orders] = await Promise.all([
    requireUser("/profile"),
    getMyOrders(),
  ]);

  return (
    <>
      <ProfileIdentityCard displayName={user.name} email={user.email} />
      <ProfileStats orderCount={orders.length} />
    </>
  );
}

async function ProfileActions() {
  const [user, orders] = await Promise.all([
    requireUser("/profile"),
    getMyOrders(),
  ]);

  return (
    <>
      <ProfileQuickActions orderCount={orders.length} />
      <ProfileSecuritySection isAdmin={user.role === "admin"} />
    </>
  );
}

function ProfileIdentitySkeleton() {
  return (
    <div aria-busy="true" className="space-y-5">
      <div className="h-64 animate-pulse rounded-3xl border border-gray-100 bg-white" />
      <div className="grid grid-cols-2 gap-3.5">
        <div className="h-36 animate-pulse rounded-3xl border border-gray-100 bg-white" />
        <div className="h-36 animate-pulse rounded-3xl border border-gray-100 bg-white" />
      </div>
    </div>
  );
}

function ProfileActionsSkeleton() {
  return (
    <div aria-busy="true" className="space-y-5">
      <div className="h-48 animate-pulse rounded-3xl border border-gray-100 bg-white" />
      <div className="h-32 animate-pulse rounded-3xl border border-gray-100 bg-white" />
    </div>
  );
}
