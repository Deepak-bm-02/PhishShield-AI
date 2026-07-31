import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { ToastProvider } from "@/providers";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "PhishShield AI",
  description: "AI-Powered Security Operations Center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased text-foreground bg-background transition-colors duration-200`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
