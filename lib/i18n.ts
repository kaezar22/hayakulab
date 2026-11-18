/** Idiomas del sitio. Español en la raíz (/), inglés bajo /en y chino simplificado bajo /zh. */
export type Lang = "es" | "en" | "zh";
export const LANGS: Lang[] = ["es", "en", "zh"];

/** Etiqueta del botón de idioma y código para hreflang / <html lang>. */
export const LANG_LABEL: Record<Lang, string> = { es: "ES", en: "EN", zh: "中文" };
export const LANG_TAG: Record<Lang, string> = { es: "es", en: "en", zh: "zh-Hans" };

/** Ruta en el idioma dado: href("en", "/demos/pedidos") → "/en/demos/pedidos". */
export function href(lang: Lang, path: string): string {
  if (lang === "es") return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

/** Ruta sin el prefijo de idioma: "/zh/demos/pedidos" → "/demos/pedidos". */
export function basePath(pathname: string): string {
  for (const l of LANGS) {
    if (l === "es") continue;
    if (pathname === `/${l}`) return "/";
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1);
  }
  return pathname;
}

/** Metadatos alternates (canonical + hreflang) para una ruta en español. */
export function alternates(lang: Lang, path: string) {
  return {
    canonical: href(lang, path),
    languages: { es: path, en: href("en", path), "zh-Hans": href("zh", path), "x-default": path },
  };
}

/** Elige el texto del idioma: pick(lang, { es: "Hola", en: "Hi", zh: "你好" }). */
export function pick<T>(lang: Lang, v: Record<Lang, T>): T {
  return v[lang];
}
