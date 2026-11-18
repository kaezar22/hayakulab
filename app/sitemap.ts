import type { MetadataRoute } from "next";
import { href, LANG_TAG, LANGS } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

const PATHS = ["/", "/demos/pedidos-qr", "/demos/pedidos", "/demos/qr-eventos", "/demos/enriquecimiento"];

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (p: string) => `${SITE_URL}${p === "/" ? "" : p}`;
  return PATHS.flatMap((p) =>
    LANGS.map((lang) => ({
      url: url(href(lang, p)),
      lastModified: new Date(),
      alternates: { languages: Object.fromEntries(LANGS.map((l) => [LANG_TAG[l], url(href(l, p))])) },
    })),
  );
}
