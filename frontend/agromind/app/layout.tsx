import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Providers from "./provider";

// Fonts


// Metadata
export const metadata: Metadata = {
  title: "AgroMind - Smart Garden Management",
  description:
    "AI-powered plant care, disease detection, and smart recommendations for your garden",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-background">
      <body
        className={`antialiased bg-background`}
      >
        <Providers>
          {children}
        </Providers>

        {/* ✅ Analytics only in production */}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}