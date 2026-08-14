import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import PixelRouteTracker from "./pixel-route-tracker";
import { SITE_URL } from "@/lib/seo";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Moto Moto Paulínia — Motos Seminovas em Paulínia, SP",
    template: "%s | Moto Moto Paulínia",
  },
  description:
    "Motos seminovas com garantia em Paulínia, SP. Honda, Yamaha, Triumph e mais. Financiamento aprovado na hora.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Moto Moto Paulínia",
    title: "Moto Moto Paulínia — Motos Seminovas em Paulínia, SP",
    description:
      "Motos seminovas com garantia em Paulínia, SP. Honda, Yamaha, Triumph e mais. Financiamento aprovado na hora.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moto Moto Paulínia — Motos Seminovas em Paulínia, SP",
    description:
      "Motos seminovas com garantia em Paulínia, SP. Honda, Yamaha, Triumph e mais. Financiamento aprovado na hora.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${barlowCondensed.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-black text-white">
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1065855959347773');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1065855959347773&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}

        {/* Dispara PageView e ViewContent automaticamente a cada troca de página */}
        <PixelRouteTracker />

        {children}
      </body>
    </html>
  );
}
