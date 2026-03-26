import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cranus Games",
  description: "Cranus Games — Indie oyunlar, karanlık dünyalar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
