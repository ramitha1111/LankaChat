import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "LankaChat | Real-Time Chat for Sri Lanka",
  description: "Join Sri Lanka''s favourite free real-time chat platform. No login required. Jump into public rooms or send private messages instantly.",
  keywords: "sri lanka chat, free chat, online chat, lankachat",
  openGraph: {
    title: "LankaChat",
    description: "Real-time chat for everyone in Sri Lanka",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
