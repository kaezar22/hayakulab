import "@fontsource/sora/400.css";
import "@fontsource/sora/600.css";
import "@fontsource/sora/700.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@/app/globals.css";
import ChatWidget from "@/components/ChatWidget";
import type { Lang } from "@/lib/i18n";

/** <html> y <body> comunes a los dos idiomas (cada idioma tiene su layout raíz). */
export default function RootHtml({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={lang}>
      <body>
        {children}
        <ChatWidget lang={lang} />
      </body>
    </html>
  );
}
