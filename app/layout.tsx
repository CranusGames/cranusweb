import type { Metadata } from "next";
import "./globals.css";
import MusicPlayer from "@/components/MusicPlayer";

const BASE = "https://cranusgames.github.io/cranusweb";

export const metadata: Metadata = {
  metadataBase: new URL("https://cranusgames.github.io"),
  title: {
    default: "Cranus Games Studio",
    template: "%s · Cranus Games",
  },
  description:
    "Emirhan Aycibin — Indie oyun geliştiricisi. Horror, survival ve adventure türlerinde 30+ oyun. Cranus Games Studio.",
  keywords: ["indie game", "cranus games", "emirhan aycibin", "horror game", "unity", "itch.io", "game developer"],
  authors: [{ name: "Emirhan Aycibin", url: BASE }],
  creator: "Emirhan Aycibin",
  openGraph: {
    type: "website",
    url: BASE,
    siteName: "Cranus Games Studio",
    title: "Cranus Games Studio — Indie Oyun Geliştiricisi",
    description:
      "Karanlık dünyalar, derin hikayeler. 30+ oyun · 21 Game Jam · Cranus Games Studio.",
    images: [
      {
        url: `${BASE}/og.png`,
        width: 1200,
        height: 630,
        alt: "Cranus Games Studio",
      },
    ],
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cranus Games Studio — Indie Oyun Geliştiricisi",
    description:
      "Karanlık dünyalar, derin hikayeler. 30+ oyun · 21 Game Jam · Cranus Games Studio.",
    images: [`${BASE}/og.png`],
    creator: "@cranusgamess",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full">
      <body className="min-h-full flex flex-col">
        {children}
        <MusicPlayer />
      </body>
    </html>
  );
}
