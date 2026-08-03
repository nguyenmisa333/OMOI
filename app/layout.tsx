import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "O·MO·I | Brunch · Matcha · Onigirazu — Stuttgart",
  description: "O·MO·I — Japanisch inspiriertes Brunch-Café in Stuttgart. Ceremonial Matcha, handgefertigte Onigirazu und Artisan Brunch. Jetzt Tisch reservieren.",
  keywords: "OMOI, Cafe, Matcha, Onigirazu, Brunch, Stuttgart, Reservierung",
  metadataBase: new URL("https://omoi.help"),
  // Manifest + icons qua metadata (KHÔNG hardcode trong <head>): segment con
  // app/(admin)/layout.tsx cần ghi đè `manifest` để iOS cài đúng app admin.
  // Hardcode trong <head> sẽ tạo 2 <link rel="manifest">, browser dùng cái đầu.
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "32x32" }],
    apple: "/images/icon-180.png",
  },
  // Next tự phát <meta name="mobile-web-app-capable"> từ appleWebApp.capable —
  // không khai thêm trong `other`, sẽ ra thẻ trùng.
  appleWebApp: { capable: true, statusBarStyle: "default", title: "O·MO·I" },
  openGraph: {
    title: "O·MO·I | Brunch · Matcha · Onigirazu — Stuttgart",
    description: "Gefühl, Gedanke, Sehnsucht und Liebe – alles zugleich. Ceremonial Matcha & Signature Onigirazu.",
    locale: "de_DE",
    siteName: "O·MO·I",
  },
};

export const viewport: Viewport = {
  themeColor: "#3b1f0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full antialiased">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js');}` }} />
        {/* #13 Analytics — replace G-XXXXXXXXXX with your GA4 ID */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-XXXXXXXXXX');` }} />
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
        {/* #5 SEO — JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              "name": "O·MO·I",
              "alternateName": "OMOI Café",
              "description": "Japanisch inspiriertes Brunch-Café in Stuttgart. Ceremonial Matcha, handgefertigte Onigirazu und Artisan Brunch.",
              "url": "https://o-mo-i.de",
              "telephone": "+49-176-76640277",
              "email": "hello@o-mo-i.de",
              "image": "https://o-mo-i.de/images/hero-website.jpg",
              "logo": "https://o-mo-i.de/images/omoi-logo.png",
              "priceRange": "€€",
              "servesCuisine": ["Japanese", "Brunch", "Café"],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Hauptstätter Straße 57",
                "addressLocality": "Stuttgart",
                "addressRegion": "Baden-Württemberg",
                "postalCode": "70178",
                "addressCountry": "DE"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 48.7684,
                "longitude": 9.1736
              },
              "openingHoursSpecification": [
                { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Tuesday", "Wednesday", "Thursday"], "opens": "12:00", "closes": "21:00" },
                { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Friday", "Saturday"], "opens": "12:00", "closes": "22:00" },
                { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "12:00", "closes": "20:00" }
              ],
              "sameAs": ["https://instagram.com/omoi.stuttgart"]
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
