import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "O·MO·I | Brunch · Matcha · Onigirazu — Stuttgart",
  description: "O·MO·I — Japanisch inspiriertes Brunch-Café in Stuttgart. Ceremonial Matcha, handgefertigte Onigirazu und Artisan Brunch. Jetzt Tisch reservieren.",
  keywords: "OMOI, Cafe, Matcha, Onigirazu, Brunch, Stuttgart, Reservierung",
  metadataBase: new URL("https://omoi.help"),
  openGraph: {
    title: "O·MO·I | Brunch · Matcha · Onigirazu — Stuttgart",
    description: "Gefühl, Gedanke, Sehnsucht und Liebe – alles zugleich. Ceremonial Matcha & Signature Onigirazu.",
    locale: "de_DE",
    siteName: "O·MO·I",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full antialiased">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="/images/omoi-avatar.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
