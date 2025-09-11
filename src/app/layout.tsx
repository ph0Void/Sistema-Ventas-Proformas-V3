import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SonnerToast from "@/components/ui/SonnerToast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SISTEMA DE VENTAS - PROFORMAS ",
  description: "SISTEMA DE VENTAS - PROFORMAS CON SPRING BOOT, NEXTJS, TAILWINDCSS Y POSTGRESQL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SonnerToast/>
      </body>
    </html>
  );
}
