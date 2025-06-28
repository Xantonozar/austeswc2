import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const exoItalic = localFont({
  src: "./fonts/YesevaOne-Regular.ttf",
  variable: "--font-exo-italic",
});

export const metadata = {
  title: {
    default: 'AUSTESWC || Save People ,Save Environment , Save The Society',
    template: '%s | AUSTESWC ',
  },
  description: 'Save People ,Save Environment , Save The Society',
  icons: {
    icon: [
      { url: '/eswclogo.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/eswclogo.svg',
    apple: '/eswclogo.svg'
  },
  openGraph: {
    title: 'AUSTESWC ||Save People ,Save Environment , Save The Society ',
    description: '',
    url: 'https://austeswc.org',
    siteName: 'AUSTESWC',
    images: [
      {
        url: 'https://austeswc.org/eswclogo.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AUSTESWC',
    description: 'Save People ,Save Environment , Save The Society',
    images: ['https://austeswc.org/eswclogo.png'],
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <head>
    <link rel="icon" href="/eswclogo.png" sizes="any" />
  </head>
      <body className={exoItalic.variable}>
        <Navbar />
        {children}

        {/* Vercel Speed Insights (renders a performance badge) */}
        <SpeedInsights />

        {/* Vercel Web Analytics snippet */}
        <Analytics />
      </body>
    </html>
  );
}