import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";

import "@/styles/globals.css";

import { AssistantDrawer } from "@/components/assistant/assistant-drawer";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = Roboto_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "TCSLC.AI – Modern licensing assistance",
  description: "AI-native experience for renewals, transfers, and compliance at the Tallahassee Community Services Licensing Commission.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background antialiased", inter.variable, mono.variable)}>
        <SiteHeader />
        <main className="mx-auto min-h-[calc(100vh-200px)] max-w-6xl px-4 py-12">{children}</main>
        <SiteFooter />
        <AssistantDrawer />
      </body>
    </html>
  );
}
