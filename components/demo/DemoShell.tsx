import Link from "next/link";
import { Footer, Header } from "@/components/Chrome";
import { EMAIL, bookingHref } from "@/lib/site";

export default function DemoShell({
  tag,
  title,
  lead,
  how,
  note,
  wide,
  children,
}: {
  tag: string;
  title: string;
  lead: string;
  how: { title: string; items: readonly string[] };
  note: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="hk-demo-page">
        <section className="hk-demo-hero">
          <div className="hk-streaks" aria-hidden="true">
            <i />
            <i />
          </div>
          <div className="hk-container">
            <Link href="/#demos" className="hk-backlink">
              ← Todas las demos
            </Link>
            <div className="hk-eyebrow">
              <span className="hk-dot" /> Demo en vivo · {tag}
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
            <h3>¿Quieres esto en tu empresa?</h3>
            <p>Lo adaptamos a tu menú, tus clientes, tus precios y tus sistemas.</p>
            <a className="hk-btn hk-btn-cyan" href={bookingHref()}>
              Agendar diagnóstico gratis
            </a>
            <a className="hk-mail" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </aside>
        </section>
        <p className="hk-container hk-fineprint">{note}</p>
      </main>
      <Footer />
    </>
  );
}
