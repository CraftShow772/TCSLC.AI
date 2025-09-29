import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AnalyticsProvider } from "@/hooks/useAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TCSLC.AI",
    template: "%s · TCSLC.AI",
  },
  description:
    "AI-native redesign of tcslc.com with conversational workflows, compliance automation, and human-in-the-loop delivery.",
  metadataBase: new URL("https://tcslc.ai"),
  openGraph: {
    title: "TCSLC.AI",
    description:
      "AI-native redesign of tcslc.com with conversational workflows, compliance automation, and human-in-the-loop delivery.",
    url: "https://tcslc.ai",
    siteName: "TCSLC.AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TCSLC.AI",
    description:
      "AI-native redesign of tcslc.com with conversational workflows, compliance automation, and human-in-the-loop delivery.",
  },
  keywords: [
    "TCSLC",
    "AI",
    "Next.js",
    "compliance",
    "smart checklists",
    "locations",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <AnalyticsProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
