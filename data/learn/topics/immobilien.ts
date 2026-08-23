import type { LearnTopic } from '@/data/learn/types'
import { formatCurrencyRounded, formatPercent } from '@/lib/format'
import { auswerten, rateBeiTilgungssatz, restschuldNach } from '@/lib/kredit'
import {
  immobilieAnfangstilgung as TILGUNG,
  immobilieDarlehenszins,
  immobilieDarlehensquote,
  immobilieEigenkapitalquoten as EIGENKAPITALQUOTEN,
  immobilieInstandhaltung as INSTANDHALTUNG,
  immobilieJahresmiete as JAHRESMIETE,
  immobilieKaufpreis as KAUFPREIS,
  immobilieMietausfallProzent as MIETAUSFALL_PROZENT,
  immobilieNebenkostenProzent as NEBENKOSTEN_PROZENT,
  immobilieVerwaltung as VERWALTUNG,
  immobilieWertaenderungen as WERTAENDERUNGEN,
  immobilienZinsbindung as ZINSBINDUNG,
} from '@/lib/lernszenarien'

/*
  Zwei Rechnungen tragen dieses Thema, und beide korrigieren dieselbe
  verbreitete Verkürzung: dass die Bruttomietrendite eine Rendite sei.

  1. Von brutto nach netto. Kaufnebenkosten erhöhen den Einsatz, laufende
     Kosten senken den Ertrag. Was übrig bleibt, ist regelmäßig weniger als
     die Hälfte der Zahl, mit der geworben wird.

  2. Der Hebel. Er wird in Beratungsgesprächen nach oben vorgerechnet und
     nach unten weggelassen. Hier steht beides in derselben Tabelle, aus
     derselben Formel – das ist der ganze Trick.

  Die Annahmen standen bis eben hier im Thema und noch einmal in
  `lib/lernszenarien.ts`, weil die Grafiken sie ebenfalls brauchen. Zweimal
  dieselbe Zahl heißt: einmal ändern genügt, damit Text und Zeichnung
  auseinandergehen. Jetzt gibt es nur noch eine Stelle.
*/

const gesamteinsatz = KAUFPREIS * (1 + NEBENKOSTEN_PROZENT / 100)
const bruttorendite = (JAHRESMIETE / KAUFPREIS) * 100

const mietausfall = JAHRESMIETE * (MIETAUSFALL_PROZENT / 100)
const nettomiete = JAHRESMIETE - VERWALTUNG - INSTANDHALTUNG - mietausfall
const nettorenditeAufKaufpreis = (nettomiete / KAUFPREIS) * 100
const nettorenditeAufEinsatz = (nettomiete / gesamteinsatz) * 100

/*
  Der Hebel, in beide Richtungen gerechnet.

  Eigenkapital ist der Einsatz, der Rest ist Kredit. Die Eigenkapitalrendite
  ergibt sich aus der Wertänderung des gesamten Objekts, bezogen auf den
  eigenen Einsatz – der Kredit bleibt in voller Höhe stehen.
*/
const hebelreihe = EIGENKAPITALQUOTEN.map((quote) => {
  const eigenkapital = KAUFPREIS * (quote / 100)
  return {
    quote,
    eigenkapital,
    wirkung: WERTAENDERUNGEN.map(
      (aenderung) => ((KAUFPREIS * (aenderung / 100)) / eigenkapital) * 100
    ),
  }
})

/*
  Das Darlehen ist abgeleitet, nicht gesetzt.

  Es finanziert dasselbe Objekt, um das es oben geht – deshalb ergibt es sich
  aus dem Kaufpreis und dem Fremdkapitalanteil. Vorher stand hier eine getippte
  Summe mit dem Hinweis, es sei „dieselbe Rechnung wie unter Schulden &
  Kredit“. Das war nicht so: Dort ist die Darlehenssumme 300.000 Euro, hier ist
  es der Kaufpreis.
*/
const DARLEHEN = {
  summe: KAUFPREIS * (immobilieDarlehensquote / 100),
  zinsProzent: immobilieDarlehenszins,
}
const rate = rateBeiTilgungssatz(DARLEHEN, TILGUNG)
const finanzierung = auswerten(DARLEHEN, rate)
const restschuld10 = restschuldNach(DARLEHEN, rate, ZINSBINDUNG)

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner rechnet vom Kaufpreis zur tatsächlichen Rendite und
 * benennt den Aufwand. Fortgeschritten behandelt Finanzierung und den Hebel
 * in beide Richtungen. Profi geht auf Steuern, Lage und die Alternativen
 * ohne Verwaltungsaufwand ein.
 *
 * ## Haltung
 *
 * Weder Empfehlung noch Abraten. Eine Immobilie ist eine Anlage mit einer
 * ungewöhnlichen Eigenschaft: Sie ist unteilbar, illiquide und wird fast
 * immer mit Hebel gekauft. Daraus folgen nachprüfbare Aussagen, und die
 * stehen hier.
 */
export const immobilien: LearnTopic = {
  slug: 'immobilien',
  title: 'Immobilien',
  headline: 'Die Rendite steht nicht im Exposé',
  metaTitle: 'Immobilien als Geldanlage: Rendite, Finanzierung, Risiko',
  metaDescription:
    'Wie sich die tatsächliche Mietrendite berechnet, was Kaufnebenkosten bedeuten, wie der Kredithebel in beide Richtungen wirkt und welche Alternativen es gibt.',
  lead: 'Eine Immobilie ist unteilbar, illiquide und wird fast immer auf Kredit gekauft. Jede dieser drei Eigenschaften verändert die Rechnung.',
  overview: [
    'Die beworbene Bruttomietrendite ist ein Startwert, kein Ergebnis. Kaufnebenkosten erhöhen den Einsatz, nicht umlagefähige Kosten senken den Ertrag – was übrig bleibt, ist regelmäßig weniger als die Hälfte.',
    'Der Kredithebel ist der eigentliche Grund für die Vermögenswirkung des Immobilienkaufs. Er wirkt in beide Richtungen mit derselben Verstärkung, und die zweite Richtung wird in Beratungsgesprächen selten vorgerechnet.',
    'Die Stufen führen von der Renditerechnung über Finanzierung und Hebel bis zu Steuern, Lage und den Wegen, in Immobilien anzulegen, ohne eine zu verwalten.',
  ],
  keywords: [
    'Immobilien',
    'Mietrendite',
    'Kaufnebenkosten',
    'Annuitätendarlehen',
    'Leverage',
    'Instandhaltung',
  ],
  related: ['schulden-und-kredit', 'fonds', 'portfolio-aufbau', 'inflation'],
  calculators: ['/rechner/zinsrechner'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Immobilien als Anlage: was als Rendite übrig bleibt',
      metaDescription:
        'Welche Nebenkosten beim Kauf anfallen, wie sich Brutto- von Nettomietrendite unterscheidet und welcher Aufwand selten erwähnt wird.',
      title: 'Von der beworbenen zur tatsächlichen Rendite',
      lead: 'Die Nebenkosten, die laufenden Kosten und der Aufwand – drei Posten, die im Exposé nicht stehen.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Zuerst eine Unterscheidung, die alles Weitere bestimmt. Eine **selbstgenutzte** Immobilie ist in erster Linie eine Konsumentscheidung: Man wohnt darin, spart Miete und bindet Kapital. Eine **vermietete** Immobilie ist eine Kapitalanlage und muss sich wie eine rechnen lassen. Dieser Text behandelt die zweite; für die erste gelten andere Maßstäbe, und der wichtigste ist nicht die Rendite.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Nebenkosten kommen zuerst',
        },
        {
          type: 'table',
          caption: 'Was zum Kaufpreis hinzukommt',
          head: ['Position', 'Größenordnung'],
          rows: [
            [
              'Grunderwerbsteuer',
              'Je nach Bundesland zwischen dreieinhalb und sechseinhalb Prozent – der größte Einzelposten',
            ],
            ['Notar und Grundbuch', 'Zusammen rund anderthalb bis zwei Prozent'],
            [
              'Maklerprovision',
              'Falls beauftragt, mehrere Prozent; beim Kauf zwischen Käufer und Verkäufer geteilt',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Warum das mehr ist als eine Randnotiz',
          items: [
            `Bei einem Kaufpreis von ${formatCurrencyRounded(KAUFPREIS)} und ${formatPercent(NEBENKOSTEN_PROZENT, 0)} Nebenkosten liegt der tatsächliche Einsatz bei ${formatCurrencyRounded(gesamteinsatz)}.`,
            'Diese Summe ist beim Kauf sofort weg – sie steckt nicht im Objekt und ist bei einem Verkauf nicht wieder da.',
            'Sie muss also erst wieder erwirtschaftet werden, bevor überhaupt ein Gewinn beginnt. Bei realistischen Renditen dauert das mehrere Jahre.',
            'Daraus folgt unmittelbar: Eine Immobilie mit kurzem Horizont ist fast immer ein Verlustgeschäft. Der Zeithorizont ist hier keine Empfehlung, sondern eine Bedingung.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Brutto ist nicht netto',
        },
        {
          type: 'paragraph',
          text: `Die **Bruttomietrendite** ist Jahresmiete geteilt durch Kaufpreis. Bei ${formatCurrencyRounded(JAHRESMIETE)} Jahresmiete und ${formatCurrencyRounded(KAUFPREIS)} Kaufpreis sind das ${formatPercent(bruttorendite, 1)}. Mit dieser Zahl wird geworben. Sie enthält keine einzige Kostenposition.`,
        },
        {
          type: 'table',
          caption: 'Was der Vermieter trägt und nicht umlegen kann',
          head: ['Position', 'Im Jahr'],
          rows: [
            ['Jahresmiete (kalt)', formatCurrencyRounded(JAHRESMIETE)],
            ['− Verwaltung', `− ${formatCurrencyRounded(VERWALTUNG)}`],
            ['− Instandhaltungsrücklage', `− ${formatCurrencyRounded(INSTANDHALTUNG)}`],
            [
              `− Mietausfall und Leerstand (${formatPercent(MIETAUSFALL_PROZENT, 0)})`,
              `− ${formatCurrencyRounded(mietausfall)}`,
            ],
            ['= Was tatsächlich bleibt', formatCurrencyRounded(nettomiete)],
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Die beiden Zahlen, auf die es ankommt',
          items: [
            `Bezogen auf den Kaufpreis: ${formatPercent(nettorenditeAufKaufpreis, 2)} statt der beworbenen ${formatPercent(bruttorendite, 1)}.`,
            `Bezogen auf den **tatsächlichen Einsatz** einschließlich Nebenkosten: ${formatPercent(nettorenditeAufEinsatz, 2)}. Das ist die ehrliche Zahl.`,
            'Die Instandhaltungsrücklage ist dabei der Posten, der am häufigsten fehlt. Als Größenordnung gelten etwa ein bis anderthalb Prozent des Gebäudewerts pro Jahr – bei älteren Objekten mehr. Sie fällt nicht gleichmäßig an, sondern in Sprüngen: Dach, Heizung, Fenster.',
            'Nicht enthalten sind Finanzierungskosten. Kommen sie hinzu, kann die laufende Rechnung negativ werden – das ist bei fremdfinanzierten Objekten der Normalfall und nicht automatisch ein Fehler, solange getilgt wird.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Aufwand, der in keiner Rechnung steht',
        },
        {
          type: 'list',
          items: [
            '**Mietersuche und Auswahl.** Inserate, Besichtigungen, Bonitätsprüfung, Vertrag. Bei jedem Wechsel erneut.',
            '**Nebenkostenabrechnung.** Jährlich, fristgebunden, formal anfällig – Fehler führen zum Verlust von Nachforderungen.',
            '**Handwerker koordinieren.** Der Wasserschaden meldet sich nicht zu einem passenden Zeitpunkt.',
            '**Eigentümerversammlungen.** Bei einer Wohnung in einer Anlage kommen Beschlüsse hinzu, die man mitträgt, ohne sie allein entscheiden zu können.',
            '**Rechtliche Auseinandersetzungen.** Selten, aber wenn, dann langwierig und mit vollem Mietausfall.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Eine Verwaltung durch Dritte nimmt den größten Teil dieser Arbeit ab und kostet dafür einen Teil der Rendite – bei den oben gerechneten Zahlen einen erheblichen. Wer den eigenen Zeitaufwand nicht als Kostenposition ansetzt, vergleicht eine Immobilie mit einem ETF, als wäre beides gleich viel Arbeit. Das ist es nicht.',
        },
        {
          type: 'figure',
          figure: 'immobilie-nettorendite',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die drei Eigenheiten, die eine Immobilie ausmachen',
        },
        {
          type: 'paragraph',
          text: 'Warum kaufen trotzdem so viele? Weil eine Immobilie drei Dinge kann, die ein Wertpapierdepot nicht kann – und weil dieselben drei Dinge zugleich ihre Risiken sind.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Sie lässt sich finanzieren.** Für 400.000 Euro Wohnung braucht es 80.000 Euro Eigenkapital; für 400.000 Euro Aktien braucht es 400.000 Euro. Der Kredit vervielfacht die Wirkung des Eigenkapitals – nach oben und nach unten gleichermaßen. Steigt der Wert um zehn Prozent, verdoppelt sich das Eigenkapital fast; fällt er um zwanzig, ist es weg.',
            '**Sie ist ein Klumpen.** Eine Wohnung ist ein Objekt, in einer Straße, in einer Stadt, mit einem Mieter. Das ist das genaue Gegenteil von Streuung – und es ist bei den meisten Käufern zugleich der weitaus größte Vermögensposten.',
            '**Sie ist unbeweglich.** Verkaufen dauert Monate und kostet Makler, Notar und Nerven. Ein Teilverkauf ist unmöglich: Man kann nicht ein Zimmer verkaufen, weil das Auto kaputt ist.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Die Unbeweglichkeit ist nicht nur ein Nachteil',
          items: [
            'Wer nicht verkaufen kann, verkauft auch nicht in Panik. Der häufigste Fehler am Aktienmarkt ist bei einer Immobilie schlicht nicht durchführbar.',
            'Dazu kommt der Zwang zur Tilgung: Die monatliche Rate ist Sparen, ob man will oder nicht. Für viele ist das der eigentliche Grund, warum am Ende Vermögen dasteht.',
            'Und es gibt keinen täglichen Kurs. Was man nicht sieht, regt einen nicht auf – die Wohnung schwankt genauso, nur ohne Anzeige.',
            'Das sind echte Vorteile. Sie sind nur keine Rendite, sondern Verhaltenshilfen – und man sollte wissen, wofür man zahlt.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Immobilien im Depot statt im Grundbuch',
        },
        {
          type: 'paragraph',
          text: 'Wer an Immobilien beteiligt sein will, ohne eine zu besitzen, hat zwei Wege – und beide sind etwas anderes als eine eigene Wohnung.',
        },
        {
          type: 'list',
          items: [
            '**Offene Immobilienfonds** halten Bürogebäude, Einkaufszentren und Wohnanlagen. Sie schwanken wenig, weil ihre Bewertung auf Gutachten beruht und nicht auf einem Markt – was Ruhe erzeugt und zugleich bedeutet, dass Preisänderungen erst mit Verzögerung sichtbar werden. Es gelten 24 Monate Mindesthaltedauer und 12 Monate Kündigungsfrist.',
            '**Immobilienaktien und REITs** sind börsennotierte Gesellschaften, die Immobilien besitzen und vermieten. Sie sind täglich handelbar und schwanken deshalb wie Aktien – oft stärker als der Gesamtmarkt, weil sie hoch verschuldet sind und auf Zinsänderungen empfindlich reagieren.',
            'Beide streuen über viele Objekte und Standorte. Beide geben dafür das ab, was viele an der eigenen Wohnung schätzen: die Greifbarkeit und die Kontrolle.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Rund zehn Prozent Nebenkosten sind beim Kauf sofort weg und müssen erst erwirtschaftet werden.',
            'Die Bruttomietrendite ist ein Startwert; netto bleibt regelmäßig weniger als die Hälfte.',
            'Die Instandhaltungsrücklage fehlt in den meisten Rechnungen und fällt in Sprüngen an.',
            'Der eigene Zeitaufwand ist eine echte Kostenposition.',
            'Der Kredit wirkt in beide Richtungen – er ist der Grund für hohe Gewinne und für Totalverluste.',
            'Ein Objekt ist ein Klumpen, und meist der größte Posten des Vermögens.',
            'Die Unbeweglichkeit schützt vor Panikverkäufen. Das ist ein echter Vorteil, aber keine Rendite.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Immobilienfinanzierung und der Hebel in beide Richtungen',
      metaDescription:
        'Wie ein Annuitätendarlehen rechnet, welche Restschuld nach der Zinsbindung bleibt und wie der Kredithebel Gewinne und Verluste gleichermaßen verstärkt.',
      title: 'Finanzierung und Hebel',
      lead: 'Was die Finanzierung tatsächlich kostet, was nach der Zinsbindung offen bleibt – und die Tabelle, die in Beratungsgesprächen nur zur Hälfte gezeigt wird.',
      readingMinutes: 18,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Ein durchgerechnetes Beispiel',
        },
        {
          type: 'paragraph',
          text: `Ein Darlehen über ${formatCurrencyRounded(DARLEHEN.summe)} zu ${formatPercent(DARLEHEN.zinsProzent, 1)} mit ${formatPercent(TILGUNG, 0)} Anfangstilgung – die in Deutschland übliche Konstruktion:`,
        },
        {
          type: 'table',
          caption: 'Was daraus folgt',
          head: ['Größe', 'Wert'],
          rows: [
            ['Monatliche Rate', formatCurrencyRounded(rate)],
            [
              'Laufzeit bis zur vollständigen Tilgung',
              `${Math.round(finanzierung.monate / 12)} Jahre`,
            ],
            [
              'Zinsen über die gesamte Laufzeit',
              formatCurrencyRounded(finanzierung.zinsenGesamt),
            ],
            [
              `Restschuld nach ${ZINSBINDUNG} Jahren Zinsbindung`,
              formatCurrencyRounded(restschuld10),
            ],
          ],
        },
        {
          type: 'figure',
          figure: 'immobilie-restschuld',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die letzte Zeile ist die wichtigste',
          items: [
            `Nach zehn Jahren – dem Ende einer üblichen Zinsbindung – stehen noch ${formatPercent((restschuld10 / DARLEHEN.summe) * 100, 0)} der ursprünglichen Summe offen.`,
            'Dieser Betrag muss zu den dann geltenden Konditionen weiterfinanziert werden. Wie hoch die sind, weiß heute niemand.',
            'Bei einem Zinsanstieg um zwei Prozentpunkte steigt die Rate spürbar – auf einen Betrag, der zur ursprünglichen Kalkulation nicht mehr passt. Wer knapp gerechnet hat, hat dann ein Problem, das nichts mit der Immobilie zu tun hat.',
            'Das ist der Grund, warum eine lange Zinsbindung bei niedrigem Zinsniveau die vermutlich sinnvollste Versicherung im gesamten Kreditbereich ist – und warum das gesetzliche Kündigungsrecht nach zehn Jahren sie einseitig zu deinen Gunsten macht.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Hebel – beide Richtungen',
        },
        {
          type: 'paragraph',
          text: `Fremdkapital verstärkt die Rendite auf das eingesetzte Eigenkapital. Das ist keine Meinung, sondern Arithmetik – und genau deshalb lässt es sich vollständig hinschreiben. Bei einem Objekt für ${formatCurrencyRounded(KAUFPREIS)} und einer Wertänderung von zehn Prozent in die eine oder andere Richtung:`,
        },
        {
          type: 'table',
          caption: `Wirkung auf das Eigenkapital – Objektwert ${formatCurrencyRounded(KAUFPREIS)}`,
          head: [
            'Eigenkapitalquote',
            'Eigenkapital',
            'Bei + 10 % Wertänderung',
            'Bei − 10 % Wertänderung',
          ],
          rows: hebelreihe.map((zeile) => [
            formatPercent(zeile.quote, 0),
            formatCurrencyRounded(zeile.eigenkapital),
            formatPercent(zeile.wirkung[0], 0),
            formatPercent(zeile.wirkung[1], 0),
          ]),
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was diese Tabelle zeigt',
          items: [
            'Bei zehn Prozent Eigenkapital wird aus einer Wertsteigerung von zehn Prozent eine Eigenkapitalrendite von hundert Prozent. Genau diese Zeile wird in Beratungsgesprächen vorgerechnet.',
            'In derselben Zeile steht daneben: Bei zehn Prozent Wertverlust ist das gesamte Eigenkapital weg. Diese Spalte fehlt in den meisten Präsentationen.',
            'Zehn Prozent Wertverlust sind bei Immobilien kein Extremfall. Sie sind in mehreren Ländern und Jahrzehnten vorgekommen, und in Deutschland zwischen 2022 und 2023 in manchen Lagen ebenfalls.',
            '**Der Hebel ist symmetrisch. Nur seine Darstellung ist es nicht.**',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wann der Hebel kippt',
        },
        {
          type: 'list',
          items: [
            '**Zinsanstieg nach der Bindung.** Die Rate steigt, die Rechnung passt nicht mehr. Der wahrscheinlichste der drei Fälle.',
            '**Mietausfall.** Die Rate läuft weiter, die Einnahme nicht. Bei einer einzelnen Wohnung ist der Ausfall vollständig – hier zeigt sich, dass eine Immobilie keine gestreute Anlage ist, sondern eine einzelne Position.',
            '**Wertverlust.** Fällt der Wert unter die Restschuld, ist das Eigenkapital rechnerisch negativ. Solange die Rate fließt, passiert nichts – die Bank fordert nicht nach. Beim Verkauf oder bei der Anschlussfinanzierung wird es allerdings sichtbar, und dann ist es akut.',
            '**Alle drei zusammen.** Sie haben eine gemeinsame Ursache: eine Rezession. Sie treten deshalb häufiger gemeinsam auf als unabhängig voneinander – und genau darauf ist zu kalkulieren.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Verglichen mit einem kreditfinanzierten Wertpapierdepot ist der Immobilienhebel dabei der beherrschbarere: Die Bank fordert nicht nach, solange die Rate fließt. Ein Wertpapierkredit verlangt Nachschuss, sobald der Beleihungswert fällt – und zwingt zum Verkauf am Tiefpunkt. Der Unterschied ist erheblich und spricht für die Immobilie, nicht gegen sie.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Kaufnebenkosten – der Verlust am ersten Tag',
        },
        {
          type: 'paragraph',
          text: 'Ein Kauf beginnt mit einem Minus, und zwar mit einem großen. Grunderwerbsteuer, Notar, Grundbuch und meist eine Maklerprovision summieren sich in Deutschland auf einen zweistelligen Prozentsatz des Kaufpreises – je nach Bundesland und Provision grob zwischen 9 und 15 Prozent. Dieses Geld ist weg: Es steckt nicht im Objekt und kommt beim Verkauf nicht zurück.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was daraus folgt',
          items: [
            '**Die Immobilie muss erst die Nebenkosten aufholen, bevor überhaupt etwas verdient ist.** Bei 12 Prozent Nebenkosten und 2 Prozent jährlichem Wertzuwachs dauert das rund sechs Jahre – ohne dass in dieser Zeit irgendetwas gewonnen wäre.',
            '**Sie werden fast nie mitfinanziert.** Banken verlangen sie regelmäßig aus Eigenkapital, weil sie im Ernstfall keinen Gegenwert haben, den man verwerten könnte.',
            '**Sie machen jeden kurzfristigen Kauf teuer.** Wer nach vier Jahren wieder verkauft, hat die Nebenkosten zweimal gezahlt – die eigenen beim Kauf und über den Preis die des Käufers beim Verkauf.',
            'Deshalb ist die Haltedauer bei Immobilien keine Vorliebe, sondern eine Rechengröße.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was in der Rate nicht enthalten ist',
        },
        {
          type: 'paragraph',
          text: 'Die Annuität deckt Zins und Tilgung. Alles andere kommt dazu – und wird beim Vergleich mit einer Miete regelmäßig vergessen, weil es in der Miete enthalten war, ohne dass es jemand einzeln gesehen hätte.',
        },
        {
          type: 'table',
          caption: 'Die Posten neben der Rate',
          head: ['Posten', 'Wer ihn beim Mieten trägt', 'Größenordnung beim Eigentum'],
          rows: [
            [
              'Instandhaltung',
              'der Vermieter, vollständig',
              'die größte Position. Für Rücklagen werden üblicherweise ein bis anderthalb Prozent des Gebäudewerts je Jahr angesetzt',
            ],
            [
              'Nicht umlagefähige Verwaltung',
              'der Vermieter',
              'bei Eigentumswohnungen die Verwaltervergütung, jährlich',
            ],
            [
              'Grundsteuer',
              'wird umgelegt, also der Mieter',
              'bleibt beim Eigentümer und ändert sich mit der Gemeinde',
            ],
            ['Wohngebäudeversicherung', 'wird umgelegt', 'bleibt beim Eigentümer'],
            [
              'Das gebundene Eigenkapital',
              'entfällt – es ist frei angelegt',
              'die unsichtbarste Position: Was im Objekt steckt, kann nicht zugleich Zinsen bringen',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Der letzte Posten ist der, den fast jede Vergleichsrechnung auslässt. Wer 100.000 Euro Eigenkapital einbringt, verzichtet auf dessen Ertrag – und dieser entgangene Ertrag gehört auf dieselbe Seite der Rechnung wie die Miete, die man spart.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Anschlussfinanzierung: das Risiko mit Datum',
        },
        {
          type: 'paragraph',
          text: 'Die Zinsbindung endet an einem Tag, der bei Vertragsschluss bereits feststeht – und die Restschuld an diesem Tag steht ebenfalls fest. Unbekannt ist nur der Zins, zu dem es dann weitergeht. Das ist das einzige Risiko der ganzen Finanzierung, dessen Zeitpunkt man exakt kennt, und damit das einzige, für das man sich vollständig vorbereiten kann.',
        },
        {
          type: 'list',
          items: [
            '**Ausrechnen, nicht schätzen.** Was kostet die Rate, wenn der Anschlusszins zwei, drei oder vier Prozentpunkte höher liegt? Wer die Zahl kennt, weiß, ob die Finanzierung trägt.',
            '**Ein Forward-Darlehen sichert den Zins im Voraus**, gegen einen Aufschlag je Monat Vorlaufzeit. Es ist eine Versicherung, kein Schnäppchen – man zahlt dafür, dass der Zins nicht mehr überraschen kann.',
            '**Höhere Tilgung senkt die Restschuld und damit das Risiko selbst.** Ein Prozentpunkt mehr Anfangstilgung verkürzt die Laufzeit erheblich und drückt genau den Betrag, der am Stichtag neu verhandelt werden muss.',
            '**Nach zehn Jahren besteht ein Sonderkündigungsrecht** (§ 489 BGB), unabhängig von der vereinbarten Bindung. Wer eine längere Bindung wählt, hat also eine Untergrenze und trotzdem eine Ausstiegsmöglichkeit.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Nach zehn Jahren Zinsbindung steht bei üblicher Tilgung noch der weitaus größte Teil offen.',
            'Der Hebel verstärkt Gewinne und Verluste gleichermaßen – nur die Darstellung ist einseitig.',
            'Zinsanstieg, Mietausfall und Wertverlust haben eine gemeinsame Ursache und treten gemeinsam auf.',
            'Der Immobilienhebel ist beherrschbarer als ein Wertpapierkredit, weil keine Nachschusspflicht besteht.',
            'Kaufnebenkosten sind am ersten Tag weg und müssen erst aufgeholt werden – das macht die Haltedauer zur Rechengröße.',
            'Instandhaltung, Verwaltung und Grundsteuer stecken beim Mieten in der Miete, beim Eigentum nicht.',
            'Der entgangene Ertrag des gebundenen Eigenkapitals gehört in jede Vergleichsrechnung.',
            'Die Anschlussfinanzierung ist das einzige Risiko, dessen Zeitpunkt von Anfang an feststeht.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Immobilien: Steuern, Lage und Alternativen',
      metaDescription:
        'Abschreibung und Werbungskosten, die Spekulationsfrist, wie Lage tatsächlich zu bewerten ist und welche Wege es ohne Verwaltungsaufwand gibt.',
      title: 'Steuern, Lage und Alternativen',
      lead: 'Was die Steuer beiträgt, warum Lage keine Adresse ist – und wie sich in Immobilien anlegen lässt, ohne eine zu besitzen.',
      readingMinutes: 13,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Die steuerliche Seite',
        },
        {
          type: 'paragraph',
          text: 'Bei einer vermieteten Immobilie ist die Steuer ein wesentlicher Teil der Rechnung – und der einzige Bereich der Geldanlage, in dem laufende Kosten und Zinsen tatsächlich abzugsfähig sind. Das verändert die Vorzeichen gegenüber allen anderen Anlageklassen.',
        },
        {
          type: 'list',
          items: [
            '**Abschreibung.** Das Gebäude – nicht der Grundstücksanteil – wird über die Nutzungsdauer abgeschrieben. Das ist ein Aufwand, dem keine Zahlung gegenübersteht: Er mindert die Steuer, ohne Geld zu kosten. Für viele vermietete Objekte ist er der Grund, warum die Rechnung nach Steuern besser aussieht als davor.',
            '**Schuldzinsen als Werbungskosten.** Bei Vermietung abzugsfähig, bei Selbstnutzung nicht. Der effektive Zins sinkt dadurch um den persönlichen Steuersatz – dieselben Zinsen kosten einen Vermieter also weniger als einen Selbstnutzer.',
            '**Erhaltungsaufwand gegen Herstellungskosten.** Eine Reparatur ist sofort abzugsfähig, eine Verbesserung muss über Jahre abgeschrieben werden. Die Abgrenzung ist streitanfällig und hat erhebliche Wirkung auf den Zeitpunkt der Entlastung – besonders bei umfangreichen Arbeiten kurz nach dem Kauf.',
            '**Die Spekulationsfrist.** Ein Verkaufsgewinn ist im Privatvermögen nach zehn Jahren Haltedauer steuerfrei. Für selbstgenutzte Objekte gibt es eine eigene, deutlich kürzere Regelung. Diese Frist ist die wichtigste Zahl der gesamten Planung – ein Verkauf ein halbes Jahr zu früh kann fünfstellig kosten.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die Falle bei der steuerlichen Betrachtung',
          items: [
            'Ein Objekt, das sich **nur** wegen der Steuerersparnis rechnet, rechnet sich nicht. Die Ersparnis ist ein Anteil des Verlusts – wer sie sucht, muss zuerst einen Verlust erzeugen.',
            'Das ist die Grundlage etlicher Steuersparmodelle, die regelmäßig scheitern: Sie erzeugen echte Verluste und liefern dafür eine anteilige Erstattung.',
            'Die Reihenfolge lautet deshalb: Erst prüfen, ob sich das Objekt vor Steuern trägt. Dann die Steuer als Verbesserung rechnen. Nie umgekehrt.',
          ],
        },
        {
          type: 'figure',
          figure: 'immobilie-hebel',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Lage ist kein Ort, sondern eine Prognose',
        },
        {
          type: 'paragraph',
          text: 'Der bekannteste Satz zu diesem Thema lautet, es komme auf die Lage an. Er ist richtig und wird meist falsch verstanden: Gemeint ist nicht die heutige Lage, sondern die künftige. Eine bereits erstklassige Lage ist entsprechend bepreist – der Ertrag liegt in der Veränderung, nicht im Zustand.',
        },
        {
          type: 'list',
          items: [
            '**Bevölkerungsentwicklung der Region.** Die belastbarste verfügbare Größe, weil demografische Entwicklungen träge sind und über Jahrzehnte fortschreiben. Eine schrumpfende Region ist eine schrumpfende Nachfrage.',
            '**Arbeitsplätze und ihre Breite.** Eine Region mit einem einzigen großen Arbeitgeber trägt dessen Risiko. Das gilt auch dann, wenn dieser Arbeitgeber gerade sehr gesund ist.',
            '**Verkehrsanbindung und Infrastruktur.** Geplante Veränderungen sind öffentlich einsehbar und werden vom Markt oft erst spät eingepreist – hier liegt eine der wenigen Informationsquellen, die sich für Private tatsächlich auswerten lassen.',
            '**Das Verhältnis von Kaufpreis zu Jahresmiete.** Die vergleichbarste Kennzahl über Regionen hinweg. Ein hoher Wert bedeutet, dass ein großer Teil des Preises aus erwarteter Wertsteigerung besteht – also aus einer Prognose und nicht aus Ertrag.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Immobilien ohne Immobilie',
        },
        {
          type: 'table',
          caption: 'Drei Wege ohne Verwaltungsaufwand',
          head: ['Weg', 'Merkmal', 'Worauf zu achten ist'],
          rows: [
            [
              'Offener Immobilienfonds',
              'Sondervermögen mit Bestandsimmobilien, schwankt wenig',
              'Die geringe Schwankung entsteht durch Gutachterbewertung, nicht durch geringes Risiko. Gesetzliche Mindesthalte- und Kündigungsfristen – die Liquidität ist begrenzt, und genau daran sind Fonds bereits gescheitert',
            ],
            [
              'Immobilienaktien und REITs',
              'Börsengehandelte Gesellschaften, täglich handelbar',
              'Schwanken wie Aktien, weil sie welche sind. Reagieren stark auf Zinsänderungen und sind meist selbst verschuldet – der Hebel ist im Produkt enthalten',
            ],
            [
              'Geschlossene Beteiligungen',
              'Anteil an einem konkreten Objekt oder Projekt',
              'Unternehmerische Beteiligung mit Totalverlustrisiko, langer Bindung und praktisch keinem Zweitmarkt. Für die meisten Privatanleger ungeeignet',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Die ehrliche Einordnung',
          items: [
            'Keiner dieser Wege ist eine echte Entsprechung zur eigenen Immobilie – vor allem fehlt der Hebel, der bei der Direktanlage den größten Teil der Wirkung ausmacht.',
            'Umgekehrt fehlen auch dessen Kehrseiten: Klumpenrisiko, Illiquidität und Verwaltungsaufwand.',
            'Wer eine Immobilie **als Anlage** in Betracht zieht, sollte die Frage ehrlich beantworten, ob es um die Anlage geht oder um den Besitz. Beides ist legitim – nur sind es verschiedene Entscheidungen mit verschiedenen Maßstäben.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Keine Steuer- oder Rechtsberatung',
          items: [
            'Abschreibung, Abgrenzung des Erhaltungsaufwands und die Fristen hängen an der konkreten Gestaltung und an einer Rechtsprechung, die sich fortentwickelt.',
            'Bei einem Immobilienkauf gehört beides zu jemandem mit Zulassung – die Beträge rechtfertigen die Kosten um ein Vielfaches.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Die Abschreibung mindert die Steuer, ohne Geld zu kosten – bei Vermietung ein wesentlicher Teil der Rechnung.',
            'Ein Objekt, das sich nur wegen der Steuer rechnet, rechnet sich nicht.',
            'Lage meint die künftige Entwicklung; die heutige ist bereits bepreist.',
            'Offene Fonds schwanken wenig wegen der Bewertungsmethode, nicht wegen des Risikos.',
          ],
        },
      ],
    },
  },
}
