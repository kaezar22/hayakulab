import Link from "next/link";
import { Footer, Header } from "@/components/Chrome";
import OpenChatButton from "@/components/OpenChatButton";
import { href, type Lang } from "@/lib/i18n";
import { EMAIL, TESTIMONIALS, bookingHref, whatsappHref } from "@/lib/site";

// Íconos de los servicios (mismo orden que `services` en cada idioma).
const ICONS = [
  <path key="0" d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" />,
  <path key="1" d="M7 7h4v4H7zM13 13h4v4h-4zM11 9h3a2 2 0 0 1 2 2v2M9 11v3a2 2 0 0 0 2 2h2" />,
  <path key="2" d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4 3v-3h0A2 2 0 0 1 5 14Zm4 3h6M9 12.5h4" />,
  <path key="3" d="M4 5h16v14H4zM4 10h16M9 10v9M14 13h3M14 16h3" />,
  <path key="4" d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  <path key="5" d="M12 3l2.2 5.3L20 9l-4.3 3.8L17 18.5 12 15.6 7 18.5l1.3-5.7L4 9l5.8-.7z" />,
];

const C = {
  es: {
    eyebrow: "Automatización con IA para pymes",
    h1a: "Procesos que funcionan solos, ",
    h1b: "más rápido",
    lead: "Convertimos el trabajo manual de tu equipo —pedidos, facturas, reportes, copiar y pegar entre sistemas— en flujos automáticos que corren solos, 24/7.",
    ctaBook: "Agenda tu diagnóstico gratis",
    ctaDemos: "Probar las demos →",
    points: ["Sin cambiar tu software actual", "Plan en 48 horas", "Resultados en semanas"],
    flowLabel: "Ejemplo de un pedido automatizado",
    flowHead: "Pedido automatizado · en vivo",
    flow: [
      ["Mesa 7 escanea el QR", "2 mojitos · 1 nachos", "0 s"],
      ["El bar lo recibe al instante", "Tablero de pedidos · sin papel", "1 s"],
      ["Se registra la venta", "Inventario y caja actualizados", "2 s"],
      ["“¡Tu pedido está listo!” 🔔", "El celular del cliente suena y vibra", "✓"],
    ],
    flowStat: "Horas → segundos",
    flowStatLabel: "en tareas que antes se hacían a mano",
    painsKicker: "¿Te suena?",
    painsTitle: "Si tu equipo hace esto a mano, se puede automatizar",
    pains: [
      ["Pedidos que llegan por WhatsApp y alguien los copia a Excel", "Un portal donde el cliente pide y el pedido queda listo para facturar"],
      ["Meseros que van y vienen tomando la orden en cada mesa", "Un QR por mesa: el cliente pide y el bar lo ve al instante"],
      ["Reportes que se arman a mano cada lunes", "Tableros que se actualizan solos y alertas cuando algo se sale de rango"],
      ["Facturas en PDF que alguien digita en el ERP", "La IA las lee, valida las cuentas y deja los datos listos"],
      ["Alguien lee noticias, reseñas o correos y los clasifica a mano en Excel", "La IA los resume y clasifica en una tabla lista para filtrar y analizar"],
    ],
    servicesKicker: "Servicios",
    servicesTitle: "Qué automatizamos",
    servicesSub: "Soluciones a la medida, construidas sobre las herramientas que tu empresa ya usa.",
    services: [
      ["Pedidos y ventas", "Menús con QR para bares y restaurantes, portales de pedidos B2B y catálogos que se conectan con tu inventario."],
      ["Integraciones", "Conectamos World Office, Siigo, Google Sheets, Excel, Shopify y APIs para que nadie vuelva a copiar y pegar datos."],
      ["Asistentes con IA", "Chatbots para tu web o tu equipo que responden con la información de tu empresa, y lectura automática de facturas y documentos."],
      ["Enriquecimiento de datos", "La IA lee textos sueltos —noticias, reseñas, correos, tickets, catálogos— y los convierte en una tabla con resumen, categoría, protagonistas y sentimiento."],
      ["Reportes automáticos", "Tableros en Power BI o Streamlit, reportes que se generan y envían solos y alertas por correo o WhatsApp."],
      ["IA para tu equipo", "Configuramos y capacitamos a tu equipo en las herramientas de IA que ya tiene, para que le saquen provecho desde el primer día."],
    ],
    otherTitle: "¿Tienes otro proceso en mente?",
    otherText: "Cuéntanoslo y te decimos si se puede automatizar y cómo.",
    otherCta: "Preguntarle al asistente",
    demosKicker: "Demos en vivo",
    demosTitle: "Pruébalo tú mismo",
    demosSub: "Sistemas reales que construimos para clientes, con datos de ejemplo. Haz clic, pide, registra asistentes, descarga facturas y explora noticias clasificadas por IA en vivo.",
    tryDemo: "Probar la demo",
    liveDemo: "Ver la demo en vivo",
    qr: {
      table: "Mesa 7", send: "Enviar pedido", fresh: "Nuevos", board1: "Mesa 7 · Ana", board2: "Barra · Andrés", ready: "Listos", board3: "Mesa 3 · Laura 🔔",
      tag: "Bares y restaurantes", title: "Pedidos por código QR",
      text: "El cliente escanea el QR de su mesa, pide desde el celular y el bar lo recibe al instante. Cuando el pedido está listo, el celular del cliente suena y vibra.",
    },
    b2b: {
      review: "Revisar", none: "No existe", pdf: "↓ Factura PDF · Excel",
      tag: "Distribuidores y mayoristas", title: "Pedidos B2B con facturación",
      text: "Tus clientes piden en línea; el sistema reconoce quién es aunque escriba mal el nombre, aplica su lista de precios y deja la factura lista.",
    },
    ev: {
      inviteOf: "Invitación de", personal: "QR personal", attendance: "Asistencia por artista", welcome: "✅ Bienvenida, Lucía",
      tag: "Eventos y venues", title: "QR Eventos: asistencia por artista",
      text: "Cada artista comparte su invitación, cada seguidor recibe un QR personal y en la puerta se escanea. Sabes exactamente cuánta gente trajo cada uno.",
    },
    geo: {
      enriched: "↓ Enriquecido con IA",
      rows: [["🇷🇺🇺🇦", "Conflicto armado · Guerra en Ucrania", "n", "Negativo"], ["🇺🇸🇨🇳", "Comercio · Tregua arancelaria", "z", "Neutral"], ["🇨🇴🇻🇪", "Diplomacia · Acuerdo fronterizo", "p", "Positivo"]],
      tag: "Analistas, medios y equipos de datos", title: "Enriquecimiento de datos con IA",
      text: "Noticias de geopolítica de 19 medios de todo el mundo, resumidas y clasificadas en vivo: quién aparece, qué países involucra, tema, subtema y sentimiento.",
    },
    clientsKicker: "Resultados con clientes",
    clientsTitle: "Lo que dicen nuestros clientes",
    processKicker: "Cómo trabajamos",
    processTitle: "De la primera llamada a un proceso que corre solo",
    steps: [
      ["Diagnóstico gratis", "45 minutos por videollamada sobre un proceso que hoy se hace a mano: quién, en qué sistema y cuántas horas a la semana."],
      ["Plan en 48 horas", "Recibes un plan de una página: qué se puede automatizar, qué no y cuánto costaría. Lo contrates o no."],
      ["Construcción por entregas", "Entregas cortas que tu equipo prueba con datos reales. Semanas, no meses."],
      ["Puesta en marcha", "Capacitamos a tu equipo, documentamos todo y acompañamos los primeros días de uso."],
    ],
    faqKicker: "Preguntas frecuentes",
    faqTitle: "Lo que nos suelen preguntar",
    faqSub: "¿Tienes otra pregunta? El asistente de la esquina responde al instante.",
    faq: [
      ["¿Necesito cambiar mi software actual?", "No. Trabajamos sobre lo que ya usas (tu ERP, Excel, Google Sheets, WhatsApp) y lo conectamos. Solo proponemos cambiar algo si de verdad vale la pena."],
      ["¿Cuánto cuesta un proyecto?", "Depende del alcance, por eso empezamos con el diagnóstico gratuito. Ahí recibes un estimado claro antes de comprometerte con nada."],
      ["¿Mis datos están seguros?", "Las integraciones usan accesos de solo lectura siempre que se puede, las llaves viven en el servidor y nunca en el navegador, y tus datos no se usan para entrenar modelos."],
      ["¿Trabajan fuera de Bogotá?", "Sí. Trabajamos de forma remota con empresas de toda Colombia y Latinoamérica, en español, inglés o chino."],
    ],
    finalTitle: "Cuéntanos qué proceso te quita más tiempo",
    finalText: "En 45 minutos te decimos si se puede automatizar, cómo y cuánto costaría. Sin compromiso.",
    finalBook: "Agendar diagnóstico gratis",
    finalWa: "Escribir por WhatsApp",
  },
  en: {
    eyebrow: "AI automation for small and mid-sized businesses",
    h1a: "Processes that run themselves, ",
    h1b: "faster",
    lead: "We turn your team's manual work —orders, invoices, reports, copy-pasting between systems— into automated workflows that run on their own, 24/7.",
    ctaBook: "Book your free assessment",
    ctaDemos: "Try the demos →",
    points: ["No need to replace your software", "Plan in 48 hours", "Results in weeks"],
    flowLabel: "Example of an automated order",
    flowHead: "Automated order · live",
    flow: [
      ["Table 7 scans the QR code", "2 mojitos · 1 nachos", "0 s"],
      ["The bar gets it instantly", "Order board · no paper", "1 s"],
      ["The sale is recorded", "Inventory and till updated", "2 s"],
      ["“Your order is ready!” 🔔", "The customer's phone rings and vibrates", "✓"],
    ],
    flowStat: "Hours → seconds",
    flowStatLabel: "on tasks that used to be done by hand",
    painsKicker: "Sound familiar?",
    painsTitle: "If your team does this by hand, it can be automated",
    pains: [
      ["Orders arrive on WhatsApp and someone copies them into Excel", "A portal where customers order and each order is ready to invoice"],
      ["Waiters running back and forth taking orders at every table", "A QR code per table: guests order and the bar sees it instantly"],
      ["Reports put together by hand every Monday", "Dashboards that update themselves and alerts when something goes off track"],
      ["PDF invoices someone types into the ERP", "AI reads them, checks the math and leaves the data ready"],
      ["Someone reads news, reviews or emails and tags them by hand in Excel", "AI summarizes and classifies them into a table ready to filter and analyze"],
    ],
    servicesKicker: "Services",
    servicesTitle: "What we automate",
    servicesSub: "Custom solutions built on the tools your company already uses.",
    services: [
      ["Orders and sales", "QR menus for bars and restaurants, B2B ordering portals and catalogs connected to your inventory."],
      ["Integrations", "We connect your ERP, Google Sheets, Excel, Shopify and APIs so nobody has to copy and paste data again."],
      ["AI assistants", "Chatbots for your website or your team that answer with your company's information, plus automatic reading of invoices and documents."],
      ["Data enrichment", "AI reads unstructured text —news, reviews, emails, tickets, catalogs— and turns it into a table with summary, category, key people and sentiment."],
      ["Automated reporting", "Power BI or Streamlit dashboards, reports that build and send themselves, and alerts by email or WhatsApp."],
      ["AI for your team", "We set up the AI tools your team already has and train them to get value from day one."],
    ],
    otherTitle: "Have another process in mind?",
    otherText: "Tell us about it and we'll tell you whether and how it can be automated.",
    otherCta: "Ask the assistant",
    demosKicker: "Live demos",
    demosTitle: "Try it yourself",
    demosSub: "Real systems we built for clients, with sample data. Click around: place orders, register guests, download invoices and explore news classified by AI in real time.",
    tryDemo: "Try the demo",
    liveDemo: "See the live demo",
    qr: {
      table: "Table 7", send: "Send order", fresh: "New", board1: "Table 7 · Ana", board2: "Bar · Andrés", ready: "Ready", board3: "Table 3 · Laura 🔔",
      tag: "Bars and restaurants", title: "QR code ordering",
      text: "Guests scan the QR code on their table, order from their phone and the bar gets it instantly. When the order is ready, the guest's phone rings and vibrates.",
    },
    b2b: {
      review: "Review", none: "Not found", pdf: "↓ PDF invoice · Excel",
      tag: "Distributors and wholesalers", title: "B2B ordering with invoicing",
      text: "Your customers order online; the system recognizes who they are even if they misspell the name, applies their price list and gets the invoice ready.",
    },
    ev: {
      inviteOf: "Invited by", personal: "Personal QR", attendance: "Attendance by artist", welcome: "✅ Welcome, Lucía",
      tag: "Events and venues", title: "QR Events: attendance by artist",
      text: "Each artist shares their invitation, each follower gets a personal QR code and it's scanned at the door. You know exactly how many people each one brought.",
    },
    geo: {
      enriched: "↓ Enriched with AI",
      rows: [["🇷🇺🇺🇦", "Armed conflict · War in Ukraine", "n", "Negative"], ["🇺🇸🇨🇳", "Trade · Tariff truce", "z", "Neutral"], ["🇨🇴🇻🇪", "Diplomacy · Border agreement", "p", "Positive"]],
      tag: "Analysts, media and data teams", title: "AI data enrichment",
      text: "Geopolitical news from 19 outlets around the world, summarized and classified live: who is involved, which countries, topic, subtopic and sentiment.",
    },
    clientsKicker: "Client results",
    clientsTitle: "What our clients say",
    processKicker: "How we work",
    processTitle: "From the first call to a process that runs itself",
    steps: [
      ["Free assessment", "A 45-minute video call about one process your team does by hand today: who does it, in which system and how many hours a week."],
      ["Plan in 48 hours", "You get a one-page plan: what can be automated, what can't and what it would cost. Whether you hire us or not."],
      ["Built in short iterations", "Short deliveries your team tests with real data. Weeks, not months."],
      ["Go-live", "We train your team, document everything and support the first days of use."],
    ],
    faqKicker: "FAQ",
    faqTitle: "What people usually ask",
    faqSub: "Have another question? The assistant in the corner answers instantly.",
    faq: [
      ["Do I need to replace my current software?", "No. We work on top of what you already use (your ERP, Excel, Google Sheets, WhatsApp) and connect it. We only suggest changing something when it's truly worth it."],
      ["How much does a project cost?", "It depends on the scope, which is why we start with the free assessment. You get a clear estimate before committing to anything."],
      ["Is my data safe?", "Integrations use read-only access whenever possible, keys live on the server and never in the browser, and your data is not used to train models."],
      ["Do you work outside Colombia?", "Yes. We work remotely with companies anywhere, in English, Spanish or Chinese. We're based in Bogotá (UTC−5), which overlaps well with North American business hours."],
    ],
    finalTitle: "Tell us which process takes up most of your time",
    finalText: "In 45 minutes we'll tell you whether it can be automated, how, and what it would cost. No commitment.",
    finalBook: "Book a free assessment",
    finalWa: "Message us on WhatsApp",
  },
  zh: {
    eyebrow: "面向中小企业的 AI 自动化",
    h1a: "让流程自己运转，",
    h1b: "更快",
    lead: "我们把团队的手工工作——订单、发票、报表、在系统之间复制粘贴——变成全天候自动运行的工作流。",
    ctaBook: "预约免费评估",
    ctaDemos: "体验演示 →",
    points: ["无需更换现有软件", "48 小时内给出方案", "数周见效"],
    flowLabel: "自动化订单示例",
    flowHead: "自动化订单 · 实时",
    flow: [
      ["7 号桌扫描二维码", "2 杯莫吉托 · 1 份玉米片", "0 秒"],
      ["吧台即时收到订单", "订单看板 · 无纸化", "1 秒"],
      ["销售自动入账", "库存和收银同步更新", "2 秒"],
      ["“您的餐点已备好！” 🔔", "顾客手机响铃并振动", "✓"],
    ],
    flowStat: "数小时 → 数秒",
    flowStatLabel: "过去靠手工完成的工作",
    painsKicker: "似曾相识？",
    painsTitle: "如果团队还在手工做这些事，就可以自动化",
    pains: [
      ["订单通过 WhatsApp 发来，再由专人抄进 Excel", "客户在线下单，订单直接可以开票"],
      ["服务员在各桌之间来回跑着点单", "每桌一个二维码：顾客自助点单，吧台即时看到"],
      ["每周一手工整理报表", "看板自动更新，数据异常时自动提醒"],
      ["有人把 PDF 发票逐一录入 ERP", "AI 自动读取发票、核对金额，数据直接可用"],
      ["有人阅读新闻、评论或邮件，再手工在 Excel 里分类", "AI 自动摘要和分类，生成可筛选、可分析的表格"],
    ],
    servicesKicker: "服务",
    servicesTitle: "我们能自动化什么",
    servicesSub: "基于贵公司现有工具打造的定制方案。",
    services: [
      ["订单与销售", "为酒吧和餐厅提供扫码点单，为批发商提供 B2B 订货平台，商品目录与库存实时连接。"],
      ["系统集成", "打通 ERP、Google Sheets、Excel、Shopify 和各类 API，告别手工复制粘贴。"],
      ["AI 助手", "为网站或内部团队打造基于公司资料作答的智能客服，并自动读取发票和文件。"],
      ["数据增强", "AI 读取零散文本——新闻、评论、邮件、工单、商品目录——整理成包含摘要、类别、相关人物和情感倾向的表格。"],
      ["自动报表", "Power BI 或 Streamlit 看板，自动生成和发送报表，并通过邮件或 WhatsApp 推送提醒。"],
      ["团队 AI 赋能", "为团队配置现有的 AI 工具并进行培训，从第一天起就用出价值。"],
    ],
    otherTitle: "还有其他流程想自动化？",
    otherText: "告诉我们，我们会判断能否自动化以及如何实现。",
    otherCta: "咨询 AI 助手",
    demosKicker: "在线演示",
    demosTitle: "亲自体验",
    demosSub: "这些是我们为客户打造的真实系统，使用示例数据。随意点击：下单、登记来宾、下载发票，或实时浏览由 AI 分类的新闻。",
    tryDemo: "体验演示",
    liveDemo: "查看实时演示",
    qr: {
      table: "7 号桌", send: "提交订单", fresh: "新订单", board1: "7 号桌 · Ana", board2: "吧台 · Andrés", ready: "已完成", board3: "3 号桌 · Laura 🔔",
      tag: "酒吧与餐厅", title: "扫码点单",
      text: "顾客扫描桌上的二维码，用手机下单，吧台即时收到。餐点备好后，顾客手机会响铃并振动。",
    },
    b2b: {
      review: "待核对", none: "未找到", pdf: "↓ PDF 发票 · Excel",
      tag: "经销商与批发商", title: "B2B 订货与开票",
      text: "客户在线下单；即使名称写错，系统也能识别客户身份，套用其价目表，并生成发票。",
    },
    ev: {
      inviteOf: "邀请人", personal: "个人二维码", attendance: "各艺人到场人数", welcome: "✅ 欢迎，Lucía",
      tag: "活动与场馆", title: "活动二维码：按艺人统计到场",
      text: "每位艺人分享自己的邀请，每位粉丝获得个人二维码，入场时扫码核验。每位艺人带来多少人，一目了然。",
    },
    geo: {
      enriched: "↓ AI 数据增强",
      rows: [["🇷🇺🇺🇦", "武装冲突 · 乌克兰战争", "n", "负面"], ["🇺🇸🇨🇳", "贸易 · 关税休战", "z", "中性"], ["🇨🇴🇻🇪", "外交 · 边境协议", "p", "正面"]],
      tag: "分析师、媒体与数据团队", title: "AI 数据增强",
      text: "来自全球 19 家媒体的地缘政治新闻，实时摘要和分类：涉及哪些人物、哪些国家，主题、子主题和情感倾向。",
    },
    clientsKicker: "客户成果",
    clientsTitle: "客户怎么说",
    processKicker: "合作流程",
    processTitle: "从第一次通话到流程自动运转",
    steps: [
      ["免费评估", "45 分钟视频通话，聊一个目前靠手工完成的流程：由谁做、在哪个系统里做、每周花多少小时。"],
      ["48 小时内给出方案", "您会收到一页纸的方案：哪些能自动化、哪些不能、大概费用多少。是否合作由您决定。"],
      ["分阶段交付", "小步快跑，每次交付都由团队用真实数据测试。以周计，而不是以月计。"],
      ["上线运行", "我们培训团队、整理完整文档，并在上线初期全程陪跑。"],
    ],
    faqKicker: "常见问题",
    faqTitle: "大家常问的问题",
    faqSub: "还有其他问题？右下角的 AI 助手会即时回答。",
    faq: [
      ["需要更换现有软件吗？", "不需要。我们在您现有的工具（ERP、Excel、Google Sheets、WhatsApp）之上进行连接。只有确实值得时，才会建议更换。"],
      ["项目费用是多少？", "取决于项目范围，所以我们先做免费评估。在您做任何承诺之前，会先拿到清晰的报价。"],
      ["我的数据安全吗？", "集成尽可能使用只读权限，密钥只保存在服务器上，绝不暴露在浏览器中，您的数据也不会用于训练模型。"],
      ["你们和哥伦比亚以外的公司合作吗？", "合作。我们远程服务世界各地的企业，可以用中文、英语或西班牙语沟通。我们位于哥伦比亚波哥大（UTC−5）。"],
    ],
    finalTitle: "告诉我们哪个流程最耗时间",
    finalText: "45 分钟内，我们会告诉您能否自动化、如何实现以及大概费用。没有任何附加义务。",
    finalBook: "预约免费评估",
    finalWa: "通过 WhatsApp 联系",
  },
};

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export default function Home({ lang }: { lang: Lang }) {
  const t = C[lang];
  const wa = whatsappHref(lang);
  const h = (p: string) => href(lang, p);
  return (
    <>
      <Header lang={lang} />
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
              <div className="hk-eyebrow">{t.eyebrow}</div>
              <h1>
                {t.h1a}
                <em>{t.h1b}</em>{lang === "zh" ? "。" : "."}
              </h1>
              <p className="hk-lead">{t.lead}</p>
              <div className="hk-hero-ctas">
                <a className="hk-btn hk-btn-cyan" href={bookingHref(lang)}>
                  {t.ctaBook}
                </a>
                <Link className="hk-btn hk-btn-outline" href="#demos">
                  {t.ctaDemos}
                </Link>
              </div>
              <ul className="hk-hero-points">
                {t.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="hk-flow" aria-label={t.flowLabel}>
              <div className="hk-flow-head">
                <span className="hk-dot" /> {t.flowHead}
              </div>
              <ol>
                {t.flow.map(([b, s, time], k) => (
                  <li key={b} className={k === t.flow.length - 1 ? "ok" : undefined}>
                    <b>{b}</b>
                    <span>{s}</span>
                    <time>{time}</time>
                  </li>
                ))}
              </ol>
              <div className="hk-flow-foot">
                <div>
                  <b>{t.flowStat}</b>
                  <span>{t.flowStatLabel}</span>
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
            <div className="hk-kicker">{t.painsKicker}</div>
            <h2>{t.painsTitle}</h2>
            <div className="hk-pain-grid">
              {t.pains.map(([before, after]) => (
                <div key={before} className="hk-pain">
                  <p className="b">{before}</p>
                  <p className="a">{after}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Servicios ---------- */}
        <section className="hk-section hk-alt" id="servicios">
          <div className="hk-container">
            <div className="hk-kicker">{t.servicesKicker}</div>
            <h2>{t.servicesTitle}</h2>
            <p className="hk-sub">{t.servicesSub}</p>
            <div className="hk-services">
              {t.services.map(([title, text], k) => (
                <article key={title} className="hk-service">
                  <div className="hk-service-ic">
                    <Icon>{ICONS[k]}</Icon>
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
              <article className="hk-service hk-service-cta">
                <div>
                  <h3>{t.otherTitle}</h3>
                  <p>{t.otherText}</p>
                </div>
                <OpenChatButton className="hk-btn hk-btn-cyan hk-btn-sm">{t.otherCta}</OpenChatButton>
              </article>
            </div>
          </div>
        </section>

        {/* ---------- Demos ---------- */}
        <section className="hk-section" id="demos">
          <div className="hk-container">
            <div className="hk-kicker">{t.demosKicker}</div>
            <h2>{t.demosTitle}</h2>
            <p className="hk-sub">{t.demosSub}</p>
            <div className="hk-demos">
              <Link href={h("/demos/pedidos-qr")} className="hk-demo">
                <div className="hk-demo-art art-qr" aria-hidden="true">
                  <div className="mini-phone">
                    <div className="mini-qr" />
                    <span>{t.qr.table}</span>
                    <b>2 × Mojito</b>
                    <b>1 × Nachos</b>
                    <i>{t.qr.send}</i>
                  </div>
                  <div className="mini-board">
                    <span>{t.qr.fresh}</span>
                    <div>{t.qr.board1}</div>
                    <div>{t.qr.board2}</div>
                    <span>{t.qr.ready}</span>
                    <div className="ok">{t.qr.board3}</div>
                  </div>
                </div>
                <div className="hk-demo-body">
                  <div className="hk-tag">{t.qr.tag}</div>
                  <h3>{t.qr.title}</h3>
                  <p>{t.qr.text}</p>
                  <span className="hk-cta">
                    {t.tryDemo} <i>→</i>
                  </span>
                </div>
              </Link>

              <Link href={h("/demos/pedidos")} className="hk-demo">
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
                    <i className="rv">{t.b2b.review}</i>
                  </div>
                  <div className="row">
                    <code>“restaurante la ceiba”</code>
                    <em>→</em>
                    <b>—</b>
                    <i className="nf">{t.b2b.none}</i>
                  </div>
                  <div className="pdf">{t.b2b.pdf}</div>
                </div>
                <div className="hk-demo-body">
                  <div className="hk-tag">{t.b2b.tag}</div>
                  <h3>{t.b2b.title}</h3>
                  <p>{t.b2b.text}</p>
                  <span className="hk-cta">
                    {t.tryDemo} <i>→</i>
                  </span>
                </div>
              </Link>

              <Link href={h("/demos/qr-eventos")} className="hk-demo">
                <div className="hk-demo-art art-ev" aria-hidden="true">
                  <div className="ev-mini-ticket">
                    <span>{t.ev.inviteOf}</span>
                    <b>Valen Ríos</b>
                    <div className="mini-qr" />
                    <i>{t.ev.personal}</i>
                  </div>
                  <div className="ev-mini-bars">
                    <span>{t.ev.attendance}</span>
                    <div><em>Valen Ríos</em><p><u style={{ width: "86%" }} /></p><b>6</b></div>
                    <div><em>MC Tano</em><p><u style={{ width: "50%" }} /></p><b>3</b></div>
                    <div><em>DJ Kaori</em><p><u style={{ width: "28%" }} /></p><b>2</b></div>
                    <strong>{t.ev.welcome}</strong>
                  </div>
                </div>
                <div className="hk-demo-body">
                  <div className="hk-tag">{t.ev.tag}</div>
                  <h3>{t.ev.title}</h3>
                  <p>{t.ev.text}</p>
                  <span className="hk-cta">
                    {t.tryDemo} <i>→</i>
                  </span>
                </div>
              </Link>

              <Link href={h("/demos/enriquecimiento")} className="hk-demo">
                <div className="hk-demo-art art-geo" aria-hidden="true">
                  <div className="src">“Missile strikes hit energy grid as talks stall…”</div>
                  <div className="arrow">{t.geo.enriched}</div>
                  {t.geo.rows.map(([flags, label, cls, tone]) => (
                    <div key={label} className="rowg">
                      <span>{flags}</span>
                      <b>{label}</b>
                      <i className={cls}>{tone}</i>
                    </div>
                  ))}
                </div>
                <div className="hk-demo-body">
                  <div className="hk-tag">{t.geo.tag}</div>
                  <h3>{t.geo.title}</h3>
                  <p>{t.geo.text}</p>
                  <span className="hk-cta">
                    {t.liveDemo} <i>→</i>
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ---------- Testimonios ---------- */}
        <section className="hk-section hk-alt" id="clientes">
          <div className="hk-container">
            <div className="hk-kicker">{t.clientsKicker}</div>
            <h2>{t.clientsTitle}</h2>
            {TESTIMONIALS.map((item) => {
              const x = lang !== "es" ? (item[lang] ?? null) : null;
              return (
                <figure key={item.client} className="hk-testimonial">
                  <div className="hk-quote">
                    <span className="hk-qmark" aria-hidden="true">
                      “
                    </span>
                    <blockquote>{x ? x.quote : item.quote}</blockquote>
                    <figcaption>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.logo} alt={item.client} height={34} />
                      <span>
                        {x ? x.role : item.role}
                        {x?.note && <small className="hk-translated"> · {x.note}</small>}
                      </span>
                    </figcaption>
                  </div>
                  <div className="hk-stat">
                    <b>{x ? x.stat : item.stat}</b>
                    <span>{x ? x.statLabel : item.statLabel}</span>
                  </div>
                </figure>
              );
            })}
          </div>
        </section>

        {/* ---------- Proceso ---------- */}
        <section className="hk-section" id="proceso">
          <div className="hk-container">
            <div className="hk-kicker">{t.processKicker}</div>
            <h2>{t.processTitle}</h2>
            <ol className="hk-steps">
              {t.steps.map(([title, text], k) => (
                <li key={title}>
                  <span>{String(k + 1).padStart(2, "0")}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="hk-section hk-alt">
          <div className="hk-container hk-faq-wrap">
            <div>
              <div className="hk-kicker">{t.faqKicker}</div>
              <h2>{t.faqTitle}</h2>
              <p className="hk-sub">{t.faqSub}</p>
            </div>
            <div className="hk-faq">
              {t.faq.map(([q, a]) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
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
            <h2>{t.finalTitle}</h2>
            <p>{t.finalText}</p>
            <div className="hk-hero-ctas">
              <a className="hk-btn hk-btn-cyan" href={bookingHref(lang)}>
                {t.finalBook}
              </a>
              {wa ? (
                <a className="hk-btn hk-btn-outline" href={wa} target="_blank" rel="noopener">
                  {t.finalWa}
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
      <Footer lang={lang} />
    </>
  );
}
