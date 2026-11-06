import type { Metadata, Viewport } from "next";
import RootHtml from "@/components/RootHtml";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hayaku Lab · AI automation for small and mid-sized businesses",
    template: "%s | Hayaku Lab",
  },
  description:
    "We automate your company's manual processes with AI: QR ordering, B2B ordering portals, ERP integrations, chatbots, data enrichment and automated reports. Free assessment.",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["es_CO"],
    siteName: "Hayaku Lab",
    title: "Hayaku Lab · AI automation for small and mid-sized businesses",
    description: "Processes that run themselves, faster. Try our live demos.",
  },
};

export const viewport: Viewport = { themeColor: "#150E48" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootHtml lang="en">{children}</RootHtml>;
}
