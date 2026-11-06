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

export function bookingHref(lang: Lang = "es") {
  if (BOOKING_URL) return BOOKING_URL;
  const subject = encodeURIComponent(lang === "en" ? "Free automation assessment" : "Diagnóstico gratuito de automatización");
  const body = encodeURIComponent(
    lang === "en"
      ? "Hi, I'd like to book the free assessment.\n\nCompany:\nProcess we want to automate:\n"
      : "Hola, quiero agendar el diagnóstico gratuito.\n\nEmpresa:\nProceso que queremos automatizar:\n",
  );
  return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

export function whatsappHref(lang: Lang = "es") {
  const text = lang === "en" ? "Hi Hayaku Lab, I'd like to automate a process in my company." : "Hola Hayaku Lab, quiero automatizar un proceso de mi empresa.";
  return WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}` : "";
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
  },
  // Para agregar otro testimonio, copia el bloque de arriba (con su versión `en`) y pon el logo en /public.
];
