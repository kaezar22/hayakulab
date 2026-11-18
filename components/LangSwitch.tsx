"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { basePath, href, LANG_LABEL, LANG_TAG, LANGS, type Lang } from "@/lib/i18n";

const ARIA: Record<Lang, string> = { es: "Idioma", en: "Language", zh: "语言" };

/** Botón ES / EN / 中文: lleva a la misma página en el otro idioma. */
export default function LangSwitch({ lang }: { lang: Lang }) {
  const base = basePath(usePathname() || "/");
  return (
    <div className="hk-lang" role="group" aria-label={ARIA[lang]}>
      {LANGS.map((l) => (
        <Link
          key={l}
          href={href(l, base)}
          aria-current={l === lang ? "true" : undefined}
          className={l === lang ? "on" : ""}
          hrefLang={LANG_TAG[l]}
          lang={LANG_TAG[l]}
          prefetch={false}
        >
          {LANG_LABEL[l]}
        </Link>
      ))}
    </div>
  );
}
