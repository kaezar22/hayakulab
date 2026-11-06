import type { Metadata } from "next";
import DemoShell from "@/components/demo/DemoShell";
import GeoDemo from "@/components/demo/GeoDemo";

export const metadata: Metadata = {
  title: "Demo · Enriquecimiento de datos con IA",
  description:
    "Noticias de geopolítica de 19 medios de todo el mundo, resumidas y clasificadas en vivo con IA: medio y país, protagonistas, países involucrados, tema, subtema y sentimiento.",
  alternates: { canonical: "/demos/enriquecimiento" },
};

export default function Page() {
  return (
    <DemoShell
      tag="datos en vivo"
      title="Enriquecimiento de datos con IA"
      lead="Texto suelto entra, tabla útil sale. Aquí lo hacemos con noticias reales de geopolítica: leemos medios de todo el mundo y la IA resume cada noticia y la clasifica por protagonistas, países, tema, subtema y sentimiento. Filtra la tabla o descárgala en CSV."
      wide
      how={{
        title: "Cómo funciona",
        items: [
          "Fuentes: se leen los RSS de 19 medios de 18 países, de Occidente, Rusia, China, Medio Oriente y Latinoamérica. El país de cada medio está fijado a mano (no lo adivina la IA) y se marca si es público o estatal.",
          "Filtro: se toman las noticias de las últimas 48 horas y la IA descarta lo que no es geopolítica (sucesos locales, deportes, farándula).",
          "Enriquecimiento: para cada noticia se obtiene resumen en español, protagonistas, países involucrados (código ISO), tema de una lista fija, subtema, sentimiento y efecto en el riesgo de mercado.",
          "Validación: la respuesta de la IA se revisa contra la lista de temas y los códigos de país válidos; lo que no encaja se descarta en vez de inventarse.",
          "Resultado: una tabla que se puede filtrar y exportar a CSV o consumir como JSON. Se renueva cada hora.",
          "La misma técnica sirve para tus datos: reseñas de clientes, correos, tickets de soporte, encuestas abiertas o descripciones de productos, con las categorías que tu negocio necesite.",
        ],
      }}
      note="La clasificación es automática y puede equivocarse; cada fila enlaza a la noticia original. Los titulares y resúmenes pertenecen a sus medios; aquí solo se muestran el título, un resumen breve y el enlace."
    >
      <GeoDemo />
    </DemoShell>
  );
}
