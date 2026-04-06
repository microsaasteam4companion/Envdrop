import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import UpvoteWidget from "@/components/UpvoteWidget";
import Footer from "@/components/Footer";
import JsonLd from "@/components/SEO/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "envdrop | Secure Secret & .env Sharing for Modern Teams",
  description: "Encrypt and share your environment variables with AES-256-GCM zero-knowledge security. The ultimate tool for VS Code and CLI developers.",
  alternates: {
    canonical: "https://envdrop.entrext.com",
  },
  openGraph: {
    title: "envdrop | Secure .env Sharing",
    description: "Zero-knowledge security for your development secrets.",
    url: "https://envdrop.entrext.com",
    type: "website",
    images: [{ url: "/og-image.png" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "envdrop | Secure .env Sharing",
    description: "Stop sharing secrets in plain text. Use envdrop.",
    images: ["/og-image.png"],
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`} style={{ backgroundColor: 'var(--background)' }}>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "envdrop",
            "operatingSystem": "All",
            "applicationCategory": "DeveloperApplication",
            "description": "Secure secret and .env sharing for modern development teams. Zero-knowledge encryption with AES-256-GCM.",
            "offers": {
              "@type": "Offer",
              "price": "5.00",
              "priceCurrency": "USD"
            },
            "author": {
              "@type": "Organization",
              "name": "Entrext Engineering",
              "url": "https://envdrop.entrext.com"
            }
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            {children}
            <UpvoteWidget />
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
