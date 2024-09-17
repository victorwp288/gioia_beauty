import { Cookie, Inter } from "next/font/google";
import "./globals.css";
import { Bricolage_Grotesque, DM_Serif_Display } from "next/font/google";
import "@/styles/tailwind.css";
import ConditionalLayout from "@/components/ConditionalLayout"; // Adjust the import path as necessary
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: "%s - Gioia Beauty",
    default: "Gioia Beauty",
  },
  description:
    "Scopri Gioia Beauty, il nuovo centro estetico a Roveleto di Cadeo",
  openGraph: {
    title: "Scopri Gioia Beauty - Il Tuo Centro Estetico di Fiducia",
    description:
      "Gioia Beauty offre servizi estetici di alta qualità a Roveleto di Cadeo. Prenota oggi per un'esperienza di trattamento personalizzato",
    url: "https://www.gioiabeauty.net/",
    images: [
      {
        url: "https://www.gioiabeauty.net/ogimage.png",
        width: 1200,
        height: 630,
        alt: "An example OG image",
      },
    ],
    siteName: "Gioia Beauty",
    locale: "it_IT",
    type: "website",
  },
};

export const bricolage = Bricolage_Grotesque({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: "normal",
  display: "swap",
  subsets: ["latin"],
  variable: "--bricolage",
});

export const dmSerif = DM_Serif_Display({
  weight: ["400"],
  style: "normal",
  display: "swap",
  subsets: ["latin"],
  variable: "--serif",
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${dmSerif.variable} font-bricolage h-full scroll-smooth antialiased`}
    >
      <head>
        <meta name="msvalidate.01" content="80C0DA0047C69C3845952ED707A5C88C" />
      </head>

      <body className="bg-white flex h-full flex-col">
        <ConditionalLayout>{children}</ConditionalLayout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
