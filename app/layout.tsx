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
import { LEISTENFARBE, startSkript } from '@/lib/theme'
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
    Zwei Angaben, nach Systemvorgabe – der einzige Weg, der beim Parsen schon
    weiß, was zu tun ist.

    ## Was gemessen ist, nach vier Anläufen

    | Lage                                   | Safari          |
    | -------------------------------------- | --------------- |
    | keine Angabe im HTML                    | malt schwarz    |
    | feste Angabe im HTML                    | nimmt sie       |
    | Skript ändert sie danach (setAttribute) | ignoriert       |
    | Skript tauscht den Knoten aus           | ignoriert       |

    Alle vier am Gerät des Betreibers nachgesehen, der letzte am 17. August
    2026: helle Angabe im HTML, Seite auf Dunkel gestellt – beiger Balken über
    schwarzer Seite, obwohl das Skript den Knoten abgeändert hatte.

    **Safari friert den Wert beim Parsen ein.** Die Wahl des Besuchers steht
    aber erst danach fest, aus dem `localStorage`. Solange die Farbe von dieser
    Wahl abhängt, ist sie in Safari nicht zu erreichen – gleich, wie geschickt
    man es anstellt.

    ## Also hängt sie nicht mehr an der Wahl

    `media` wertet der Browser beim Parsen aus und danach weiter. Die
    Systemvorgabe des Geräts kennt er zu diesem Zeitpunkt; die gespeicherte
    Wahl kennt er nie.

    Damit folgt der Balken dem **Gerät**, nicht der Schaltfläche. Beide Browser
    verhalten sich gleich, und keiner braucht eine Zeile JavaScript dafür –
    weshalb `lib/theme.ts` die Farbe seither auch nicht mehr anfasst.

    ## Was das kostet

    Wer sein Telefon hell stellt und die Website auf Dunkel schaltet, bekommt
    einen hellen Balken über dunkler Seite. Umgekehrt ebenso.

    Das ist der Rest, der bleibt, und er ist gegen die Alternativen abgewogen:
    Ohne `media` ist der Balken entweder **immer** schwarz oder **immer** hell.
    Mit `media` stimmt er, solange Gerät und Wahl zusammenpassen – und das ist
    der Normalfall, weil ein dunkel gestelltes Gerät und ein dunkel gewähltes
    Aussehen dieselbe Vorliebe sind.

    Der erste Besuch bleibt trotzdem **weiß**, auch auf einem dunklen Gerät
    (`startSkript()`). Genau dieser Fall ist der Preis; er trifft einmal und
    verschwindet mit der ersten Wahl.
  */
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: LEISTENFARBE.weiss },
    { media: '(prefers-color-scheme: dark)', color: LEISTENFARBE.dark },
  ],

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
