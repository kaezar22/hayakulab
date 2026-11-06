import Link from "next/link";
import { Footer, Header } from "@/components/Chrome";
import { href, type Lang } from "@/lib/i18n";
import { EMAIL, bookingHref } from "@/lib/site";

const T = {
  es: { back: "← Todas las demos", live: "Demo en vivo", ctaTitle: "¿Quieres esto en tu empresa?", ctaText: "Lo adaptamos a tus procesos, tus datos y tus sistemas.", cta: "Agendar diagnóstico gratis" },
  en: { back: "← All demos", live: "Live demo", ctaTitle: "Want this in your company?", ctaText: "We adapt it to your processes, your data and your systems.", cta: "Book a free assessment" },
};

export default function DemoShell({
  lang = "es",
  tag,
  title,
  lead,
  how,
  note,
  wide,
  children,
}: {
  lang?: Lang;
  tag: string;
  title: string;
  lead: string;
  how: { title: string; items: readonly string[] };
  note: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  const t = T[lang];
  return (
    <>
      <Header lang={lang} />
      <main className="hk-demo-page">
        <section className="hk-demo-hero">
          <div className="hk-streaks" aria-hidden="true">
            <i />
            <i />
          </div>
          <div className="hk-container">
            <Link href={`${href(lang, "/")}#demos`} className="hk-backlink">
              {t.back}
            </Link>
            <div className="hk-eyebrow">
              <span className="hk-dot" /> {t.live} · {tag}
            </div>
            <h1>{title}</h1>
            <p className="hk-lead">{lead}</p>
          </div>
        </section>

        <section className={`hk-container hk-demo-stage ${wide ? "wide" : ""}`}>{children}</section>

        <section className="hk-container hk-how">
          <div>
            <h2>{how.title}</h2>
            <ul>
              {how.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <aside className="hk-how-cta">
            <h3>{t.ctaTitle}</h3>
            <p>{t.ctaText}</p>
            <a className="hk-btn hk-btn-cyan" href={bookingHref(lang)}>
              {t.cta}
            </a>
            <a className="hk-mail" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </aside>
        </section>
        <p className="hk-container hk-fineprint">{note}</p>
      </main>
      <Footer lang={lang} />
    </>
  );
}
