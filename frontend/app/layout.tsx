import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PillWise - Medicine Interaction Checker",
  description: "Check if your medicines are safe to take together. Be wise before you take.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
