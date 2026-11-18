import type { Metadata, Viewport } from "next";
import RootHtml from "@/components/RootHtml";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hayaku Lab · 面向中小企业的 AI 自动化",
    template: "%s | Hayaku Lab",
  },
  description:
    "我们用 AI 自动化贵公司的手工流程：扫码点单、B2B 订货平台、ERP 系统集成、智能客服、数据增强和自动报表。免费评估。",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    alternateLocale: ["es_CO", "en_US"],
    siteName: "Hayaku Lab",
    title: "Hayaku Lab · 面向中小企业的 AI 自动化",
    description: "让流程自己运转，更快。立即体验我们的在线演示。",
  },
};

export const viewport: Viewport = { themeColor: "#150E48" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootHtml lang="zh">{children}</RootHtml>;
}
