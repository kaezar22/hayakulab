// Textos de las 4 páginas de demo en español e inglés. Las rutas de /app solo
// llaman a estos componentes con el idioma, así cada texto vive en un solo lugar.

import type { Metadata } from "next";
import DemoShell from "@/components/demo/DemoShell";
import EventosDemo from "@/components/demo/EventosDemo";
import GeoDemo from "@/components/demo/GeoDemo";
import OrdersDemo from "@/components/demo/OrdersDemo";
import QrDemo from "@/components/demo/QrDemo";
import { alternates, type Lang } from "@/lib/i18n";

type PageText = {
  metaTitle: string;
  metaDescription: string;
  tag: string;
  title: string;
  lead: string;
  howTitle: string;
  how: string[];
  note: string;
};

const QR: Record<Lang, PageText> = {
  es: {
    metaTitle: "Demo · Pedidos por código QR",
    metaDescription: "Prueba cómo un bar recibe pedidos desde el QR de cada mesa y avisa al cliente cuando su pedido está listo.",
    tag: "bares y restaurantes",
    title: "Pedidos por código QR",
    lead: "A la izquierda, el celular de un cliente en la mesa 7. A la derecha, la pantalla del bar. Pide algo, envíalo y luego muévelo en el tablero hasta “Listo”: el celular sonará y vibrará.",
    howTitle: "Cómo funciona el sistema real",
    how: [
      "Cada mesa tiene su propio QR impreso. Al escanearlo se abre el menú de esa mesa, sin descargar ninguna app.",
      "El cliente elige, escribe su nombre y envía. El pedido aparece en el tablero del bar al instante, sin recargar la página.",
      "El bar mueve cada pedido de Nuevos a Preparando y a Listo. Al marcarlo listo, el celular del cliente suena, vibra y muestra el aviso.",
      "El bar marca los productos agotados, ve quién pidió mesero y lleva el control de pagado / por cobrar.",
      "Los precios y totales los calcula el servidor, nunca el navegador. Se puede conectar pago en línea con Wompi, Mercado Pago o ePayco.",
      "Tecnología: Next.js en Vercel y Supabase (Postgres + tiempo real). Funciona en cualquier celular.",
    ],
    note: "Bar La Esquina es un negocio ficticio. Esta demo corre completa en tu navegador; en el sistema real el celular y el bar son dispositivos distintos conectados en tiempo real.",
  },
  en: {
    metaTitle: "Demo · QR code ordering",
    metaDescription: "See how a bar receives orders from the QR code on each table and notifies the guest when their order is ready.",
    tag: "bars and restaurants",
    title: "QR code ordering",
    lead: "On the left, the phone of a guest at table 7. On the right, the bar's screen. Order something, send it, then move it across the board to “Ready”: the phone will ring and vibrate.",
    howTitle: "How the real system works",
    how: [
      "Each table has its own printed QR code. Scanning it opens that table's menu, with no app to download.",
      "The guest picks items, types their name and sends the order. It shows up on the bar's board instantly, without reloading the page.",
      "The bar moves each order from New to Preparing to Ready. When it's marked ready, the guest's phone rings, vibrates and shows an alert.",
      "The bar marks items as sold out, sees who called a waiter and keeps track of paid / unpaid orders.",
      "Prices and totals are calculated on the server, never in the browser. Online payments can be connected to local payment gateways.",
      "Tech: Next.js on Vercel and Supabase (Postgres + realtime). Works on any phone.",
    ],
    note: "Bar La Esquina is a fictional business. This demo runs entirely in your browser; in the real system the phone and the bar are separate devices connected in real time. Prices are in Colombian pesos (COP).",
  },
  zh: {
    metaTitle: "演示 · 扫码点单",
    metaDescription: "看看酒吧如何通过每张桌子上的二维码接收订单，并在餐点备好时通知顾客。",
    tag: "酒吧与餐厅",
    title: "扫码点单",
    lead: "左边是 7 号桌顾客的手机，右边是吧台的屏幕。点一样东西并提交，然后在看板上把它移到“已完成”：手机就会响铃并振动。",
    howTitle: "真实系统如何运作",
    how: [
      "每张桌子都有专属的二维码。扫码即可打开该桌的菜单，无需下载任何应用。",
      "顾客选好餐点、填写名字后提交。订单即时出现在吧台看板上，无需刷新页面。",
      "吧台把每个订单从“新订单”移到“制作中”，再移到“已完成”。标记完成后，顾客手机会响铃、振动并弹出提示。",
      "吧台可以标记售罄商品，查看谁在呼叫服务员，并跟踪已付款 / 未付款订单。",
      "价格和总额在服务器端计算，绝不在浏览器中计算。可接入当地的在线支付网关。",
      "技术：Vercel 上的 Next.js 加 Supabase（Postgres + 实时同步）。任何手机都能使用。",
    ],
    note: "Bar La Esquina 是虚构的商家。本演示完全在您的浏览器中运行；在真实系统中，顾客手机和吧台是实时连接的不同设备。价格单位为哥伦比亚比索（COP）。",
  },
};

const B2B: Record<Lang, PageText> = {
  es: {
    metaTitle: "Demo · Pedidos B2B con facturación",
    metaDescription: "Prueba cómo un distribuidor recibe pedidos en línea, reconoce al cliente aunque escriba mal su nombre, aplica su lista de precios y genera la factura.",
    tag: "distribuidores",
    title: "Pedidos B2B con facturación",
    lead: "Lácteos Agua Clara, un distribuidor ficticio, recibe pedidos de restaurantes. Haz un pedido como restaurante (escribe el nombre como quieras) y mira cómo el back office lo cruza con el cliente correcto, le pone precios y genera la factura.",
    howTitle: "Cómo funciona el sistema real",
    how: [
      "Los puntos de venta piden desde un enlace, sin ver precios. Cada línea queda registrada al instante en la hoja o base de datos del distribuidor.",
      "El nombre que escribe el restaurante se cruza automáticamente con la razón social, el NIT y la lista de precios. Si la similitud es baja, lo marca para revisión en vez de adivinar.",
      "Solo se pueden escoger fechas de entrega que coinciden con los días reales de despacho.",
      "El back office ve todos los pedidos con su estado, descarga la factura en PDF y un Excel con todas las líneas para su ERP.",
      "El restaurante confirma la recepción y queda medido el tiempo real de entrega.",
      "Basado en el sistema que usa Nutrienti a diario, conectado a Google Sheets y a su maestro de clientes.",
    ],
    note: "Lácteos Agua Clara S.A.S. es una empresa ficticia; todos los clientes, precios y NIT de esta página son inventados. Tus pedidos de prueba se guardan solo en tu navegador.",
  },
  en: {
    metaTitle: "Demo · B2B ordering with invoicing",
    metaDescription: "See how a distributor receives online orders, recognizes the customer even if they misspell their name, applies their price list and generates the invoice.",
    tag: "distributors",
    title: "B2B ordering with invoicing",
    lead: "Lácteos Agua Clara, a fictional dairy distributor, receives orders from restaurants. Place an order as a restaurant (type the name however you like) and watch the back office match it to the right customer, price it and generate the invoice.",
    howTitle: "How the real system works",
    how: [
      "Points of sale order from a link, without seeing prices. Each line is recorded instantly in the distributor's sheet or database.",
      "The name the restaurant types is automatically matched to the legal entity, tax ID and price list. If the match is weak, it's flagged for review instead of guessed.",
      "Only delivery dates that match the real dispatch days can be selected.",
      "The back office sees every order with its status and downloads a PDF invoice plus an Excel file with all lines for its ERP.",
      "The restaurant confirms receipt, so actual delivery time is measured.",
      "Based on the system Nutrienti uses every day, connected to Google Sheets and its customer master file.",
    ],
    note: "Lácteos Agua Clara S.A.S. is a fictional company; all customers, prices and tax IDs on this page are made up. Prices are in Colombian pesos (COP). Your test orders are stored only in your browser.",
  },
  zh: {
    metaTitle: "演示 · B2B 订货与开票",
    metaDescription: "看看经销商如何接收在线订单：即使客户写错名称也能识别，自动套用价目表并生成发票。",
    tag: "经销商",
    title: "B2B 订货与开票",
    lead: "Lácteos Agua Clara 是一家虚构的乳制品经销商，接收各家餐厅的订单。以餐厅身份下一个单（名称随便写），看看后台如何把它匹配到正确的客户、定价并生成发票。",
    howTitle: "真实系统如何运作",
    how: [
      "各门店通过一个链接下单，看不到价格。每一行订单都会即时记录到经销商的表格或数据库中。",
      "餐厅填写的名称会自动与法人名称、税号和价目表匹配。如果相似度不高，系统会标记为待核对，而不是随意猜测。",
      "只能选择与实际配送日相符的送货日期。",
      "后台可以查看所有订单及其状态，下载 PDF 发票，以及包含全部明细、可导入 ERP 的 Excel 文件。",
      "餐厅确认收货后，即可统计实际配送时长。",
      "基于 Nutrienti 每天都在使用的系统，连接 Google Sheets 和其客户主数据。",
    ],
    note: "Lácteos Agua Clara S.A.S. 是虚构公司，本页所有客户、价格和税号均为虚构。价格单位为哥伦比亚比索（COP）。PDF 发票以英文生成。您的测试订单只保存在浏览器中。",
  },
};

const EV: Record<Lang, PageText> = {
  es: {
    metaTitle: "Demo · QR Eventos: asistencia por artista",
    metaDescription: "Prueba cómo un evento cuenta cuántas personas trae cada artista o influencer: invitación con QR, registro con QR personal y check-in en la puerta.",
    tag: "eventos y venues",
    title: "QR Eventos: ¿cuánta gente trae cada artista?",
    lead: "Un artista crea su invitación y la comparte en redes. Cada seguidor se registra y recibe su QR personal. En la puerta se escanea y el evento sabe exactamente cuántas personas llegaron por cada artista.",
    howTitle: "Cómo funciona el sistema real",
    how: [
      "El artista o influencer llena un formulario corto y recibe un link y un QR para publicar en TikTok, Instagram o sus historias.",
      "Cada seguidor se registra con nombre, correo y celular, acepta la política de tratamiento de datos (Ley 1581) y recibe un QR personal en pantalla y por correo.",
      "El QR es por persona, no por artista: no se puede compartir, no sirve dos veces y no se puede usar en otro evento. Un mismo correo solo se registra una vez por invitación.",
      "En la puerta, el portero entra con clave y escanea con la cámara del celular (elige la cámara trasera), desde una foto o escribiendo el código.",
      "Cada ingreso queda con hora y artista, y el tablero muestra en vivo cuántos se registraron y cuántos llegaron por cada uno: la base para pagar comisiones o premiar a quien más convoca.",
      "Todo queda en Google Sheets, sin licencias costosas. Siguientes módulos: canje del beneficio en barra, panel para cada artista y votaciones solo para asistentes.",
    ],
    note: "Los artistas, eventos y asistentes de esta demo son ficticios. La demo corre en tu navegador; el sistema real usa la cámara del celular en la puerta y guarda todo en Google Sheets.",
  },
  en: {
    metaTitle: "Demo · QR Events: attendance by artist",
    metaDescription: "See how an event counts how many people each artist or influencer brings: invitation with QR code, sign-up with a personal QR code and check-in at the door.",
    tag: "events and venues",
    title: "QR Events: how many people does each artist bring?",
    lead: "An artist creates their invitation and shares it on social media. Each follower signs up and gets a personal QR code. It's scanned at the door, so the event knows exactly how many people came for each artist.",
    howTitle: "How the real system works",
    how: [
      "The artist or influencer fills in a short form and gets a link and a QR code to post on TikTok, Instagram or their stories.",
      "Each follower signs up with name, email and phone, accepts the data privacy policy and gets a personal QR code on screen and by email.",
      "The QR code is per person, not per artist: it can't be shared, can't be used twice and can't be used at another event. The same email can only sign up once per invitation.",
      "At the door, staff log in with a password and scan with the phone camera (it picks the rear camera), from a photo, or by typing the code.",
      "Every check-in is stored with time and artist, and the dashboard shows live how many signed up and how many showed up for each one: the basis for paying commissions or rewarding top promoters.",
      "Everything is stored in Google Sheets, with no expensive licenses. Next modules: redeeming the perk at the bar, a dashboard for each artist and voting for attendees only.",
    ],
    note: "The artists, events and attendees in this demo are fictional. The demo runs in your browser; the real system uses the phone camera at the door and stores everything in Google Sheets.",
  },
  zh: {
    metaTitle: "演示 · 活动二维码：按艺人统计到场",
    metaDescription: "看看活动如何统计每位艺人或网红带来多少人：二维码邀请、个人二维码登记、入场扫码核验。",
    tag: "活动与场馆",
    title: "活动二维码：每位艺人带来多少人？",
    lead: "艺人创建邀请并在社交媒体上分享。每位粉丝登记后获得个人二维码。入场时扫码，活动方就能准确知道每位艺人带来了多少人。",
    howTitle: "真实系统如何运作",
    how: [
      "艺人或网红填写一张简短表单，获得可发布到 TikTok、Instagram 或快拍的链接和二维码。",
      "每位粉丝填写姓名、邮箱和手机号，同意数据隐私政策，然后在屏幕上和邮箱中收到个人二维码。",
      "二维码按人发放，而不是按艺人：不能转让，不能重复使用，也不能用于其他活动。同一邮箱在同一邀请下只能登记一次。",
      "入场时，工作人员凭密码登录，用手机摄像头扫码（自动选择后置摄像头），也可以通过照片或手动输入代码核验。",
      "每次入场都会记录时间和对应艺人，看板实时显示每位艺人的登记人数和到场人数：可作为支付佣金或奖励最佳推广者的依据。",
      "所有数据保存在 Google Sheets 中，无需昂贵的软件授权。后续模块：吧台兑换福利、艺人专属看板、仅限到场观众的投票。",
    ],
    note: "本演示中的艺人、活动和观众均为虚构。演示在您的浏览器中运行；真实系统在入场处使用手机摄像头，并将所有数据保存在 Google Sheets 中。",
  },
};

const GEO: Record<Lang, PageText> = {
  es: {
    metaTitle: "Demo · Enriquecimiento de datos con IA",
    metaDescription: "Noticias de geopolítica de 19 medios de todo el mundo, resumidas y clasificadas en vivo con IA: medio y país, protagonistas, países involucrados, tema, subtema y sentimiento.",
    tag: "datos en vivo",
    title: "Enriquecimiento de datos con IA",
    lead: "Texto suelto entra, tabla útil sale. Aquí lo hacemos con noticias reales de geopolítica: leemos medios de todo el mundo y la IA resume cada noticia y la clasifica por protagonistas, países, tema, subtema y sentimiento. Filtra la tabla o descárgala en CSV.",
    howTitle: "Cómo funciona",
    how: [
      "Fuentes: se leen los RSS de 19 medios de 18 países, de Occidente, Rusia, China, Medio Oriente y Latinoamérica. El país de cada medio está fijado a mano (no lo adivina la IA) y se marca si es público o estatal.",
      "Filtro: se toman las noticias de las últimas 48 horas y la IA descarta lo que no es geopolítica (sucesos locales, deportes, farándula).",
      "Enriquecimiento: para cada noticia se obtiene resumen (en español, inglés y chino), protagonistas, países involucrados (código ISO), tema de una lista fija, subtema, sentimiento y efecto en el riesgo de mercado.",
      "Validación: la respuesta de la IA se revisa contra la lista de temas y los códigos de país válidos; lo que no encaja se descarta en vez de inventarse.",
      "Resultado: una tabla que se puede filtrar y exportar a CSV o consumir como JSON. Se renueva cada hora.",
      "La misma técnica sirve para tus datos: reseñas de clientes, correos, tickets de soporte, encuestas abiertas o descripciones de productos, con las categorías que tu negocio necesite.",
    ],
    note: "La clasificación es automática y puede equivocarse; cada fila enlaza a la noticia original. Los titulares y resúmenes pertenecen a sus medios; aquí solo se muestran el título, un resumen breve y el enlace.",
  },
  en: {
    metaTitle: "Demo · AI data enrichment",
    metaDescription: "Geopolitical news from 19 outlets around the world, summarized and classified live with AI: outlet and country, key people, countries involved, topic, subtopic and sentiment.",
    tag: "live data",
    title: "AI data enrichment",
    lead: "Unstructured text in, a useful table out. Here we do it with real geopolitical news: we read outlets from around the world and AI summarizes each story and classifies it by key people, countries, topic, subtopic and sentiment. Filter the table or download it as CSV.",
    howTitle: "How it works",
    how: [
      "Sources: RSS feeds from 19 outlets in 18 countries, across the West, Russia, China, the Middle East and Latin America. Each outlet's country is set by hand (not guessed by AI) and state or public broadcasters are labeled.",
      "Filtering: news from the last 48 hours is collected and AI discards anything that isn't geopolitics (local crime, sports, entertainment).",
      "Enrichment: for each story we get a summary (in English, Spanish and Chinese), key people, countries involved (ISO code), a topic from a fixed list, a subtopic, sentiment and the likely effect on market risk.",
      "Validation: the AI's answer is checked against the topic list and valid country codes; anything that doesn't fit is dropped instead of made up.",
      "Output: a table you can filter and export to CSV or consume as JSON. It refreshes every hour.",
      "The same technique works on your data: customer reviews, emails, support tickets, open-ended surveys or product descriptions, with the categories your business needs.",
    ],
    note: "Classification is automatic and can be wrong; each row links to the original story. Headlines and summaries belong to their outlets; we only show the headline, a short summary and the link.",
  },
  zh: {
    metaTitle: "演示 · AI 数据增强",
    metaDescription: "来自全球 19 家媒体的地缘政治新闻，由 AI 实时摘要和分类：媒体及其所属国家、相关人物、涉及国家、主题、子主题和情感倾向。",
    tag: "实时数据",
    title: "AI 数据增强",
    lead: "输入零散文本，输出有用的表格。这里我们用真实的地缘政治新闻来演示：读取全球各地的媒体，由 AI 为每条新闻生成摘要，并按相关人物、国家、主题、子主题和情感倾向分类。可以筛选表格，也可以下载 CSV。",
    howTitle: "如何运作",
    how: [
      "来源：读取 18 个国家 19 家媒体的 RSS，覆盖西方、俄罗斯、中国、中东和拉丁美洲。每家媒体所属国家由人工设定（不由 AI 猜测），并标注是否为公共媒体或官方媒体。",
      "筛选：收集最近 48 小时的新闻，由 AI 剔除与地缘政治无关的内容（地方社会新闻、体育、娱乐）。",
      "增强：为每条新闻生成摘要（中文、英文和西班牙文）、相关人物、涉及国家（ISO 代码）、固定列表中的主题、子主题、情感倾向，以及对市场风险的可能影响。",
      "校验：AI 的结果会与主题列表和有效国家代码核对；不符合的内容直接丢弃，而不是凭空编造。",
      "输出：可筛选的表格，可导出为 CSV 或以 JSON 方式调用。每小时更新一次。",
      "同样的方法也适用于您的数据：客户评论、邮件、客服工单、开放式问卷或商品描述，分类方式按您的业务需求定制。",
    ],
    note: "分类由 AI 自动完成，可能出错；每一行都附有原文链接。标题和摘要版权归各媒体所有；本页仅显示标题、简短摘要和链接。",
  },
};

function meta(t: PageText, lang: Lang, path: string): Metadata {
  return { title: t.metaTitle, description: t.metaDescription, alternates: alternates(lang, path) };
}

export const qrMeta = (lang: Lang) => meta(QR[lang], lang, "/demos/pedidos-qr");
export const b2bMeta = (lang: Lang) => meta(B2B[lang], lang, "/demos/pedidos");
export const evMeta = (lang: Lang) => meta(EV[lang], lang, "/demos/qr-eventos");
export const geoMeta = (lang: Lang) => meta(GEO[lang], lang, "/demos/enriquecimiento");

function Shell({ t, lang, wide, children }: { t: PageText; lang: Lang; wide?: boolean; children: React.ReactNode }) {
  return (
    <DemoShell lang={lang} tag={t.tag} title={t.title} lead={t.lead} wide={wide} how={{ title: t.howTitle, items: t.how }} note={t.note}>
      {children}
    </DemoShell>
  );
}

export function QrPage({ lang }: { lang: Lang }) {
  return (
    <Shell t={QR[lang]} lang={lang} wide>
      <QrDemo lang={lang} />
    </Shell>
  );
}

export function B2bPage({ lang }: { lang: Lang }) {
  return (
    <Shell t={B2B[lang]} lang={lang}>
      <OrdersDemo lang={lang} />
    </Shell>
  );
}

export function EventosPage({ lang }: { lang: Lang }) {
  return (
    <Shell t={EV[lang]} lang={lang}>
      <EventosDemo lang={lang} />
    </Shell>
  );
}

export function GeoPage({ lang }: { lang: Lang }) {
  return (
    <Shell t={GEO[lang]} lang={lang} wide>
      <GeoDemo lang={lang} />
    </Shell>
  );
}
