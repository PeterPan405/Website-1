import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { buildMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Kontakt zur Redaktion | Finanzkompass',
  description:
    'Fachliche Korrekturen, Themenwünsche und Fragen zur Plattform: So erreichst du die Redaktion von Finanzkompass.',
  path: '/kontakt',
  ogTitle: 'Kontakt zur Redaktion',
})

export default function ContactPage() {
  return (
    <>
      <PageHeader
        area="learn"
        eyebrow="Kontakt"
        eyebrowIcon="mail"
        title="Schreib uns"
        lead="Fachliche Korrekturen, Themenwünsche, Hinweise auf Fehler – alles willkommen. Besonders bei Steuer- und Rechtsthemen, wo sich Regeln regelmäßig ändern."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Kontakt' }]} />}
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="max-w-2xl">
            <section aria-labelledby="per-mail" className="fk-card p-6 sm:p-8">
              <h2 id="per-mail" className="text-fg text-xl font-semibold">
                Per E-Mail
              </h2>
              <p className="text-fg-muted mt-3 leading-relaxed">
                Der direkte Weg zur Redaktion. Wir antworten in der Regel innerhalb
                weniger Werktage.
              </p>
              {/*
                Die Adresse steht bewusst nicht im Button: Eine E-Mail-Adresse
                enthält keine Umbruchstellen und würde als unteilbares Wort auf
                schmalen Bildschirmen die ganze Seite in die Breite ziehen.
                Deshalb kurzer Button plus separat umbrechbare Adresse.
              */}
              <p className="mt-5">
                <a href={`mailto:${siteConfig.contactEmail}`} className="fk-btn-primary">
                  <Icon name="mail" className="size-4" />
                  E-Mail schreiben
                </a>
              </p>
              <p className="text-fg-muted mt-3 text-sm">
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="hover:text-brand font-medium break-all underline transition"
                >
                  {siteConfig.contactEmail}
                </a>
              </p>
              <p className="text-fg-subtle mt-4 text-xs">
                Platzhalter-Adresse – vor der Veröffentlichung durch eine echte,
                erreichbare Adresse ersetzen.
              </p>
            </section>

            <section aria-labelledby="hilfreich" className="mt-8">
              <h2 id="hilfreich" className="text-fg text-xl font-semibold">
                Was uns hilft
              </h2>
              <ul className="text-fg-muted mt-4 space-y-3">
                {[
                  {
                    title: 'Bei Korrekturen',
                    text: 'Die URL der Seite und möglichst die betroffene Textstelle. Wenn du eine Quelle hast: gerne mitschicken – das verkürzt die Prüfung erheblich.',
                  },
                  {
                    title: 'Bei Themenwünschen',
                    text: 'Was genau unklar ist. „Erklär mal ETFs“ ist schwer zu beantworten, „Warum ist ein Krypto-ETP kein ETF?“ dagegen sehr gut.',
                  },
                  {
                    title: 'Bei technischen Problemen',
                    text: 'Browser, Gerät und was du erwartet hättest. Ein Screenshot hilft fast immer.',
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3 leading-relaxed">
                    <Icon name="check" className="text-brand mt-1 size-4 shrink-0" />
                    <span>
                      <strong className="text-fg font-semibold">{item.title}:</strong>{' '}
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-8">
              <Callout variant="warning" title="Keine Einzelfallberatung">
                <p>
                  Wir können und dürfen keine Anlage-, Steuer- oder Rechtsberatung im
                  Einzelfall geben – dafür braucht es eine Zulassung und die Kenntnis
                  deiner vollständigen Situation. Fragen der Form „Soll ich X kaufen?“
                  oder „Wie viel muss ich sparen?“ müssen wir deshalb unbeantwortet
                  lassen.
                </p>
                <p>
                  Was wir gerne machen: erklären, wie ein Mechanismus funktioniert, damit
                  du die Frage selbst beantworten kannst. Für konkrete Entscheidungen sind
                  eine Honorarberatung, die Verbraucherzentralen oder – bei Steuerfragen –
                  eine Steuerberatung die richtigen Adressen.
                </p>
              </Callout>
            </div>

            <div className="mt-8">
              <Callout variant="info" title="Warum hier kein Formular steht">
                <p>
                  Ein Kontaktformular braucht eine serverseitige Verarbeitung, Spam-Schutz
                  und eine datenschutzrechtliche Grundlage für die Übermittlung. Solange
                  diese Plattform vollständig statisch ausgeliefert wird, wäre ein
                  Formular entweder wirkungslos oder es würde Daten an einen Drittanbieter
                  senden, ohne dass das hier dokumentiert wäre.
                </p>
                <p>
                  Ein direkter E-Mail-Link ist in dieser Situation die ehrlichere Lösung:
                  Du siehst, wohin die Nachricht geht.
                </p>
              </Callout>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <section aria-labelledby="rechtliches" className="fk-card p-6">
              <h2 id="rechtliches" className="text-fg text-base font-semibold">
                Rechtliches
              </h2>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/impressum"
                    className="text-fg hover:bg-surface-muted hover:text-brand flex items-center gap-2 rounded-xl p-2.5 text-sm font-medium transition"
                  >
                    <Icon name="info" className="text-fg-subtle size-4" />
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link
                    href="/datenschutz"
                    className="text-fg hover:bg-surface-muted hover:text-brand flex items-center gap-2 rounded-xl p-2.5 text-sm font-medium transition"
                  >
                    <Icon name="shield" className="text-fg-subtle size-4" />
                    Datenschutzerklärung
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ueber-uns"
                    className="text-fg hover:bg-surface-muted hover:text-brand flex items-center gap-2 rounded-xl p-2.5 text-sm font-medium transition"
                  >
                    <Icon name="compass" className="text-fg-subtle size-4" />
                    Über uns
                  </Link>
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </>
  )
}
