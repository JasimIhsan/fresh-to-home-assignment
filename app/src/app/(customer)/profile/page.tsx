"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileIdentityCard } from "@/components/profile/ProfileIdentityCard";
import { ProfileLanguageFeature } from "@/components/profile/ProfileLanguageFeature";
import { ProfileLogoutButton } from "@/components/profile/ProfileLogoutButton";
import { ProfileQuickActions } from "@/components/profile/ProfileQuickActions";
import { ProfileSecuritySection } from "@/components/profile/ProfileSecuritySection";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { LogoutConfirmModal } from "@/components/ui/LogoutConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getStoredOrders } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
   const { t } = useLanguage();
   const { user, userName, isAdmin, signOut } = useAuth();
   const router = useRouter();
   const [loggingOut, setLoggingOut] = useState(false);
   const [showLogoutModal, setShowLogoutModal] = useState(false);
   const [orderCount, setOrderCount] = useState(0);

   useEffect(() => {
      if (user) {
         const orders = getStoredOrders(user.uid);
         setOrderCount(orders.length);
      }
   }, [user]);

   const handleLogout = async () => {
      setLoggingOut(true);
      try {
         await signOut();
         setShowLogoutModal(false);
         router.push("/");
      } finally {
         setLoggingOut(false);
      }
   };

   const displayName = userName || user?.email?.split("@")[0] || t("profile.customer");

   return (
      <AuthGuard requireAuth>
         <div className="min-h-screen bg-gradient-to-b from-purple-50/40 via-background to-background pb-20">
            {/* Header with mobile & desktop navigation */}
            <ProfileHeader />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
               {user && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                     {/* Left Column: Identity & Metric Cards */}
                     <div className="lg:col-span-5 space-y-5">
                        <ProfileIdentityCard displayName={displayName} email={user.email} />
                        <ProfileStats orderCount={orderCount} />
                     </div>

                     {/* Right Column: Language, Navigation Groups & Logout Action */}
                     <div className="lg:col-span-7 space-y-5">
                        <ProfileLanguageFeature />
                        <ProfileQuickActions orderCount={orderCount} />
                        <ProfileSecuritySection isAdmin={isAdmin} />
                        <ProfileLogoutButton onLogout={() => setShowLogoutModal(true)} loading={loggingOut} />
                     </div>
                  </div>
               )}
            </main>

            {/* Responsive Logout Confirmation: Bottom Sheet on Mobile, Modal on Desktop */}
            <LogoutConfirmModal
               isOpen={showLogoutModal}
               onClose={() => setShowLogoutModal(false)}
               onConfirm={handleLogout}
               loading={loggingOut}
            />
         </div>
      </AuthGuard>
   );
}
