import type { Metadata } from "next";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "DisciplineOS — Personal Discipline Engine",
  description:
    "A personal accountability and discipline system for high-performance individuals. Track commitments, build habits, and reflect with clarity.",
  keywords: ["discipline", "accountability", "productivity", "habits", "self-improvement"],
  openGraph: {
    title: "DisciplineOS",
    description: "Your personal discipline control room.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#111214] text-[#E8E6E1] font-sans antialiased">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
