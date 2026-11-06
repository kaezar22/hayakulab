import type { MetadataRoute } from "next";
import { href } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

const PATHS = ["/", "/demos/pedidos-qr", "/demos/pedidos", "/demos/qr-eventos", "/demos/enriquecimiento"];

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (p: string) => `${SITE_URL}${p === "/" ? "" : p}`;
  return PATHS.flatMap((p) =>
    (["es", "en"] as const).map((lang) => ({
      url: url(href(lang, p)),
      lastModified: new Date(),
      alternates: { languages: { es: url(p), en: url(href("en", p)) } },
    })),
  );
}
