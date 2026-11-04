/**
 * Datos de contacto y textos que se repiten en el sitio.
 * Cambia aquí el correo, el WhatsApp o el enlace de agenda y se actualiza en todas partes.
 */

export const SITE_URL = "https://www.hayakulab.com";
export const BRAND = "Hayaku Lab";

/** Correo de contacto. Revisa que el buzón exista en tu proveedor del dominio. */
export const EMAIL = "hola@hayakulab.com";

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

export function bookingHref() {
  if (BOOKING_URL) return BOOKING_URL;
  const subject = encodeURIComponent("Diagnóstico gratuito de automatización");
  const body = encodeURIComponent(
    "Hola, quiero agendar el diagnóstico gratuito.\n\nEmpresa:\nProceso que queremos automatizar:\n",
  );
  return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

export function whatsappHref(text = "Hola Hayaku Lab, quiero automatizar un proceso de mi empresa.") {
  return WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}` : "";
}

export const TESTIMONIALS = [
  {
    logo: "/nutrienti.png",
    client: "Nutrienti",
    quote:
      "César nos ayudó a sacarle mucho más provecho a las herramientas de IA que ya teníamos. Además, automatizó tareas que antes tomaban horas en completarse y entregarse: con una herramienta a la medida que desarrolló para nosotros, ahora toman segundos.",
    role: "Cliente · Configuración de IA y automatización",
    stat: "Horas → segundos",
    statLabel: "en tareas que ahora resuelve una herramienta a la medida",
  },
  // Para agregar otro testimonio, copia el bloque de arriba y pon el logo en /public.
];
