import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";

import "lenis/dist/lenis.css";
import "./globals.css";

import { DegradationProvider } from "@/providers/DegradationProvider";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";

import { CustomCursor } from "@/components/cursor/CustomCursor";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { BezteqChatbot } from "@/components/ui/BezteqChatbot";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "BEZTEQ",
  description:
    "Software house in Dubai engineering custom web, software and growth systems for the GCC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} h-full`}>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600&f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="min-h-full">
        <DegradationProvider>
          <SmoothScrollProvider>
            <CustomCursor />

            <Header />

            <PageTransition>{children}</PageTransition>

            <Footer />
          </SmoothScrollProvider>
        </DegradationProvider>

        <BezteqChatbot />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
