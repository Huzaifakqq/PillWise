import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { ToastProvider } from "@/components/Toast";
import { I18nProvider } from "@/lib/i18n";
import { registerServiceWorker } from "@/lib/offline";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

if (typeof window !== "undefined") registerServiceWorker();

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

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased bg-slate-950 text-white min-h-screen font-sans pb-16 md:pb-0">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:shadow-lg"
        >
          Skip to main content
        </a>
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
