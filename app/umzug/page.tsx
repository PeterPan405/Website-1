import type { Metadata } from 'next'
import Link from 'next/link'

import { Umzugskoffer } from '@/components/umzug/Umzugskoffer'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { buildMetadata, withBrand } from '@/lib/seo'

/**
 * Der Datenumzug – die Antwort auf „mehrere Geräte“ ohne Konto.
 *
 * Alles, was diese Website sich merkt, liegt im Browser des einen Geräts –
 * das ist das Versprechen von /keine-cookies, und dieser Weg hält es: eine
 * Datei statt eines Kontos. Die Abwägung (warum kein Login, was der Preis
 * ist) steht in `lib/umzug.ts` und am Merkaustausch der Merkliste.
 */

export const metadata: Metadata = buildMetadata({
  title: withBrand('Datenumzug: deinen Stand mitnehmen'),
  description:
    'Lernfortschritt, Merkliste, Vermögensübersicht und Einstellungen als Datei mitnehmen und am anderen Gerät einlesen – ohne Konto, alles bleibt bei dir.',
  path: '/umzug',
  ogTitle: 'Datenumzug ohne Konto',
})

export default function UmzugSeite() {
  return (
    <>
      <PageHeader
        area="learn"
        eyebrow="Deine Daten"
        eyebrowIcon="download"
        title="Deinen Stand mitnehmen"
        lead="Alles, was diese Website sich merkt, liegt im Browser dieses Geräts – nicht auf einem Server. Der Umzug auf ein neues Gerät ist deshalb eine Datei: hier herunterladen, dort einlesen. Kein Konto, kein Upload."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Datenumzug' }]} />}
      />

      <div className="fk-container py-12 sm:py-16">
        <Umzugskoffer />

        <section aria-labelledby="warum" className="mt-12 max-w-3xl">
          <h2 id="warum" className="text-fg text-2xl font-bold">
            Warum eine Datei und kein Konto
          </h2>
          <p className="text-fg-muted mt-4 leading-relaxed">
            Ein Konto würde bedeuten, dass auf einem Server steht, was du lernst, welche
            Aktien du beobachtest und was du besitzt. Das geht niemanden etwas an – am
            wenigsten den Betreiber dieser Website. Die Datei löst dasselbe Problem, ohne
            das{' '}
            <Link href="/keine-cookies" className="hover:text-brand underline">
              Keine-Cookies-Versprechen
            </Link>{' '}
            zu brechen: Sie entsteht in deinem Browser, du trägst sie selbst zum nächsten
            Gerät, und kein Server sieht je ein Byte davon.
          </p>
          <p className="text-fg-muted mt-4 leading-relaxed">
            Der ehrliche Preis: Es gibt keinen automatischen Abgleich. Wer auf zwei
            Geräten arbeitet, muss den Umzug anstoßen – so wie man einen Ordner mitnimmt,
            statt ihn im Büro zu lassen. Und weil die Datei deine Vermögensübersicht
            enthalten kann, gehört sie in deine Ablage, nicht in einen Chat oder eine
            ungesicherte Cloud.
          </p>
        </section>
      </div>
    </>
  )
}
