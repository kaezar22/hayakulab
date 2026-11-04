import type { Metadata, Viewport } from "next";
import "@fontsource/sora/400.css";
import "@fontsource/sora/600.css";
import "@fontsource/sora/700.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hayaku Lab · Automatización con IA para pymes",
    template: "%s | Hayaku Lab",
  },
  description:
    "Automatizamos los procesos manuales de tu empresa con IA: pedidos por QR, portales de pedidos B2B, integraciones con tu ERP, chatbots y reportes automáticos. Diagnóstico gratuito.",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: SITE_URL,
    siteName: "Hayaku Lab",
    title: "Hayaku Lab · Automatización con IA para pymes",
    description: "Procesos que funcionan solos, más rápido. Prueba nuestras demos en vivo.",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#150E48",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
