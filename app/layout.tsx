import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

/*
  Die Display-Schrift kommt als Paket über npm und nicht über next/font:
  Diese Umgebung erreicht nur GitHub und npm, und next/font/google lädt beim
  Bauen von Google – das wäre hier ein 403. Die opsz-Fassung, weil Fraunces
  damit bei großen Graden die Zeichnung wechselt (optical sizing) – genau der
  Unterschied zwischen einer Textserifen und einer Schaugröße.
*/
import '@fontsource-variable/fraunces/opsz.css'

import './globals.css'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { OfflineLernen } from '@/components/layout/OfflineLernen'
import { startSkript } from '@/lib/theme'
import { JsonLd } from '@/components/seo/JsonLd'
import { organizationSchema, webSiteSchema } from '@/lib/jsonld'
import { siteConfig, siteUrl } from '@/lib/site'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  // Basis für alle relativen URLs in Metadaten (canonical, OG-Bilder, ...).
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} – Finanzwissen verständlich erklärt`,
    // Greift nur, wenn eine Seite ausnahmsweise keinen absoluten Titel setzt.
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: `${siteConfig.name} Redaktion` }],
  publisher: siteConfig.name,
  keywords: [
    'Finanzbildung',
    'Geldanlage lernen',
    'Börse für Anfänger',
    'ETF',
    'Zinseszins',
    'Altersvorsorge',
    'Finanzrechner',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  /*
    Der Nachrichten-Feed, für Newsreader auffindbar.

    Er steht im Wurzel-Layout und damit auf jeder Seite: Wer eine Website
    abonnieren will, klickt selten ausgerechnet auf der Nachrichtenübersicht
    auf das Symbol seines Newsreaders.
  */
  alternates: {
    types: {
      'application/rss+xml': [
        { url: '/feed.xml', title: `${siteConfig.name} – Nachrichten` },
      ],
    },
  },

  // Deutsche Telefonnummern und Datumsangaben nicht automatisch verlinken.
  formatDetection: { telephone: false, address: false, date: false },

  /*
    Name unter dem Symbol, wenn die Seite auf den Homescreen gelegt wird.

    Ohne diese Angabe nimmt Safari den Seitentitel – auf dem Homescreen stand
    dadurch „IM Invests – Finanzen verstehen, Fehler vermeiden“, abgeschnitten nach
    wenigen Zeichen. Unter einem Symbol ist Platz für zwei Wörter, nicht für
    einen Titel.

    Bewusst ohne `capable: true`: Das würde die Seite ohne Safari-Oberfläche
    starten, also ohne Zurück-Knopf und Adresszeile. Für eine Website mit über
    hundert Unterseiten wäre das ein Rückschritt.
  */
  appleWebApp: { title: siteConfig.name },
}

export const viewport: Viewport = {
  /*
    **Hier steht mit Absicht keine `themeColor`.**

    Sie wird ausschließlich vom Startskript gesetzt (`lib/theme.ts`), und das
    ist keine Sparsamkeit, sondern der einzige Weg, der auf dem Telefon trägt.

    ## Wie es dazu kam

    Am 13. August 2026 stand hier zuerst eine feste helle Farbe. Auf einem
    Gerät mit gewähltem dunklen Schema blieb der Bereich über der Seite
    dadurch beige – weißer Balken über schwarzer Seite. Zwei Anläufe, die
    Farbe nachträglich zu korrigieren, sind gescheitert:

        setAttribute('content', …)   Chromium: wirkt   Safari: wirkt nicht
        Knoten austauschen           Chromium: wirkt   Safari: wirkt nicht

    Beide Male nachgemessen, das zweite Mal am ausgelieferten Stand auf dem
    Gerät des Betreibers. Zwischenspeicher ließen sich als Ursache
    ausschließen: HTML geht mit `no-store` heraus (`public/.htaccess`), und
    der Dienstarbeiter fasst die Startseite nicht an.

    **Safari liest `theme-color` beim Parsen und danach nicht mehr.** Damit
    kann kein JavaScript die Angabe retten – ein statischer Export weiß aber
    nicht, welches Schema der Besucher gewählt hat.

    ## Warum das Weglassen die Lösung ist

    Ohne die Angabe färbt Safari den Bereich nach dem **Seitenhintergrund**,
    und der steht schon vor dem ersten Malen richtig: Das Startskript setzt
    `data-theme`, das CSS die Fläche. Hell wird beige, dunkel wird dunkel –
    ohne dass irgendjemand eine Meta-Angabe nachziehen müsste.

    Chromium bekommt seine Angabe trotzdem: Dort **wirkt** ein per Skript
    angelegter Knoten, nachgemessen. Beide Browser landen also richtig, jeder
    auf seinem Weg.

    Wer hier wieder eine `themeColor` einträgt, holt den Balken zurück.
  */

  /*
    `light`, nicht `light dark`.

    Die Angabe entscheidet, in welcher Farbe der Browser die Fläche malt, bevor
    das Stylesheet gelesen ist. `light dark` hieße „nimm, was der Nutzer
    eingestellt hat“ – auf einem dunkel gestellten Gerät also ein dunkles
    Aufblitzen vor einer weißen Seite.

    Für den dunklen Modus ist das ohne Belang: `[data-theme='dark']` in
    `app/globals.css` setzt `color-scheme: dark`, und die CSS-Eigenschaft sticht
    die Meta-Angabe.
  */
  colorScheme: 'light',
}

/*
  Setzt das Farbschema noch während des HTML-Parsings.

  Ohne dieses Script würde die Seite zuerst hell gerendert und erst nach der
  Hydration umgeschaltet – für den, der dunkel gewählt hat, ein weißes
  Aufblitzen bei jedem Seitenwechsel.

  Der Rumpf steht in `lib/theme.ts`, samt Begründung der Rangfolge. Dort ist er
  importierbar und damit prüfbar: `tests/farbschema-start.test.ts` lässt ihn
  gegen eine nachgebaute Umgebung laufen, in allen vier Fällen.
*/
const themeScript = startSkript()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      data-theme="weiss"
      // Das Inline-Script verändert data-theme vor der Hydration.
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        {/* Erster fokussierbarer Inhalt: Sprungmarke für Tastaturnutzer. */}
        <a
          href="#inhalt"
          className="focus:bg-brand focus:text-brand-contrast sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        >
          Direkt zum Inhalt springen
        </a>

        <OfflineLernen />
        <Header />

        <main id="inhalt" className="flex-1">
          {children}
        </main>

        <Footer />

        {/* Organisation und WebSite gelten für die ganze Domain. */}
        <JsonLd data={[organizationSchema(), webSiteSchema()]} />
      </body>
    </html>
  )
}
