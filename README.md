# Hayaku Lab · www.hayakulab.com

Sitio web de Hayaku Lab: automatización con IA para pymes. En español (`/`), inglés (`/en`) y chino simplificado (`/zh`), con un botón ES / EN / 中文 en el menú.

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
| Medios y temas de la demo de enriquecimiento | `lib/geo/outlets.ts`, `lib/geo/classify.ts` |
| Textos de la página de inicio (español e inglés) | `components/Home.tsx` (objeto `C`) |
| Textos de las páginas de demo (español e inglés) | `components/demo/DemoPages.tsx` |
| Textos dentro de cada demo | objeto `TX` al inicio de cada archivo en `components/demo/` |
| Menú, pie de página y botón de idioma | `components/Chrome.tsx`, `components/LangSwitch.tsx` |
| Colores y estilos (`:root` arriba) | `app/globals.css` |
| Menú de la demo QR | `components/demo/QrDemo.tsx` (`MENU`) |
| Datos de la demo B2B | `data/demo/lacteos.json` |
| Logo, favicon, imagen para redes | `public/logo-mark*.png`, `app/icon.png`, `app/opengraph-image.jpg` |

## Idiomas

- Español vive en `app/(es)/` y se sirve en la raíz; inglés en `app/(en)/en/` (bajo `/en`) y chino en `app/(zh)/zh/` (bajo `/zh`). Cada idioma tiene su propio layout raíz (para que `<html lang>` sea correcto).
- Las rutas de `app/` solo llaman a los componentes con `lang="es"`, `"en"` o `"zh"`: los textos de los tres idiomas están juntos en el mismo componente.
- En chino se usan las fuentes del sistema (PingFang, Microsoft YaHei, Noto Sans SC), porque Sora e IBM Plex no traen caracteres chinos. La factura PDF de la demo B2B sale en inglés en la versión china (las fuentes de jsPDF no tienen caracteres chinos).
- Al agregar una página nueva, crea la ruta en los tres grupos y agrégala a `app/sitemap.ts`.

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

- Poner el número de WhatsApp en `lib/site.ts` para que aparezcan los botones de WhatsApp.
- (Opcional) Crear un enlace de Cal.com/Calendly y ponerlo en `BOOKING_URL`; mientras tanto, "Diagnóstico gratis" abre un correo.
- Agregar más testimonios en `TESTIMONIALS` cuando haya.
