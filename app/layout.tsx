import type { Metadata, Viewport } from 'next'
import { Inter, Sora } from 'next/font/google'

import './globals.css'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { LEISTENFARBE, THEME_STORAGE_KEY } from '@/lib/theme'
import { JsonLd } from '@/components/seo/JsonLd'
import { organizationSchema, webSiteSchema } from '@/lib/jsonld'
import { siteConfig, siteUrl } from '@/lib/site'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const sora = Sora({
  variable: '--font-sora',
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
    Zwei Farben nach Systemvorgabe – für den Fall ohne gespeicherte Wahl.

    Das deckt den ersten Besuch ab, und zwar bevor irgendein Script läuft. Wer
    schon einmal umgeschaltet hat, bekommt die passende Farbe vom Startskript
    nachgereicht; dort ist die Systemvorgabe nicht mehr maßgeblich.
  */
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: LEISTENFARBE.light },
    { media: '(prefers-color-scheme: dark)', color: LEISTENFARBE.dark },
  ],
  colorScheme: 'light dark',
}

/**
 * Setzt das Farbschema noch während des HTML-Parsings.
 *
 * Ohne dieses Script würde die Seite zuerst im Hellmodus gerendert und erst
 * nach der Hydration umgeschaltet – sichtbar als kurzes weißes Aufblitzen.
 *
 * ## Die Rangfolge
 *
 * 1. **Die eigene Wahl.** Wer den Umschalter benutzt hat, bekommt sie bei jedem
 *    weiteren Besuch auf demselben Gerät zurück – auch entgegen der
 *    Systemvorgabe. Sie steht im localStorage und wird zuerst gelesen.
 * 2. **Die Systemvorgabe.** Wer sein Gerät auf Dunkel gestellt hat – oft aus
 *    Lichtempfindlichkeit –, bekommt die Seite von Anfang an dunkel.
 * 3. **Hell.** Wer weder das eine noch das andere hat, sieht Weiß.
 *
 * `prefers-color-scheme` meldet nur „hell“ oder „dunkel“ und verrät nicht, ob
 * jemand das eingestellt oder nur nie angefasst hat. Für Punkt 2 und 3 ist das
 * ohne Belang: Wer nichts ändert, steht auf Hell.
 *
 * ## Warum das Skript auch die Browserleiste setzt
 *
 * Die Farbe im `<head>` folgt der Systemvorgabe. Bei einer gespeicherten Wahl,
 * die davon abweicht, wäre sie falsch – helle Leiste über dunkler Seite. Das
 * Skript korrigiert sie deshalb genau dann, wenn eine Wahl gespeichert ist.
 *
 * Dabei werden **beide** Meta-Angaben gesetzt, nicht nur die erste. Es gibt
 * zwei, je eine mit `media`-Bedingung, und der Browser nimmt die passende. Ein
 * `querySelector` trifft immer die helle; bei dunklem System und gespeicherter
 * Wahl „hell“ blieb dadurch die dunkle Leiste stehen – heller Inhalt, dunkler
 * Rahmen. Aufgefallen erst beim Durchspielen aller vier Fälle.
 */
const themeScript = `(function(){try{
var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
var dark=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);
document.documentElement.dataset.theme=dark?'dark':'light';
if(s){var f=dark?${JSON.stringify(LEISTENFARBE.dark)}:${JSON.stringify(LEISTENFARBE.light)};
document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.setAttribute('content',f)})}
}catch(e){}})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      data-theme="light"
      // Das Inline-Script verändert data-theme vor der Hydration.
      suppressHydrationWarning
      className={`${inter.variable} ${sora.variable} h-full antialiased`}
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
