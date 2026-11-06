import type { Metadata, Viewport } from "next";
import RootHtml from "@/components/RootHtml";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hayaku Lab · Automatización con IA para pymes",
    template: "%s | Hayaku Lab",
  },
  description:
    "Automatizamos los procesos manuales de tu empresa con IA: pedidos por QR, portales de pedidos B2B, integraciones con tu ERP, chatbots, enriquecimiento de datos y reportes automáticos. Diagnóstico gratuito.",
  openGraph: {
    type: "website",
    locale: "es_CO",
    alternateLocale: ["en_US"],
    siteName: "Hayaku Lab",
    title: "Hayaku Lab · Automatización con IA para pymes",
    description: "Procesos que funcionan solos, más rápido. Prueba nuestras demos en vivo.",
  },
};

export const viewport: Viewport = { themeColor: "#150E48" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootHtml lang="es">{children}</RootHtml>;
}
