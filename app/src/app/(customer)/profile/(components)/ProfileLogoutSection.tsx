"use client";

import { ProfileLogoutButton } from "@/components/profile/ProfileLogoutButton";
import { LogoutConfirmModal } from "@/components/ui/LogoutConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

/** Logout button plus confirmation sheet — the only interactive part of the profile. */
export function ProfileLogoutSection() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  return (
    <>
      <ProfileLogoutButton
        onLogout={() => setShowLogoutModal(true)}
        loading={loggingOut}
      />
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        loading={loggingOut}
      />
    </>
  );
}
