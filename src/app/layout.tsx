import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beef Arena - Celebrity AI Fight Generator",
  description: "Generate hilarious cartoon-style fight posters featuring your favorite celebrities. Pick fighters, choose battle styles, and get epic meme-worthy content with AI!",
  keywords: "AI fight generator, celebrity memes, cartoon fights, meme generator, AI art, celebrity battles",
  authors: [{ name: "Beef Arena" }],
  openGraph: {
    title: "Beef Arena - Celebrity AI Fight Generator",
    description: "Generate hilarious cartoon-style fight posters featuring your favorite celebrities!",
    type: "website",
    url: "https://29-beef-arena.paarad.org",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beef Arena - Celebrity AI Fight Generator",
    description: "Generate hilarious cartoon-style fight posters featuring your favorite celebrities!",
  }
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
        <Analytics />
      </body>
    </html>
  );
}
