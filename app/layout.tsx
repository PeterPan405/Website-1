import type { Metadata, Viewport } from 'next'
import { Inter, Sora } from 'next/font/google'

import './globals.css'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { THEME_STORAGE_KEY } from '@/components/layout/ThemeToggle'
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
    dadurch „IM Invests – Geld verstehen, statt raten“, abgeschnitten nach
    wenigen Zeichen. Unter einem Symbol ist Platz für zwei Wörter, nicht für
    einen Titel.

    Bewusst ohne `capable: true`: Das würde die Seite ohne Safari-Oberfläche
    starten, also ohne Zurück-Knopf und Adresszeile. Für eine Website mit über
    hundert Unterseiten wäre das ein Rückschritt.
  */
  appleWebApp: { title: siteConfig.name },
}

export const viewport: Viewport = {
  // Passend zur Canvas-Farbe je Modus, damit die Browserleiste mitläuft.
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f8fc' },
    { media: '(prefers-color-scheme: dark)', color: '#060911' },
  ],
  colorScheme: 'light dark',
}

/**
 * Setzt das Farbschema noch während des HTML-Parsings.
 *
 * Ohne dieses Script würde die Seite zuerst im Hellmodus gerendert und erst
 * nach der Hydration umgeschaltet – sichtbar als kurzes weißes Aufblitzen.
 */
const themeScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});var dark=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=dark?'dark':'light'}catch(e){}})()`

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
