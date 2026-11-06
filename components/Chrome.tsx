import Link from "next/link";
import { BRAND, EMAIL, LINKEDIN, bookingHref, whatsappHref } from "@/lib/site";

export function Logo() {
  return (
    <Link href="/" className="hk-logo" aria-label={`${BRAND}, inicio`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-mark.png" alt="" width={52} height={30} />
      <span>
        Hayaku<b>Lab</b>
      </span>
    </Link>
  );
}

export function Header() {
  return (
    <header className="hk-header">
      <div className="hk-container hk-header-in">
        <Logo />
        <nav className="hk-nav" aria-label="Principal">
          <Link href="/#servicios">Servicios</Link>
          <Link href="/#demos">Demos</Link>
          <Link href="/#clientes">Clientes</Link>
          <Link href="/#proceso">Cómo trabajamos</Link>
        </nav>
        <a className="hk-btn hk-btn-cyan hk-btn-sm" href={bookingHref()}>
          Diagnóstico gratis
        </a>
      </div>
    </header>
  );
}

export function Footer() {
  const wa = whatsappHref();
  return (
    <footer className="hk-footer">
      <div className="hk-container hk-footer-in">
        <div className="hk-footer-brand">
          <Logo />
          <p>Automatización con IA para pymes. Procesos que funcionan solos, más rápido.</p>
        </div>
        <div className="hk-footer-cols">
          <div>
            <h4>Demos</h4>
            <Link href="/demos/pedidos-qr">Pedidos por QR</Link>
            <Link href="/demos/pedidos">Pedidos B2B</Link>
            <Link href="/demos/qr-eventos">QR Eventos</Link>
            <Link href="/demos/enriquecimiento">Enriquecimiento de datos</Link>
          </div>
          <div>
            <h4>Contacto</h4>
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
          © {new Date().getFullYear()} {BRAND} · Bogotá, Colombia
        </span>
        <span lang="ja">早く — “rápido”</span>
      </div>
    </footer>
  );
}
