import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { Icon, type IconName } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { buildMetadata, withBrand } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: withBrand(`Über uns: Wofür ${siteConfig.name} steht`),
  description:
    'Warum diese Plattform Mechanismen erklärt statt Produkte zu empfehlen, wie Inhalte entstehen und wie wir mit Annahmen, Risiken und Unsicherheit umgehen.',
  path: '/ueber-uns',
  ogTitle: `Wofür ${siteConfig.name} steht`,
})

const principles: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'book',
    title: 'Mechanismen statt Empfehlungen',
    text: 'Wir erklären, wie etwas funktioniert, und nennen keine konkreten Produkte. Wer den Mechanismus versteht, kann Angebote selbst beurteilen – das ist haltbarer als jede Empfehlung.',
  },
  {
    icon: 'calculator',
    title: 'Formeln offenlegen',
    text: 'Jeder Rechner zeigt seine Formel und benennt seine Annahmen. Ein Ergebnis ohne Methodik ist nicht überprüfbar und damit wertlos.',
  },
  {
    icon: 'warning',
    title: 'Risiken so deutlich wie Chancen',
    text: 'Wo Verluste möglich sind, steht das dabei – nicht im Kleingedruckten. Renditeversprechen gibt es hier nicht, weil niemand sie halten kann.',
  },
  {
    icon: 'layers',
    title: 'Drei Stufen, die weitergehen',
    text: 'Die Profi-Stufe wiederholt nicht die Grundlagen mit anderen Worten, sondern behandelt Kennzahlen, Sonderfälle, Steueraspekte und Bewertungsfragen.',
  },
  {
    icon: 'shield',
    title: 'Keine Datensammlung',
    text: 'Rechnereingaben und Lernfortschritt bleiben im Browser. Es gibt kein Konto, kein Tracking und keine Weitergabe an Dritte.',
  },
  {
    icon: 'info',
    title: 'Unsicherheit benennen',
    text: 'Wo eine Aussage von Annahmen abhängt, stehen die Annahmen dabei. Wo eine Frage steuerlich oder rechtlich wird, verweisen wir auf fachlichen Rat statt zu raten.',
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        area="learn"
        eyebrow="Über uns"
        eyebrowIcon="compass"
        title="Finanzwissen ohne Verkaufsabsicht"
        lead={`${siteConfig.name} erklärt, wie Geldanlage, Börse und Vorsorge funktionieren – in drei Stufen, mit offengelegten Rechenwegen und ohne Produktempfehlungen.`}
        breadcrumbs={<Breadcrumbs items={[{ name: 'Über uns' }]} />}
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="max-w-3xl">
          <h2 className="text-fg text-2xl font-bold">Warum diese Plattform existiert</h2>
          <p className="text-fg-muted mt-4 leading-relaxed">
            Finanzinformationen sind reichlich vorhanden – aber selten neutral. Wer
            erklärt, hat meistens etwas zu verkaufen: einen Fonds, eine Versicherung, ein
            Depot, ein Abonnement. Das macht Inhalte nicht automatisch falsch, aber es
            verschiebt, was betont und was weggelassen wird.
          </p>
          <p className="text-fg-muted mt-4 leading-relaxed">
            Diese Plattform verkauft nichts. Daraus folgt eine andere Gewichtung: Kosten
            sind hier ein Hauptthema statt einer Fußnote, Risiken stehen neben den
            Chancen, und wo ein verbreitetes Argument nicht trägt, sagen wir das – auch
            wenn es unspektakulärer klingt.
          </p>

          <h2 className="text-fg mt-12 text-2xl font-bold">Sechs Grundsätze</h2>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle) => (
            <li key={principle.title} className="fk-card h-full p-6">
              <span className="bg-brand-soft text-brand flex size-10 items-center justify-center rounded-xl">
                <Icon name={principle.icon} className="size-5" />
              </span>
              <h3 className="text-fg mt-4 font-semibold">{principle.title}</h3>
              <p className="text-fg-muted mt-2 text-sm leading-relaxed">
                {principle.text}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-14 max-w-3xl">
          <h2 className="text-fg text-2xl font-bold">Wie die Inhalte entstehen</h2>
          <p className="text-fg-muted mt-4 leading-relaxed">
            Jedes Thema wird in drei Stufen aufgebaut, die sich inhaltlich nicht
            überschneiden. Zuerst entsteht die Gliederung aller drei Stufen – erst danach
            der Fließtext. Dadurch ist von Anfang an klar, welche Inhalte auf welcher
            Stufe gehören und was bewusst ausgeklammert bleibt.
          </p>
          <p className="text-fg-muted mt-4 leading-relaxed">
            Derzeit sind die Themen{' '}
            <strong className="text-fg font-semibold">Aktie</strong> und{' '}
            <strong className="text-fg font-semibold">Zinseszins</strong> vollständig
            ausformuliert. Die übrigen 20 Themen haben eigene Seiten mit Gliederung; der
            Text wird Thema für Thema ergänzt. Der Stand ist auf jeder betroffenen Seite
            gekennzeichnet – wir halten es für ehrlicher, den Bearbeitungsstand zu zeigen,
            als leere Seiten zu verstecken.
          </p>

          <div className="mt-8">
            <Callout variant="warning" title="Keine Anlageberatung">
              <p>
                Die Inhalte dieser Website dienen der allgemeinen Information und Bildung.
                Sie sind keine Anlage-, Rechts- oder Steuerberatung und berücksichtigen
                weder deine persönliche Situation noch deine Anlageziele. Jede
                Kapitalanlage ist mit Risiken verbunden, bis zum vollständigen Verlust des
                eingesetzten Geldes.
              </p>
              <p>
                Kurse, News und Verschuldungsdaten dieser Version sind Beispieldaten und
                keine echten Marktinformationen.
              </p>
            </Callout>
          </div>

          <h2 className="text-fg mt-12 text-2xl font-bold">Fehler gefunden?</h2>
          <p className="text-fg-muted mt-4 leading-relaxed">
            Fachliche Korrekturen sind willkommen – besonders bei Steuer- und
            Rechtsthemen, wo sich Regeln regelmäßig ändern. Hinweise gerne über die
            Kontaktseite.
          </p>
          <p className="mt-6 flex flex-wrap gap-3">
            <Link href="/kontakt" className="fk-btn-primary">
              <Icon name="mail" className="size-4" />
              Kontakt aufnehmen
            </Link>
            <Link href="/unternehmensphilosophie" className="fk-btn-secondary">
              Unternehmensphilosophie
              <Icon name="arrow-right" className="size-4" />
            </Link>
            <Link href="/lernen" className="fk-btn-ghost">
              Zum Lernbereich
              <Icon name="arrow-right" className="size-4" />
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
