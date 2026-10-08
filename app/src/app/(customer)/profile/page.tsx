"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getStoredOrders } from "@/lib/store";
import { ArrowLeft, ExternalLink, FileText, LogOut, Mail, Package, RotateCcw, Shield, ShoppingCart, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
   const { t } = useLanguage();
   const { user, userName, role, isAdmin, toggleRole, signOut } = useAuth();
   const router = useRouter();
   const [loggingOut, setLoggingOut] = useState(false);
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
         router.push("/");
      } finally {
         setLoggingOut(false);
      }
   };

   return (
      <AuthGuard requireAuth>
         <div className="min-h-screen bg-background md:bg-gray-50 pb-16">
            {/* Mobile Header */}
            <header className="bg-primary text-white p-6 rounded-b-3xl shadow-lg sticky top-0 z-40 md:hidden">
               <div className="flex justify-between items-center max-w-4xl mx-auto">
                  <Link href="/catalog" className="p-2 hover:bg-white/20 rounded-full transition-colors flex items-center cursor-pointer">
                     <ArrowLeft size={22} />
                  </Link>
                  <h1 className="text-xl font-bold">{t("catalog.profile")}</h1>
                  <LanguageSwitcher />
               </div>
            </header>

            <main className="p-6 md:p-10 max-w-6xl mx-auto space-y-6 md:space-y-0 mt-4 md:grid md:grid-cols-12 md:gap-8 lg:gap-12 items-start">
               {user && (
                  <>
                     {/* Left Column: Profile Card & Stats */}
                     <div className="md:col-span-5 lg:col-span-4 space-y-6 md:space-y-8">
                        {/* Rich User Info Card */}
                        <div className="bg-linear-to-br from-primary to-purple-800 p-8 rounded-[2.5rem] shadow-xl shadow-primary/20 border border-purple-700/50 flex flex-col items-center text-center text-white relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                           <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>

                           <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-5 shadow-inner border border-white/30 relative z-10">
                              <UserIcon size={48} className="text-white drop-shadow-md" />
                           </div>

                           <h2 className="text-2xl font-black text-white relative z-10 tracking-tight">{userName || user.email?.split("@")[0] || t("profile.customer")}</h2>
                           <p className="text-purple-100 text-sm flex items-center gap-1.5 mt-1.5 relative z-10 font-medium">
                              <Mail size={14} className="opacity-80" /> {user.email}
                           </p>

                           <div className="mt-8 flex flex-col items-center gap-3 w-full relative z-10">
                              <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 tracking-wide">
                                 {t("profile.customer")}
                              </span>
                           </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4">
                           <Link href="/orders" className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-lg hover:-translate-y-1 transition-all group">
                              <div className="w-14 h-14 bg-purple-50 group-hover:bg-primary/10 rounded-2xl flex items-center justify-center mb-3 transition-colors">
                                 <Package size={26} className="text-primary" />
                              </div>
                              <span className="text-3xl font-black text-gray-900 tracking-tight">{orderCount}</span>
                              <span className="text-sm font-bold text-gray-500 mt-1">{t("orders.title")}</span>
                           </Link>

                           <Link href="/cart" className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-lg hover:-translate-y-1 transition-all group">
                              <div className="w-14 h-14 bg-purple-50 group-hover:bg-primary/10 rounded-2xl flex items-center justify-center mb-3 transition-colors">
                                 <ShoppingCart size={26} className="text-primary" />
                              </div>
                              <span className="text-xl font-black text-gray-900 tracking-tight pt-1.5">{t("profile.cart")}</span>
                              <span className="text-sm font-bold text-gray-500 mt-1">{t("profile.toCheckout")}</span>
                           </Link>
                        </div>
                     </div>

                     {/* Right Column: Actions & Settings */}
                     <div className="md:col-span-7 lg:col-span-8 space-y-6">
                        {/* Desktop Welcome text (hidden on mobile) */}
                        <div className="hidden md:block mb-8">
                           <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t("profile.overviewTitle")}</h2>
                           <p className="text-gray-500 mt-1 text-lg">{t("profile.overviewDesc")}</p>
                        </div>

                        {/* Action Links List */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                           <Link href="/orders" className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors group">
                              <div className="flex items-center gap-4 text-gray-800 font-bold text-base">
                                 <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                                    <Package size={22} className="text-gray-500 group-hover:text-primary transition-colors" />
                                 </div>
                                 <span>{t("orders.title")}</span>
                              </div>
                              <span className="text-gray-300 group-hover:text-primary transition-colors mr-2">›</span>
                           </Link>

                           <Link href="/catalog" className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors group">
                              <div className="flex items-center gap-4 text-gray-800 font-bold text-base">
                                 <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                                    <ShoppingCart size={22} className="text-gray-500 group-hover:text-primary transition-colors" />
                                 </div>
                                 <span>{t("catalog.products")}</span>
                              </div>
                              <span className="text-gray-300 group-hover:text-primary transition-colors mr-2">›</span>
                           </Link>

                           <Link href="/privacy" className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors group">
                              <div className="flex items-center gap-4 text-gray-800 font-bold text-base">
                                 <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                                    <FileText size={22} className="text-gray-500 group-hover:text-primary transition-colors" />
                                 </div>
                                 <span>{t("signup.privacyPolicy")}</span>
                              </div>
                              <span className="text-gray-300 group-hover:text-primary transition-colors mr-2">›</span>
                           </Link>

                           {isAdmin && (
                              <Link href="/admin" className="flex items-center justify-between p-5 bg-purple-50/50 hover:bg-purple-100/70 text-primary transition-colors group">
                                 <div className="flex items-center gap-4 font-black text-base">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                       <Shield size={22} className="text-primary" />
                                    </div>
                                    <span>{t("catalog.adminDashboard")}</span>
                                 </div>
                                 <ExternalLink size={20} className="text-primary/70 group-hover:text-primary transition-colors mr-2" />
                              </Link>
                           )}
                        </div>

                        {/* Logout Button */}
                        <button onClick={handleLogout} disabled={loggingOut} className="w-full bg-white border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 py-5 rounded-[2rem] font-black text-base transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 shadow-sm mt-4">
                           {loggingOut ? (
                              <div className="w-6 h-6 border-[3px] border-red-600 border-t-transparent rounded-full animate-spin" />
                           ) : (
                              <>
                                 <LogOut size={22} />
                                 <span>{t("catalog.logout")}</span>
                              </>
                           )}
                        </button>
                     </div>
                  </>
               )}
            </main>
         </div>
      </AuthGuard>
   );
}
