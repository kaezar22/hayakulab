import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/demos/pedidos-qr", "/demos/pedidos", "/demos/qr-eventos"].map((p) => ({ url: `${SITE_URL}${p}`, lastModified: new Date() }));
}
