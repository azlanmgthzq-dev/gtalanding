import type { Metadata } from "next";
import { Barlow, Space_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "./components/navigation/TopNav";
import Hero from "./components/sections/Hero";

const barlow = Barlow({
  variable: "--font-barlow",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono-alt",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Global Turbine Asia | Defense-Grade Aerospace MRO",
  description:
    "Global Turbine Asia delivers depot-level and on-wing engine MRO for military and civil fleets across Asia Pacific.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${barlow.variable} ${spaceMono.variable} antialiased bg-navy-950 text-slate-50`}
      >
        <TopNav />
        
        {children}
      </body>
    </html>
  );
}
