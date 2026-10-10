import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { ToastProvider } from "@/components/Toast";
import { I18nProvider } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PillWise - Medicine Interaction Checker",
  description: "Check if your medicines are safe to take together. Be wise before you take.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PillWise",
  },
  other: {
    "theme-color": "#020617",
  },
  icons: { icon: "/favicon.ico", apple: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-slate-950 text-white min-h-screen font-sans pb-16 md:pb-0">
        <I18nProvider>
          <ToastProvider>
            {children}
            <Suspense fallback={null}>
              <BottomNav />
            </Suspense>
          </ToastProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
