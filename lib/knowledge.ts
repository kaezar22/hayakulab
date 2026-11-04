/**
 * Lo que sabe el asistente del sitio sobre Hayaku Lab.
 * Se envía completo al modelo en cada pregunta. Actualízalo cuando cambien los servicios.
 */
import { EMAIL, WHATSAPP } from "./site";

export const KNOWLEDGE = `
# Hayaku Lab
Hayaku Lab es un estudio de automatización de procesos con inteligencia artificial para pymes, con base en Bogotá, Colombia, que trabaja con empresas de toda Latinoamérica de forma remota. "Hayaku" (早く) significa "rápido" en japonés: la idea es que los procesos funcionen solos y más rápido. Sitio web: www.hayakulab.com.

Fundador: César Salgado, ingeniero industrial (Universidad Nacional de Colombia) con más de 7 años en datos, automatización e IA. Trabaja actualmente como Customer Insights Analyst en StoneX, donde construyó un motor con LLM que perfila 53.000 clientes corporativos y redujo un proceso de semanas o meses (hecho a mano por un equipo de 5 personas) a 4 días. Antes trabajó en el Fondo Colombia en Paz (Ministerio de Ambiente), KpitalLink (Miami) y GMC Asia en China. Habla español, inglés y chino mandarín.

# Qué hacemos
1. Pedidos y ventas automatizados: menús con código QR para bares y restaurantes (el cliente pide desde la mesa y el bar recibe el pedido al instante), portales de pedidos B2B para distribuidores (el cliente escribe su nombre como quiera y el sistema lo cruza con su razón social, NIT y lista de precios, y deja el pedido listo para facturar).
2. Integraciones entre sistemas: conectamos ERP (World Office, Siigo), Google Sheets, Excel, Shopify y APIs para que los datos no se copien a mano.
3. Asistentes y chatbots con IA: chatbots para la web o para el equipo interno que responden con la información de la empresa, lectura automática de facturas y documentos PDF.
4. Reportes y tableros automáticos: dashboards en Power BI o Streamlit, reportes que se generan y envían solos, alertas por correo.
5. Configuración y capacitación en herramientas de IA: ayudamos al equipo a sacar más provecho de las herramientas de IA que ya tiene.

# Demos en el sitio
- Pedidos por QR (/demos/pedidos-qr): simulación del celular del cliente y el tablero del bar. El cliente escanea el QR de la mesa, pide, y cuando el bar marca "listo" su celular suena y vibra. Incluye botón para llamar al mesero y control de pagado/por cobrar. El sistema real usa Next.js, Supabase en tiempo real y está listo para pasarelas de pago colombianas (Wompi, Mercado Pago, ePayco).
- Pedidos B2B (/demos/pedidos): un distribuidor de lácteos ficticio. El restaurante hace el pedido sin ver precios; el back office cruza automáticamente el nombre escrito con el cliente correcto, aplica su lista de precios, marca lo que hay que revisar y genera la factura en PDF y un Excel con todas las líneas. Está basado en el sistema real que usa Nutrienti.

# Clientes y resultados
Nutrienti (distribuidor de alimentos en Bogotá): configuramos sus herramientas de IA y automatizamos tareas que tomaban horas; con una herramienta a la medida ahora toman segundos. Incluye su sistema de pedidos web con confirmación de recepción, cruce automático de clientes con razón social y NIT, y registro en Google Sheets.

# Cómo empezar
Ofrecemos un diagnóstico gratuito de 45 minutos por videollamada sobre un proceso que el equipo hace a mano: mapeamos quién hace qué, en qué sistema y cuántas horas por semana; decimos qué se puede automatizar, qué no y cuánto costaría aproximadamente; y en 48 horas la empresa recibe un plan de una página, contrate o no. Luego construimos en entregas cortas (normalmente semanas, no meses) y acompañamos la puesta en marcha.
Precios: cada proyecto se cotiza después del diagnóstico según su alcance; no hay tarifas publicadas.
Contacto: correo ${EMAIL}${WHATSAPP ? `, WhatsApp +${WHATSAPP}` : ""}, o el botón "Diagnóstico gratis" del sitio.
`;
