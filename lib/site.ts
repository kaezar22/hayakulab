/**
 * Datos de contacto y textos que se repiten en el sitio.
 * Cambia aquí el correo, el WhatsApp o el enlace de agenda y se actualiza en todas partes.
 */

import type { Lang } from "./i18n";

export const SITE_URL = "https://www.hayakulab.com";
export const BRAND = "Hayaku Lab";

/** Correo de contacto. Revisa que el buzón exista en tu proveedor del dominio. */
export const EMAIL = "hello@hayakulab.com";

/**
 * Número de WhatsApp con indicativo y sin espacios ni "+", ej. "573001234567".
 * Mientras esté vacío, los botones de WhatsApp no se muestran.
 */
export const WHATSAPP = "";

/**
 * Enlace para agendar el diagnóstico (Cal.com o Calendly).
 * Mientras esté vacío, el botón abre un correo con el asunto ya escrito.
 */
export const BOOKING_URL = "";

export const LINKEDIN = "https://www.linkedin.com/in/cesar-salgado-274a2329/";

const BOOKING_TEXT: Record<Lang, { subject: string; body: string }> = {
  es: { subject: "Diagnóstico gratuito de automatización", body: "Hola, quiero agendar el diagnóstico gratuito.\n\nEmpresa:\nProceso que queremos automatizar:\n" },
  en: { subject: "Free automation assessment", body: "Hi, I'd like to book the free assessment.\n\nCompany:\nProcess we want to automate:\n" },
  zh: { subject: "免费自动化评估", body: "您好，我想预约免费评估。\n\n公司：\n希望自动化的流程：\n" },
};

export function bookingHref(lang: Lang = "es") {
  if (BOOKING_URL) return BOOKING_URL;
  const t = BOOKING_TEXT[lang];
  return `mailto:${EMAIL}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(t.body)}`;
}

const WA_TEXT: Record<Lang, string> = {
  es: "Hola Hayaku Lab, quiero automatizar un proceso de mi empresa.",
  en: "Hi Hayaku Lab, I'd like to automate a process in my company.",
  zh: "您好 Hayaku Lab，我想自动化公司的一个流程。",
};

export function whatsappHref(lang: Lang = "es") {
  return WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(WA_TEXT[lang])}` : "";
}

export const TESTIMONIALS = [
  {
    logo: "/nutrienti.png",
    client: "Nutrienti",
    quote:
      "Hayaku Lab nos ayudó a sacarle mucho más provecho a las herramientas de IA que ya teníamos. Además, automatizó tareas que antes tomaban horas en completarse y entregarse: con una herramienta a la medida que desarrolló para nosotros, ahora toman segundos.",
    role: "Cliente · Configuración de IA y automatización",
    stat: "Horas → segundos",
    statLabel: "en tareas que ahora resuelve una herramienta a la medida",
    // Versión en inglés (traducción del testimonio original en español).
    en: {
      quote:
        "Hayaku Lab helped us get much more out of the AI tools we already had. They also automated tasks that used to take hours to complete and deliver: with a custom tool they built for us, they now take seconds.",
      role: "Client · AI setup and automation",
      stat: "Hours → seconds",
      statLabel: "on tasks now handled by a custom tool",
      note: "Translated from Spanish",
    },
    // Versión en chino (traducción del testimonio original en español).
    zh: {
      quote:
        "Hayaku Lab 帮助我们把已有的 AI 工具用得更充分。他们还把过去需要数小时才能完成和交付的工作实现了自动化：借助他们为我们定制的工具，现在只需几秒钟。",
      role: "客户 · AI 配置与自动化",
      stat: "数小时 → 数秒",
      statLabel: "由定制工具完成的工作",
      note: "译自西班牙语",
    },
  },
  // Para agregar otro testimonio, copia el bloque de arriba (con sus versiones `en` y `zh`) y pon el logo en /public.
];
