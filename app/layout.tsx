import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./_components/sidebar";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Gestock",
  description: "Gestão simples de produtos, estoque e vendas.",
};

const inter = Inter({
  subsets: ["latin"],
  display: "auto",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased`}>
        <div className="flex h-full">
          <Sidebar />
          {children}
        </div>

        <Toaster />
      </body>
    </html>
  );
}
