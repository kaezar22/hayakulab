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
      "Enriquecimiento: para cada noticia se obtiene resumen (en español e inglés), protagonistas, países involucrados (código ISO), tema de una lista fija, subtema, sentimiento y efecto en el riesgo de mercado.",
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
      "Enrichment: for each story we get a summary (in English and Spanish), key people, countries involved (ISO code), a topic from a fixed list, a subtopic, sentiment and the likely effect on market risk.",
      "Validation: the AI's answer is checked against the topic list and valid country codes; anything that doesn't fit is dropped instead of made up.",
      "Output: a table you can filter and export to CSV or consume as JSON. It refreshes every hour.",
      "The same technique works on your data: customer reviews, emails, support tickets, open-ended surveys or product descriptions, with the categories your business needs.",
    ],
    note: "Classification is automatic and can be wrong; each row links to the original story. Headlines and summaries belong to their outlets; we only show the headline, a short summary and the link.",
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
