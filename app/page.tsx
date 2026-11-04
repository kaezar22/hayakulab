import Link from "next/link";
import { Footer, Header } from "@/components/Chrome";
import OpenChatButton from "@/components/OpenChatButton";
import { EMAIL, TESTIMONIALS, bookingHref, whatsappHref } from "@/lib/site";

const PAINS = [
  { before: "Pedidos que llegan por WhatsApp y alguien los copia a Excel", after: "Un portal donde el cliente pide y el pedido queda listo para facturar" },
  { before: "Meseros que van y vienen tomando la orden en cada mesa", after: "Un QR por mesa: el cliente pide y el bar lo ve al instante" },
  { before: "Reportes que se arman a mano cada lunes", after: "Tableros que se actualizan solos y alertas cuando algo se sale de rango" },
  { before: "Facturas en PDF que alguien digita en el ERP", after: "La IA las lee, valida las cuentas y deja los datos listos" },
];

const SERVICES = [
  {
    icon: (
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" />
    ),
    title: "Pedidos y ventas",
    text: "Menús con QR para bares y restaurantes, portales de pedidos B2B y catálogos que se conectan con tu inventario.",
  },
  {
    icon: <path d="M7 7h4v4H7zM13 13h4v4h-4zM11 9h3a2 2 0 0 1 2 2v2M9 11v3a2 2 0 0 0 2 2h2" />,
    title: "Integraciones",
    text: "Conectamos World Office, Siigo, Google Sheets, Excel, Shopify y APIs para que nadie vuelva a copiar y pegar datos.",
  },
  {
    icon: <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4 3v-3h0A2 2 0 0 1 5 14Zm4 3h6M9 12.5h4" />,
    title: "Asistentes con IA",
    text: "Chatbots para tu web o tu equipo que responden con la información de tu empresa, y lectura automática de facturas y documentos.",
  },
  {
    icon: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
    title: "Reportes automáticos",
    text: "Tableros en Power BI o Streamlit, reportes que se generan y envían solos y alertas por correo o WhatsApp.",
  },
  {
    icon: <path d="M12 3l2.2 5.3L20 9l-4.3 3.8L17 18.5 12 15.6 7 18.5l1.3-5.7L4 9l5.8-.7z" />,
    title: "IA para tu equipo",
    text: "Configuramos y capacitamos a tu equipo en las herramientas de IA que ya tiene, para que le saquen provecho desde el primer día.",
  },
];

const STEPS = [
  { n: "01", title: "Diagnóstico gratis", text: "45 minutos por videollamada sobre un proceso que hoy se hace a mano: quién, en qué sistema y cuántas horas a la semana." },
  { n: "02", title: "Plan en 48 horas", text: "Recibes un plan de una página: qué se puede automatizar, qué no y cuánto costaría. Lo contrates o no." },
  { n: "03", title: "Construcción por entregas", text: "Entregas cortas que tu equipo prueba con datos reales. Semanas, no meses." },
  { n: "04", title: "Puesta en marcha", text: "Capacitamos a tu equipo, documentamos todo y acompañamos los primeros días de uso." },
];

const FAQ = [
  { q: "¿Necesito cambiar mi software actual?", a: "No. Trabajamos sobre lo que ya usas (tu ERP, Excel, Google Sheets, WhatsApp) y lo conectamos. Solo proponemos cambiar algo si de verdad vale la pena." },
  { q: "¿Cuánto cuesta un proyecto?", a: "Depende del alcance, por eso empezamos con el diagnóstico gratuito. Ahí recibes un estimado claro antes de comprometerte con nada." },
  { q: "¿Mis datos están seguros?", a: "Las integraciones usan accesos de solo lectura siempre que se puede, las llaves viven en el servidor y nunca en el navegador, y tus datos no se usan para entrenar modelos." },
  { q: "¿Trabajan fuera de Bogotá?", a: "Sí. Trabajamos de forma remota con empresas de toda Colombia y Latinoamérica, en español, inglés o chino." },
];

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export default function Home() {
  const wa = whatsappHref();
  return (
    <>
      <Header />
      <main>
        {/* ---------- Hero ---------- */}
        <section className="hk-hero">
          <div className="hk-streaks" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="hk-container hk-hero-in">
            <div className="hk-hero-copy">
              <div className="hk-eyebrow">Automatización con IA para pymes</div>
              <h1>
                Procesos que funcionan solos, <em>más rápido</em>.
              </h1>
              <p className="hk-lead">
                Convertimos el trabajo manual de tu equipo —pedidos, facturas, reportes, copiar y pegar entre sistemas— en flujos automáticos que corren
                solos, 24/7.
              </p>
              <div className="hk-hero-ctas">
                <a className="hk-btn hk-btn-cyan" href={bookingHref()}>
                  Agenda tu diagnóstico gratis
                </a>
                <Link className="hk-btn hk-btn-outline" href="#demos">
                  Probar las demos →
                </Link>
              </div>
              <ul className="hk-hero-points">
                <li>Sin cambiar tu software actual</li>
                <li>Plan en 48 horas</li>
                <li>Resultados en semanas</li>
              </ul>
            </div>

            <div className="hk-flow" aria-label="Ejemplo de un pedido automatizado">
              <div className="hk-flow-head">
                <span className="hk-dot" /> Pedido automatizado · en vivo
              </div>
              <ol>
                <li>
                  <b>Mesa 7 escanea el QR</b>
                  <span>2 mojitos · 1 nachos</span>
                  <time>0 s</time>
                </li>
                <li>
                  <b>El bar lo recibe al instante</b>
                  <span>Tablero de pedidos · sin papel</span>
                  <time>1 s</time>
                </li>
                <li>
                  <b>Se registra la venta</b>
                  <span>Inventario y caja actualizados</span>
                  <time>2 s</time>
                </li>
                <li className="ok">
                  <b>“¡Tu pedido está listo!” 🔔</b>
                  <span>El celular del cliente suena y vibra</span>
                  <time>✓</time>
                </li>
              </ol>
              <div className="hk-flow-foot">
                <div>
                  <b>Horas → segundos</b>
                  <span>en tareas que antes se hacían a mano</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-mark.png" alt="" width={70} height={40} />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Dolores ---------- */}
        <section className="hk-section hk-pains">
          <div className="hk-container">
            <div className="hk-kicker">¿Te suena?</div>
            <h2>Si tu equipo hace esto a mano, se puede automatizar</h2>
            <div className="hk-pain-grid">
              {PAINS.map((p) => (
                <div key={p.before} className="hk-pain">
                  <p className="b">{p.before}</p>
                  <p className="a">{p.after}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Servicios ---------- */}
        <section className="hk-section hk-alt" id="servicios">
          <div className="hk-container">
            <div className="hk-kicker">Servicios</div>
            <h2>Qué automatizamos</h2>
            <p className="hk-sub">Soluciones a la medida, construidas sobre las herramientas que tu empresa ya usa.</p>
            <div className="hk-services">
              {SERVICES.map((s) => (
                <article key={s.title} className="hk-service">
                  <div className="hk-service-ic">
                    <Icon>{s.icon}</Icon>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </article>
              ))}
              <article className="hk-service hk-service-cta">
                <h3>¿Tienes otro proceso en mente?</h3>
                <p>Cuéntanoslo y te decimos si se puede automatizar y cómo.</p>
                <OpenChatButton className="hk-btn hk-btn-cyan hk-btn-sm">Preguntarle al asistente</OpenChatButton>
              </article>
            </div>
          </div>
        </section>

        {/* ---------- Demos ---------- */}
        <section className="hk-section" id="demos">
          <div className="hk-container">
            <div className="hk-kicker">Demos en vivo</div>
            <h2>Pruébalo tú mismo</h2>
            <p className="hk-sub">Dos sistemas reales que construimos para clientes, con datos de ejemplo. Haz clic, pide, mueve pedidos y descarga facturas.</p>
            <div className="hk-demos">
              <Link href="/demos/pedidos-qr" className="hk-demo">
                <div className="hk-demo-art art-qr" aria-hidden="true">
                  <div className="mini-phone">
                    <div className="mini-qr" />
                    <span>Mesa 7</span>
                    <b>2 × Mojito</b>
                    <b>1 × Nachos</b>
                    <i>Enviar pedido</i>
                  </div>
                  <div className="mini-board">
                    <span>Nuevos</span>
                    <div>Mesa 7 · Ana</div>
                    <div>Barra · Andrés</div>
                    <span>Listos</span>
                    <div className="ok">Mesa 3 · Laura 🔔</div>
                  </div>
                </div>
                <div className="hk-demo-body">
                  <div className="hk-tag">Bares y restaurantes</div>
                  <h3>Pedidos por código QR</h3>
                  <p>El cliente escanea el QR de su mesa, pide desde el celular y el bar lo recibe al instante. Cuando el pedido está listo, el celular del cliente suena y vibra.</p>
                  <span className="hk-cta">
                    Probar la demo <i>→</i>
                  </span>
                </div>
              </Link>

              <Link href="/demos/pedidos" className="hk-demo">
                <div className="hk-demo-art art-b2b" aria-hidden="true">
                  <div className="row">
                    <code>“forno chico”</code>
                    <em>→</em>
                    <b>Forno Vivo Chicó</b>
                    <i className="ok">98%</i>
                  </div>
                  <div className="row">
                    <code>“mirador”</code>
                    <em>→</em>
                    <b>Café Mirador Chapinero</b>
                    <i className="rv">Revisar</i>
                  </div>
                  <div className="row">
                    <code>“restaurante la ceiba”</code>
                    <em>→</em>
                    <b>—</b>
                    <i className="nf">No existe</i>
                  </div>
                  <div className="pdf">↓ Factura PDF · Excel</div>
                </div>
                <div className="hk-demo-body">
                  <div className="hk-tag">Distribuidores y mayoristas</div>
                  <h3>Pedidos B2B con facturación</h3>
                  <p>Tus clientes piden en línea; el sistema reconoce quién es aunque escriba mal el nombre, aplica su lista de precios y deja la factura lista.</p>
                  <span className="hk-cta">
                    Probar la demo <i>→</i>
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ---------- Testimonios ---------- */}
        <section className="hk-section hk-alt" id="clientes">
          <div className="hk-container">
            <div className="hk-kicker">Resultados con clientes</div>
            <h2>Lo que dicen nuestros clientes</h2>
            {TESTIMONIALS.map((t) => (
              <figure key={t.client} className="hk-testimonial">
                <div className="hk-quote">
                  <span className="hk-qmark" aria-hidden="true">
                    “
                  </span>
                  <blockquote>{t.quote}</blockquote>
                  <figcaption>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.logo} alt={t.client} height={34} />
                    <span>{t.role}</span>
                  </figcaption>
                </div>
                <div className="hk-stat">
                  <b>{t.stat}</b>
                  <span>{t.statLabel}</span>
                </div>
              </figure>
            ))}
          </div>
        </section>

        {/* ---------- Proceso ---------- */}
        <section className="hk-section" id="proceso">
          <div className="hk-container">
            <div className="hk-kicker">Cómo trabajamos</div>
            <h2>De la primera llamada a un proceso que corre solo</h2>
            <ol className="hk-steps">
              {STEPS.map((s) => (
                <li key={s.n}>
                  <span>{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="hk-section hk-alt">
          <div className="hk-container hk-faq-wrap">
            <div>
              <div className="hk-kicker">Preguntas frecuentes</div>
              <h2>Lo que nos suelen preguntar</h2>
              <p className="hk-sub">¿Tienes otra pregunta? El asistente de la esquina responde al instante.</p>
            </div>
            <div className="hk-faq">
              {FAQ.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="hk-final" id="contacto">
          <div className="hk-streaks" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="hk-container hk-final-in">
            <h2>Cuéntanos qué proceso te quita más tiempo</h2>
            <p>En 45 minutos te decimos si se puede automatizar, cómo y cuánto costaría. Sin compromiso.</p>
            <div className="hk-hero-ctas">
              <a className="hk-btn hk-btn-cyan" href={bookingHref()}>
                Agendar diagnóstico gratis
              </a>
              {wa ? (
                <a className="hk-btn hk-btn-outline" href={wa} target="_blank" rel="noopener">
                  Escribir por WhatsApp
                </a>
              ) : (
                <a className="hk-btn hk-btn-outline" href={`mailto:${EMAIL}`}>
                  {EMAIL}
                </a>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
