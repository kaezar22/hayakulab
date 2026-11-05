import type { Metadata } from "next";
import DemoShell from "@/components/demo/DemoShell";
import EventosDemo from "@/components/demo/EventosDemo";

export const metadata: Metadata = {
  title: "Demo · QR Eventos: asistencia por artista",
  description: "Prueba cómo un evento cuenta cuántas personas trae cada artista o influencer: invitación con QR, registro con QR personal y check-in en la puerta.",
  alternates: { canonical: "/demos/qr-eventos" },
};

export default function Page() {
  return (
    <DemoShell
      tag="eventos y venues"
      title="QR Eventos: ¿cuánta gente trae cada artista?"
      lead="Un artista crea su invitación y la comparte en redes. Cada seguidor se registra y recibe su QR personal. En la puerta se escanea y el evento sabe exactamente cuántas personas llegaron por cada artista."
      how={{
        title: "Cómo funciona el sistema real",
        items: [
          "El artista o influencer llena un formulario corto y recibe un link y un QR para publicar en TikTok, Instagram o sus historias.",
          "Cada seguidor se registra con nombre, correo y celular, acepta la política de tratamiento de datos (Ley 1581) y recibe un QR personal en pantalla y por correo.",
          "El QR es por persona, no por artista: no se puede compartir, no sirve dos veces y no se puede usar en otro evento. Un mismo correo solo se registra una vez por invitación.",
          "En la puerta, el portero entra con clave y escanea con la cámara del celular (elige la cámara trasera), desde una foto o escribiendo el código.",
          "Cada ingreso queda con hora y artista, y el tablero muestra en vivo cuántos se registraron y cuántos llegaron por cada uno: la base para pagar comisiones o premiar a quien más convoca.",
          "Todo queda en Google Sheets, sin licencias costosas. Siguientes módulos: canje del beneficio en barra, panel para cada artista y votaciones solo para asistentes.",
        ],
      }}
      note="Los artistas, eventos y asistentes de esta demo son ficticios. La demo corre en tu navegador; el sistema real usa la cámara del celular en la puerta y guarda todo en Google Sheets."
    >
      <EventosDemo />
    </DemoShell>
  );
}
