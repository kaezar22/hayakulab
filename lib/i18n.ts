/** Idiomas del sitio. Español en la raíz (/), inglés bajo /en. */
export type Lang = "es" | "en";
export const LANGS: Lang[] = ["es", "en"];

/** Ruta en el idioma dado: href("en", "/demos/pedidos") → "/en/demos/pedidos". */
export function href(lang: Lang, path: string): string {
  if (lang === "es") return path;
  return path === "/" ? "/en" : `/en${path}`;
}

/** La misma página en el otro idioma (para el botón ES / EN). */
export function switchPath(pathname: string): { lang: Lang; path: string } {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return { lang: "es", path: pathname.slice(3) || "/" };
  }
  return { lang: "en", path: href("en", pathname) };
}

/** Metadatos alternates (canonical + hreflang) para una ruta en español. */
export function alternates(lang: Lang, path: string) {
  return {
    canonical: href(lang, path),
    languages: { es: path, en: href("en", path), "x-default": path },
  };
}
