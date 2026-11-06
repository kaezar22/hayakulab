import Link from "next/link";
import LangSwitch from "@/components/LangSwitch";
import { href, type Lang } from "@/lib/i18n";
import { BRAND, EMAIL, LINKEDIN, bookingHref, whatsappHref } from "@/lib/site";

const T = {
  es: {
    home: "inicio",
    nav: [["servicios", "Servicios"], ["demos", "Demos"], ["clientes", "Clientes"], ["proceso", "Cómo trabajamos"]],
    navLabel: "Principal",
    cta: "Diagnóstico gratis",
    tagline: "Automatización con IA para pymes. Procesos que funcionan solos, más rápido.",
    demos: "Demos",
    contact: "Contacto",
    demoLinks: [["/demos/pedidos-qr", "Pedidos por QR"], ["/demos/pedidos", "Pedidos B2B"], ["/demos/qr-eventos", "QR Eventos"], ["/demos/enriquecimiento", "Enriquecimiento de datos"]],
    city: "Bogotá, Colombia",
    fast: "“rápido”",
  },
  en: {
    home: "home",
    nav: [["servicios", "Services"], ["demos", "Demos"], ["clientes", "Clients"], ["proceso", "How we work"]],
    navLabel: "Main",
    cta: "Free assessment",
    tagline: "AI automation for small and mid-sized businesses. Processes that run themselves, faster.",
    demos: "Demos",
    contact: "Contact",
    demoLinks: [["/demos/pedidos-qr", "QR ordering"], ["/demos/pedidos", "B2B ordering"], ["/demos/qr-eventos", "QR Events"], ["/demos/enriquecimiento", "Data enrichment"]],
    city: "Bogotá, Colombia",
    fast: "“fast”",
  },
} as const;

export function Logo({ lang = "es" }: { lang?: Lang }) {
  return (
    <Link href={href(lang, "/")} className="hk-logo" aria-label={`${BRAND}, ${T[lang].home}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-mark.png" alt="" width={52} height={30} />
      <span>
        Hayaku<b>Lab</b>
      </span>
    </Link>
  );
}

export function Header({ lang = "es" }: { lang?: Lang }) {
  const t = T[lang];
  return (
    <header className="hk-header">
      <div className="hk-container hk-header-in">
        <Logo lang={lang} />
        <nav className="hk-nav" aria-label={t.navLabel}>
          {t.nav.map(([id, label]) => (
            <Link key={id} href={`${href(lang, "/")}#${id}`}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="hk-header-actions">
          <LangSwitch lang={lang} />
          <a className="hk-btn hk-btn-cyan hk-btn-sm" href={bookingHref(lang)}>
            {t.cta}
          </a>
        </div>
      </div>
    </header>
  );
}

export function Footer({ lang = "es" }: { lang?: Lang }) {
  const t = T[lang];
  const wa = whatsappHref(lang);
  return (
    <footer className="hk-footer">
      <div className="hk-container hk-footer-in">
        <div className="hk-footer-brand">
          <Logo lang={lang} />
          <p>{t.tagline}</p>
        </div>
        <div className="hk-footer-cols">
          <div>
            <h4>{t.demos}</h4>
            {t.demoLinks.map(([p, label]) => (
              <Link key={p} href={href(lang, p)}>
                {label}
              </Link>
            ))}
          </div>
          <div>
            <h4>{t.contact}</h4>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            {wa && (
              <a href={wa} target="_blank" rel="noopener">
                WhatsApp
              </a>
            )}
            <a href={LINKEDIN} target="_blank" rel="noopener">
              LinkedIn ↗
            </a>
          </div>
        </div>
      </div>
      <div className="hk-container hk-footer-legal">
        <span>
          © {new Date().getFullYear()} {BRAND} · {t.city}
        </span>
        <span lang="ja">
          早く — <span lang={lang}>{t.fast}</span>
        </span>
      </div>
    </footer>
  );
}
