# Hayaku Lab · www.hayakulab.com

Sitio web de Hayaku Lab: automatización con IA para pymes.

- **Inicio** (`/`): hero, servicios, demos, testimonios, proceso, preguntas frecuentes y contacto.
- **Demo Pedidos por QR** (`/demos/pedidos-qr`): celular del cliente + tablero del bar, todo en el navegador (basado en `gigs/qr_space`).
- **Demo Pedidos B2B** (`/demos/pedidos`): pedido del restaurante → cruce de cliente, precios, factura PDF y Excel (basado en el sistema de Nutrienti).
- **Asistente** (botón abajo a la derecha): chatbot con DeepSeek que responde sobre Hayaku Lab.

Stack: Next.js 16 (App Router), React 19, TypeScript. Sin base de datos: las demos corren en el navegador.

## Dónde cambiar cosas

| Qué | Archivo |
|---|---|
| Correo, WhatsApp, enlace de agenda, testimonios | `lib/site.ts` |
| Lo que sabe el chatbot (servicios, precios, contacto) | `lib/knowledge.ts` |
| Instrucciones y límites del chatbot | `app/api/chat/route.ts` |
| Textos de la página de inicio | `app/page.tsx` |
| Colores y estilos (`:root` arriba) | `app/globals.css` |
| Menú de la demo QR | `components/demo/QrDemo.tsx` (`MENU`) |
| Datos de la demo B2B | `data/demo/lacteos.json` |
| Logo, favicon, imagen para redes | `public/logo-mark*.png`, `app/icon.png`, `app/opengraph-image.jpg` |

## Correr en tu computador

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>. El chatbot necesita `DEEPSEEK_API_KEY` en `.env.local`
(ya está creado con la misma llave de `profilechat-web`; nunca se sube a git).

## Publicar en Vercel con www.hayakulab.com

1. Sube el repo a GitHub:
   ```bash
   git remote add origin https://github.com/<tu-usuario>/hayakulab-website.git
   git push -u origin main
   ```
2. En <https://vercel.com/new> importa el repo (detecta Next.js solo).
3. En **Environment Variables** agrega `DEEPSEEK_API_KEY`.
4. **Deploy**.
5. En **Settings → Domains** agrega `www.hayakulab.com` y `hayakulab.com` (marca que `hayakulab.com` redirija a `www`).
   Vercel te muestra los registros DNS para poner en tu proveedor del dominio:
   - `www` → **CNAME** `cname.vercel-dns.com`
   - `@` (raíz) → **A** `76.76.21.21`
   El certificado HTTPS se crea solo.

Cada `git push` a `main` vuelve a publicar el sitio.

## Pendientes

- Confirmar que el correo `hola@hayakulab.com` existe (o cambiarlo en `lib/site.ts`).
- Poner el número de WhatsApp en `lib/site.ts` para que aparezcan los botones de WhatsApp.
- (Opcional) Crear un enlace de Cal.com/Calendly y ponerlo en `BOOKING_URL`; mientras tanto, "Diagnóstico gratis" abre un correo.
- Agregar más testimonios en `TESTIMONIALS` cuando haya.
