"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { CustomerOrderCard } from "@/components/orders/CustomerOrderCard";
import { CustomerOrdersEmpty } from "@/components/orders/CustomerOrdersEmpty";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getStoredOrders } from "@/lib/store";
import { Order } from "@/types";
import { useEffect, useMemo, useState } from "react";

export default function OrdersPage() {
   const { t } = useLanguage();
   const { user } = useAuth();
   const [orders, setOrders] = useState<Order[]>([]);
   const [selectedStatus, setSelectedStatus] = useState<string>("all");

   useEffect(() => {
      if (user) {
         setOrders(getStoredOrders(user.uid));
      }
   }, [user]);

   const filteredOrders = useMemo(() => {
      if (selectedStatus === "all") return orders;
      return orders.filter((o) => o.status === selectedStatus);
   }, [orders, selectedStatus]);

   return (
      <AuthGuard requireAuth>
         <div className="min-h-screen bg-background pb-20">
            <header className="bg-primary md:bg-transparent text-white md:text-gray-900 p-6 md:px-8 md:pt-8 md:pb-4 rounded-b-3xl md:rounded-none shadow-lg md:shadow-none sticky md:static top-0 z-40">
               <div className="flex justify-center md:justify-start items-center max-w-6xl mx-auto">
                  <h1 className="text-xl md:text-3xl font-extrabold text-center md:text-left">{t("orders.title")}</h1>
               </div>

               {/* Status Filters */}
               <div className="flex gap-2 overflow-x-auto pb-1 pt-4 md:pt-6 max-w-6xl mx-auto no-scrollbar">
                  {["all", "pending", "processing", "shipped", "delivered"].map((status) => (
                     <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                           selectedStatus === status
                              ? "bg-white md:bg-gray-900 text-primary md:text-white shadow-sm"
                              : "bg-white/15 md:bg-white md:border md:border-gray-200 text-white md:text-gray-600 hover:bg-white/25 md:hover:bg-gray-50"
                        }`}
                     >
                        {status === "all" ? "Alle" : status.charAt(0).toUpperCase() + status.slice(1)}
                     </button>
                  ))}
               </div>
            </header>

            <main className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto mt-2 md:mt-4">
               {filteredOrders.length === 0 ? (
                  <CustomerOrdersEmpty />
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                     {filteredOrders.map((order) => (
                        <CustomerOrderCard key={order.id} order={order} />
                     ))}
                  </div>
               )}
            </main>
         </div>
      </AuthGuard>
   );
}
