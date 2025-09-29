import type { Metadata } from "next";
import { AssistantButton } from "../components/assistant/AssistantButton";

export const metadata: Metadata = {
  title: "TCSLC.AI",
  description: "AI-native experience for the Treasure Coast Service & Leadership Collaborative",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-slate-50">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        <div className="relative flex min-h-screen flex-col">
          {children}
        </div>
        <AssistantButton />
      </body>
    </html>
  );
}
