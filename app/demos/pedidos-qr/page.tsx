import type { Metadata } from "next";
import DemoShell from "@/components/demo/DemoShell";
import QrDemo from "@/components/demo/QrDemo";

export const metadata: Metadata = {
  title: "Demo · Pedidos por código QR",
  description: "Prueba cómo un bar recibe pedidos desde el QR de cada mesa y avisa al cliente cuando su pedido está listo.",
  alternates: { canonical: "/demos/pedidos-qr" },
};

export default function Page() {
  return (
    <DemoShell
      tag="bares y restaurantes"
      title="Pedidos por código QR"
      lead="A la izquierda, el celular de un cliente en la mesa 7. A la derecha, la pantalla del bar. Pide algo, envíalo y luego muévelo en el tablero hasta “Listo”: el celular sonará y vibrará."
      wide
      how={{
        title: "Cómo funciona el sistema real",
        items: [
          "Cada mesa tiene su propio QR impreso. Al escanearlo se abre el menú de esa mesa, sin descargar ninguna app.",
          "El cliente elige, escribe su nombre y envía. El pedido aparece en el tablero del bar al instante, sin recargar la página.",
          "El bar mueve cada pedido de Nuevos a Preparando y a Listo. Al marcarlo listo, el celular del cliente suena, vibra y muestra el aviso.",
          "El bar marca los productos agotados, ve quién pidió mesero y lleva el control de pagado / por cobrar.",
          "Los precios y totales los calcula el servidor, nunca el navegador. Se puede conectar pago en línea con Wompi, Mercado Pago o ePayco.",
          "Tecnología: Next.js en Vercel y Supabase (Postgres + tiempo real). Funciona en cualquier celular.",
        ],
      }}
      note="Bar La Esquina es un negocio ficticio. Esta demo corre completa en tu navegador; en el sistema real el celular y el bar son dispositivos distintos conectados en tiempo real."
    >
      <QrDemo />
    </DemoShell>
  );
}
