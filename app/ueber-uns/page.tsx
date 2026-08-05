import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { Icon, type IconName } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { getCompleteTopics, getLearnStats } from '@/lib/learn'
import { buildMetadata, withBrand } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: withBrand(`Über uns: Wofür ${siteConfig.name} steht`),
  description:
    'Warum diese Plattform Mechanismen erklärt statt Produkte zu empfehlen, wie Inhalte entstehen und wie wir mit Annahmen, Risiken und Unsicherheit umgehen.',
  path: '/ueber-uns',
  ogTitle: `Wofür ${siteConfig.name} steht`,
})

/**
 * Die vier Grundsätze.
 *
 * Vorher waren es sechs, und sie beschrieben Verfahren: „Formeln offenlegen“,
 * „Drei Stufen, die weitergehen“. Das war richtig, aber es war eine Liste von
 * Maßnahmen, keine Haltung – und Maßnahmen ändern sich, wenn die Website
 * wächst.
 *
 * Diese vier benennen stattdessen, woran sich jede einzelne Entscheidung messen
 * lassen muss. Die Maßnahmen stehen weiterhin darin, aber als Beleg für den
 * Grundsatz, nicht als Grundsatz selbst.
 */
const principles: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'scale',
    title: 'Rational',
    text: 'Entscheidungen über Geld gehören an Mechanismen und Zahlen ausgerichtet, nicht an Schlagzeilen oder Bauchgefühl. Jeder Rechner zeigt deshalb seine Formel, und wo eine Aussage von Annahmen abhängt, stehen die Annahmen daneben – ein Ergebnis ohne Rechenweg ist nicht überprüfbar und damit wertlos.',
  },
  {
    icon: 'shield',
    title: 'Ehrlich',
    text: 'Risiken stehen so deutlich da wie Chancen, nicht im Kleingedruckten. Es gibt keine Renditeversprechen, weil niemand sie halten kann. Jede Zahl nennt ihre Herkunft und ihren Stand; wo Werte zur Veranschaulichung erzeugt sind, steht genau das dabei. Und ein Fehler wird benannt und korrigiert, nicht stillschweigend überschrieben.',
  },
  {
    icon: 'compass',
    title: 'Zukunftsorientiert',
    text: 'Vermögensaufbau ist eine Frage von Jahrzehnten, nicht von Quartalen. Die Inhalte sind deshalb auf das ausgerichtet, was in zehn Jahren noch gilt – auf Zinseszins, Streuung, Kosten und den eigenen Umgang mit Schwankungen. Aktuelle Kurse und Nachrichten stehen daneben, aber sie sind Anlass zum Verstehen, nicht zum Handeln.',
  },
  {
    icon: 'lightbulb',
    title: 'Verständlich',
    text: 'Fachsprache ist kein Qualitätsmerkmal, Vereinfachung aber auch nicht. Jedes Thema gibt es deshalb dreimal: Die erste Stufe klärt die Begriffe, die zweite die Umsetzung, die dritte Kennzahlen, Sonderfälle und Steuern. Wer den Mechanismus einmal verstanden hat, kann jedes Angebot selbst beurteilen – das hält länger als jede Empfehlung.',
  },
]

export default async function AboutPage() {
  /*
    Die Zahlen kommen aus den Daten, nicht aus dem Fließtext.

    Hier stand „Aktie und Zinseszins sind ausformuliert, die übrigen 20 Themen
    haben eine Gliederung“. Beides war falsch geworden: Rohstoffe kam dazu, und
    aus 20 übrigen wurden 30. Eine Zahl, die jemand beim Erweitern mitpflegen
    muss, wird irgendwann vergessen – und steht dann als Behauptung auf einer
    Seite, deren Thema Ehrlichkeit ist.
  */
  const [stats, completeTopics] = await Promise.all([
    getLearnStats(),
    getCompleteTopics(),
  ])
  const offen = stats.topicCount - completeTopics.length

  return (
    <>
      <PageHeader
        area="learn"
        title="Finanzwissen ohne Verkaufsabsicht"
        lead={`${siteConfig.name} erklärt, wie Geldanlage, Börse und Vorsorge funktionieren – in drei Stufen, mit offengelegten Rechenwegen und ohne Produktempfehlungen.`}
        breadcrumbs={<Breadcrumbs items={[{ name: 'Über uns' }]} />}
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="max-w-3xl">
          <h2 className="text-fg text-2xl font-bold">Warum diese Plattform existiert</h2>
          <p className="text-fg-muted mt-4 leading-relaxed">
            Finanzinformationen sind reichlich vorhanden. Viele davon entstehen im Umfeld
            eines Produktangebots – ein Fonds, eine Versicherung, ein Depot, ein
            Abonnement. Das macht Inhalte nicht automatisch falsch, aber es prägt, was
            betont und was weggelassen wird.
          </p>
          <p className="text-fg-muted mt-4 leading-relaxed">
            Diese Plattform verkauft nichts. Daraus folgt eine andere Gewichtung: Kosten
            sind hier ein Hauptthema statt einer Fußnote, Risiken stehen neben den
            Chancen, und wo ein verbreitetes Argument nicht trägt, sagen wir das – auch
            wenn es unspektakulärer klingt.
          </p>

          <h2 className="text-fg mt-12 text-2xl font-bold">Vier Grundsätze</h2>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
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
            Derzeit sind{' '}
            {completeTopics.map((topic, index) => (
              <span key={topic.slug}>
                {index > 0 && (index === completeTopics.length - 1 ? ' und ' : ', ')}
                <strong className="text-fg font-semibold">{topic.title}</strong>
              </span>
            ))}{' '}
            vollständig ausformuliert. Die übrigen {offen} Themen haben eigene Seiten mit
            Gliederung; der Text wird Thema für Thema ergänzt. Der Stand ist auf jeder
            betroffenen Seite gekennzeichnet – wir halten es für ehrlicher, den
            Bearbeitungsstand zu zeigen, als leere Seiten zu verstecken.
          </p>

          <div className="mt-8">
            <Callout variant="info" title="Keine Anlageberatung">
              <p>
                Die Inhalte dieser Website dienen der allgemeinen Information und Bildung.
                Sie sind keine Anlage-, Rechts- oder Steuerberatung und berücksichtigen
                weder deine persönliche Situation noch deine Anlageziele. Jede
                Kapitalanlage ist mit Risiken verbunden, bis zum vollständigen Verlust des
                eingesetzten Geldes.
              </p>
              <p>
                Kurse werden als Tagesschlusskurse und zuletzt gehandelte Preise
                dargestellt, nicht in Echtzeit; sie können von den Angaben anderer
                Anbieter abweichen und sind nicht für Handelszwecke bestimmt. Die
                Verschuldungszahlen sind Näherungswerte und keine amtliche Statistik.
                Herkunft und Stand stehen jeweils direkt an der Angabe.
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
              Unsere Philosophie
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
