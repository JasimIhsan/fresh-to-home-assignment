import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
   title: "Frisch nach Hause",
   description: "Ihre frische Fleischbestellung direkt nach Hause geliefert.",
   manifest: "/manifest.json",
   icons: {
      icon: [
         { url: "/favicon.ico", sizes: "any" },
         { url: "/favicon.svg", type: "image/svg+xml" },
         { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
         { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [
         { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
   },
   appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "FrischNachHause",
   },
   formatDetection: {
      telephone: false,
   },
};

export const viewport: Viewport = {
   themeColor: "#A315B9",
   width: "device-width",
   initialScale: 1,
   maximumScale: 1,
   userScalable: false,
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="de" className={cn("font-sans", geist.variable)}>
         <body className={`${inter.variable} font-sans antialiased`}>
            <LanguageProvider>
               <AuthProvider>
                  <CartProvider>{children}</CartProvider>
               </AuthProvider>
            </LanguageProvider>
         </body>
      </html>
   );
}
