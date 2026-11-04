import type { Metadata } from "next";
import DemoShell from "@/components/demo/DemoShell";
import OrdersDemo from "@/components/demo/OrdersDemo";

export const metadata: Metadata = {
  title: "Demo · Pedidos B2B con facturación",
  description: "Prueba cómo un distribuidor recibe pedidos en línea, reconoce al cliente aunque escriba mal su nombre, aplica su lista de precios y genera la factura.",
  alternates: { canonical: "/demos/pedidos" },
};

export default function Page() {
  return (
    <DemoShell
      tag="distribuidores"
      title="Pedidos B2B con facturación"
      lead="Lácteos Agua Clara, un distribuidor ficticio, recibe pedidos de restaurantes. Haz un pedido como restaurante (escribe el nombre como quieras) y mira cómo el back office lo cruza con el cliente correcto, le pone precios y genera la factura."
      how={{
        title: "Cómo funciona el sistema real",
        items: [
          "Los puntos de venta piden desde un enlace, sin ver precios. Cada línea queda registrada al instante en la hoja o base de datos del distribuidor.",
          "El nombre que escribe el restaurante se cruza automáticamente con la razón social, el NIT y la lista de precios. Si la similitud es baja, lo marca para revisión en vez de adivinar.",
          "Solo se pueden escoger fechas de entrega que coinciden con los días reales de despacho.",
          "El back office ve todos los pedidos con su estado, descarga la factura en PDF y un Excel con todas las líneas para su ERP.",
          "El restaurante confirma la recepción y queda medido el tiempo real de entrega.",
          "Basado en el sistema que usa Nutrienti a diario, conectado a Google Sheets y a su maestro de clientes.",
        ],
      }}
      note="Lácteos Agua Clara S.A.S. es una empresa ficticia; todos los clientes, precios y NIT de esta página son inventados. Tus pedidos de prueba se guardan solo en tu navegador."
    >
      <OrdersDemo />
    </DemoShell>
  );
}
