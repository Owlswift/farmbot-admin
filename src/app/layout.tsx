// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Onefarm Admin Dashboard",
  description: "Admin panel for WhatsApp farm produce ordering bot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 py-8">
                <div className="px-4 sm:px-6 lg:px-8">{children}</div>
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
