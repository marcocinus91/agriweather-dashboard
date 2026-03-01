import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgriWeather Dashboard",
  description: "Dashboard meteo professionale per agricoltori",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={`${inter.className} dark:bg-slate-900`}>
        <SessionProvider>
          <QueryProvider>
            <Navbar />
            {children}
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
