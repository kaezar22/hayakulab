"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { switchPath, type Lang } from "@/lib/i18n";

/** Botón ES / EN: lleva a la misma página en el otro idioma. */
export default function LangSwitch({ lang }: { lang: Lang }) {
  const pathname = usePathname() || "/";
  const other = switchPath(pathname);
  return (
    <div className="hk-lang" role="group" aria-label={lang === "en" ? "Language" : "Idioma"}>
      <Link href={lang === "es" ? pathname : other.path} aria-current={lang === "es" ? "true" : undefined} className={lang === "es" ? "on" : ""} hrefLang="es" lang="es" prefetch={false}>
        ES
      </Link>
      <Link href={lang === "en" ? pathname : other.path} aria-current={lang === "en" ? "true" : undefined} className={lang === "en" ? "on" : ""} hrefLang="en" lang="en" prefetch={false}>
        EN
      </Link>
    </div>
  );
}
