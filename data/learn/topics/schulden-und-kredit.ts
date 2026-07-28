import type { LearnTopic } from '@/data/learn/types'
import { formatCurrencyRounded, formatNumber, formatPercent } from '@/lib/format'
import {
  auswerten,
  rateBeiLaufzeit,
  rateBeiTilgungssatz,
  restschuldNach,
  tilgungsplan,
  type Kreditparameter,
} from '@/lib/kredit'

/*
  Alle Kreditzahlen dieses Themas kommen aus `lib/kredit.ts`.

  Der Grund ist derselbe wie bei den Kosten: Über Kredite kursieren Sätze,
  die ungefähr stimmen und deren Größenordnung niemand nachrechnet. „Eine
  niedrige Anfangstilgung verlängert die Laufzeit“ klingt nach ein paar
  Jahren. Tatsächlich sind es bei einem Prozent über vierzig – und die
  Zinssumme übersteigt dann fast das Darlehen selbst. Solche Zahlen darf man
  nicht tippen.
*/
const RATENKREDIT: Kreditparameter = { summe: 15_000, zinsProzent: 8 }
const LAUFZEITEN = [3, 5, 7, 10]
const laufzeitreihe = LAUFZEITEN.map((jahre) =>
  auswerten(RATENKREDIT, rateBeiLaufzeit(RATENKREDIT, jahre))
).map((ergebnis, index) => ({ jahre: LAUFZEITEN[index], ...ergebnis }))

const IMMOBILIE: Kreditparameter = { summe: 300_000, zinsProzent: 3.5 }
const ZINSBINDUNG = 10
const TILGUNGSSAETZE = [1, 2, 3, 4]
const tilgungsreihe = TILGUNGSSAETZE.map((satz) => {
  const rate = rateBeiTilgungssatz(IMMOBILIE, satz)
  const ergebnis = auswerten(IMMOBILIE, rate)
  return {
    satz,
    rate,
    jahre: ergebnis.monate / 12,
    zinsenGesamt: ergebnis.zinsenGesamt,
    restschuld: restschuldNach(IMMOBILIE, rate, ZINSBINDUNG),
  }
})

/** Die erste Rate eines Immobilienkredits mit zwei Prozent Anfangstilgung. */
const ersteRate = tilgungsplan(IMMOBILIE, rateBeiTilgungssatz(IMMOBILIE, 2))[0]

/*
  Die Vergleiche im Fließtext werden ebenfalls gerechnet.

  „Mehr als das Dreifache“ und „ein Viertel“ sind genau die Formulierungen,
  die beim nächsten geänderten Zinssatz still falsch werden. Sie stehen
  deshalb nicht als Wort im Text, sondern als Zahl aus derselben Tabelle.
*/
const kurzeLaufzeit = laufzeitreihe[0]
const langeLaufzeit = laufzeitreihe[laufzeitreihe.length - 1]
const ratenersparnis =
  ((kurzeLaufzeit.rate - langeLaufzeit.rate) / kurzeLaufzeit.rate) * 100
const zinsfaktor = langeLaufzeit.zinsenGesamt / kurzeLaufzeit.zinsenGesamt

const tilgungEins = tilgungsreihe[0]
const tilgungZwei = tilgungsreihe[1]
const rateMehr = ((tilgungZwei.rate - tilgungEins.rate) / tilgungEins.rate) * 100
const zinsErsparnis =
  ((tilgungEins.zinsenGesamt - tilgungZwei.zinsenGesamt) / tilgungEins.zinsenGesamt) * 100

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner behandelt die Kreditarten, die Zusammensetzung
 * einer Rate und den Effektivzins als einzige vergleichbare Größe.
 * Fortgeschritten rechnet Tilgungspläne, Reihenfolge bei mehreren Schulden
 * und Umschuldung. Profi vergleicht Tilgung und Anlage sauber – nach
 * Steuern und risikoadjustiert – und behandelt den Kredit als Hebel.
 *
 * ## Warum dieses Thema vor den Anlagethemen steht
 *
 * Ein Dispositionskredit im zweistelligen Bereich schlägt jede realistisch
 * erwartbare Anlagerendite. Wer ihn hat, hat seine beste Geldanlage bereits
 * gefunden – und braucht die übrigen Themen zunächst nicht.
 */
export const schuldenUndKredit: LearnTopic = {
  slug: 'schulden-und-kredit',
  title: 'Schulden & Kredit',
  headline: 'Der Zinseszins in die andere Richtung',
  metaTitle: 'Kredit und Schulden: Effektivzins, Tilgung und Reihenfolge',
  metaDescription:
    'Wie Kredite wirklich rechnen, was der Effektivzins enthält und in welcher Reihenfolge mehrere Schulden getilgt werden sollten.',
  lead: 'Ein Kredit ist Zinseszins mit umgekehrtem Vorzeichen – meist zu einem Satz, den keine Geldanlage verlässlich erreicht.',
  overview: [
    'Vor jeder Anlageentscheidung steht die Frage nach bestehenden Schulden. Ein Dispositionskredit zu zweistelligem Zins schlägt jede realistisch erwartbare Anlagerendite – die Tilgung ist dann die beste verfügbare Geldanlage, und zwar eine risikolose.',
    'Der einzige vergleichbare Wert ist der Effektivzins: Er enthält neben dem Nominalzins auch Gebühren und den Zahlungsrhythmus. Zwei Angebote mit gleichem Nominalzins können sich in den tatsächlichen Kosten deutlich unterscheiden.',
    'Die Stufen führen von den Kreditarten über Tilgungsrechnung, Reihenfolge und Umschuldung bis zu der Frage, ab wann Tilgen der Geldanlage vorzuziehen ist – und was passiert, wenn man beides gleichzeitig versucht.',
  ],
  keywords: [
    'Kredit',
    'Schulden',
    'Effektivzins',
    'Tilgung',
    'Dispokredit',
    'Ratenkredit',
    'Umschuldung',
    'Sondertilgung',
  ],
  related: ['zinseszins', 'immobilien', 'budget-und-sparquote', 'tagesgeld'],
  calculators: ['/rechner/haushaltsrechner', '/rechner/zinsrechner'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Kredite einfach erklärt: Zinsen, Raten, Kosten',
      metaDescription:
        'Welche Kreditarten es gibt, was der Effektivzins bedeutet, warum der Dispo so teuer ist und wie eine Rate sich aus Zins und Tilgung zusammensetzt.',
      title: 'Was ein Kredit tatsächlich kostet',
      lead: 'Die Kreditarten, die Zusammensetzung einer Rate – und die einzige Zahl, mit der sich Angebote vergleichen lassen.',
      readingMinutes: 9,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Der Zinseszins ist beim Sparen der stärkste Verbündete. Beim Kredit ist es dieselbe Mechanik mit umgekehrtem Vorzeichen – nur zu einem Satz, den auf der Anlageseite niemand verlässlich erreicht. Deshalb steht dieses Thema vor allen Anlagethemen: Wer teure Schulden hat, hat seine beste Geldanlage schon gefunden.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Kreditarten und ihr Preis',
        },
        {
          type: 'table',
          caption: 'Vier Formen und wofür sie taugen',
          head: ['Art', 'Merkmal', 'Einordnung'],
          rows: [
            [
              'Dispositionskredit',
              'Überziehung des Girokontos, jederzeit verfügbar',
              'Die teuerste Alltagsform, häufig zweistellig verzinst. Für kurze Überbrückungen gedacht, nicht für Monate',
            ],
            [
              'Ratenkredit',
              'Feste Summe, feste Laufzeit, feste Rate',
              'Planbar und meist deutlich billiger als der Dispo – aber selten wirklich günstig',
            ],
            [
              'Null-Prozent-Finanzierung',
              'Beim Händler, ohne ausgewiesene Zinsen',
              'Die Kosten stecken im Preis. Der Prüfstein ist der Barzahlungsrabatt: Wird einer gewährt, war die Finanzierung nicht kostenlos',
            ],
            [
              'Immobilienkredit',
              'Große Summe, lange Laufzeit, Grundschuld als Sicherheit',
              'Der mit Abstand niedrigste Zins – weil die Bank im Ernstfall auf die Immobilie zugreifen kann',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Warum der Dispo so besonders teuer ist',
          items: [
            'Er ist unbesichert, jederzeit abrufbar und wird ohne Prüfung des Einzelfalls gewährt. Die Bank preist das ein.',
            'Er hat keine Laufzeit und keinen Tilgungsplan. Genau das macht ihn gefährlich: Ohne Termin wird nichts abgebaut, und der Zins läuft weiter.',
            'Ein dauerhaft genutzter Dispo lässt sich fast immer durch einen Ratenkredit ablösen – zu einem Bruchteil des Zinses und mit einem Enddatum. Das ist einer der wenigen Fälle, in denen ein neuer Kredit die richtige Antwort ist.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was in einer Rate steckt',
        },
        {
          type: 'paragraph',
          text: `Jede Rate besteht aus zwei Teilen: dem **Zins** auf die noch offene Schuld und der **Tilgung**, die diese Schuld verringert. Weil die Restschuld sinkt, sinkt auch der Zinsanteil – und der Tilgungsanteil wächst entsprechend. Bei einem Darlehen über ${formatCurrencyRounded(IMMOBILIE.summe)} zu ${formatPercent(IMMOBILIE.zinsProzent, 1)} mit zwei Prozent Anfangstilgung sieht die erste Rate so aus: ${formatCurrencyRounded(ersteRate.zins)} Zins, ${formatCurrencyRounded(ersteRate.tilgung)} Tilgung.`,
        },
        {
          type: 'paragraph',
          text: 'Zu Beginn geht also deutlich mehr als die Hälfte der Rate an die Bank und nicht an die Schuld. Das dreht sich mit der Zeit um – aber langsam, und wie langsam, hängt an einer einzigen Stellschraube.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die niedrige Rate ist die teure',
        },
        {
          type: 'paragraph',
          text: `Derselbe Kredit über ${formatCurrencyRounded(RATENKREDIT.summe)} zu ${formatPercent(RATENKREDIT.zinsProzent, 0)}, nur mit verschiedenen Laufzeiten:`,
        },
        {
          type: 'table',
          caption: `Ratenkredit über ${formatCurrencyRounded(RATENKREDIT.summe)} zu ${formatPercent(RATENKREDIT.zinsProzent, 0)}`,
          head: [
            'Laufzeit',
            'Monatliche Rate',
            'Zinsen insgesamt',
            'Rückzahlung insgesamt',
          ],
          rows: laufzeitreihe.map((zeile) => [
            `${zeile.jahre} Jahre`,
            formatCurrencyRounded(zeile.rate),
            formatCurrencyRounded(zeile.zinsenGesamt),
            formatCurrencyRounded(zeile.gesamtkosten),
          ]),
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die Rechnung, die in keinem Werbetext steht',
          items: [
            `Von ${kurzeLaufzeit.jahre} auf ${langeLaufzeit.jahre} Jahre sinkt die Rate um ${formatPercent(ratenersparnis, 0)} – und die Zinssumme steigt auf das ${formatNumber(zinsfaktor, 1)}-Fache.`,
            'Beworben wird immer die Rate, weil sie in den Monatshaushalt passen muss. Bezahlt wird die letzte Spalte.',
            'Die Laufzeit ist der Hebel mit der größten Wirkung. Wer sie verkürzen kann, spart mehr als durch jede Zinsverhandlung.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Effektivzins: die einzige vergleichbare Zahl',
        },
        {
          type: 'paragraph',
          text: 'Der **Nominalzins** ist der reine Zinssatz. Der **Effektivzins** enthält zusätzlich die Bearbeitungskosten, den Zahlungsrhythmus und den Zeitpunkt der Verrechnung. Nur er ist vergleichbar – und nur er muss in Deutschland angegeben werden.',
        },
        {
          type: 'list',
          items: [
            '**„Ab 2,9 Prozent“ ist kein Angebot.** Bonitätsabhängige Zinsen bedeuten, dass dieser Satz an die beste Bonitätsklasse geht. Was für dich gilt, steht erst im individuellen Angebot – und liegt oft deutlich darüber. Der Gesetzgeber verlangt deshalb die Angabe eines repräsentativen Beispiels; das ist die aussagekräftigere Zahl.',
            '**Restschuldversicherungen** werden häufig mitverkauft und erhöhen die tatsächlichen Kosten erheblich. Ist sie nicht zwingend Bedingung des Kredits, muss sie auch nicht im Effektivzins stehen – und genau deshalb steht sie oft nicht darin.',
            '**Konditionsanfrage statt Kreditanfrage.** Eine echte Kreditanfrage wird bei der Auskunftei vermerkt und kann die Bewertung verschlechtern. Seriöse Vergleichsportale stellen eine reine Konditionsanfrage, die keinen Eintrag hinterlässt – wer vergleicht, sollte darauf ausdrücklich achten.',
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
            'Der Dispo ist die teuerste Alltagsform und hat keinen Tilgungsplan – beides zusammen macht ihn gefährlich.',
            'Am Anfang geht der größere Teil der Rate an den Zins, nicht an die Schuld.',
            'Eine niedrigere Rate senkt nicht die Kosten, sie erhöht sie – über die längere Laufzeit.',
            'Vergleichbar ist nur der Effektivzins, und auch der nicht, wenn eine Restschuldversicherung danebensteht.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Schulden abbauen: Tilgungsplan, Reihenfolge, Umschuldung',
      metaDescription:
        'Wie Tilgungspläne funktionieren, welche Restschuld nach der Zinsbindung bleibt und wann sich eine Umschuldung tatsächlich rechnet.',
      title: 'Schulden gezielt abbauen',
      lead: 'Was ein Tilgungssatz über die Laufzeit entscheidet, welche Reihenfolge bei mehreren Schulden gilt – und was nach der Zinsbindung übrig bleibt.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Der Tilgungssatz entscheidet alles',
        },
        {
          type: 'paragraph',
          text: `Bei Immobilienkrediten wird in Deutschland nicht die Laufzeit vereinbart, sondern der **anfängliche Tilgungssatz**. Aus ihm und dem Zins ergibt sich die Rate – und aus der Rate erst die Laufzeit. Wer diesen Zusammenhang nicht kennt, wählt die Laufzeit versehentlich. Ein Darlehen über ${formatCurrencyRounded(IMMOBILIE.summe)} zu ${formatPercent(IMMOBILIE.zinsProzent, 1)}:`,
        },
        {
          type: 'table',
          caption: `Anfangstilgung und ihre Folgen – ${formatCurrencyRounded(IMMOBILIE.summe)} zu ${formatPercent(IMMOBILIE.zinsProzent, 1)}`,
          head: [
            'Anfangstilgung',
            'Rate',
            'Laufzeit',
            `Restschuld nach ${ZINSBINDUNG} Jahren`,
            'Zinsen insgesamt',
          ],
          rows: tilgungsreihe.map((zeile) => [
            formatPercent(zeile.satz, 0),
            formatCurrencyRounded(zeile.rate),
            `${formatNumber(zeile.jahre, 1)} Jahre`,
            formatCurrencyRounded(zeile.restschuld),
            formatCurrencyRounded(zeile.zinsenGesamt),
          ]),
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die erste Zeile ist die eigentliche Warnung',
          items: [
            'Ein Prozent Anfangstilgung führt zu einer Laufzeit von über vierzig Jahren – und zu einer Zinssumme, die fast das gesamte Darlehen noch einmal ausmacht.',
            `Der Schritt von einem auf zwei Prozent Anfangstilgung kostet ${formatPercent(rateMehr, 0)} mehr Rate – und spart ${formatPercent(zinsErsparnis, 0)} der gesamten Zinsen. Kaum eine andere Entscheidung im Kreditbereich hat ein solches Verhältnis.`,
            'Niedrige Anfangstilgungen wurden in der Niedrigzinsphase üblich, weil sie die Rate klein hielten. Bei den heutigen Zinsen bedeuten sie eine Laufzeit, die über den Ruhestand hinausreicht.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Restschuld nach der Zinsbindung',
        },
        {
          type: 'paragraph',
          text: `Die vorletzte Spalte der Tabelle ist die am meisten unterschätzte Zahl beim Immobilienkauf. Der Zins ist nur für die Dauer der Zinsbindung festgeschrieben – üblich sind zehn oder fünfzehn Jahre. Danach muss die Restschuld zu den dann geltenden Konditionen weiterfinanziert werden, und die kennt heute niemand. Bei einem Prozent Anfangstilgung stehen nach ${ZINSBINDUNG} Jahren noch rund ${formatPercent((tilgungsreihe[0].restschuld / IMMOBILIE.summe) * 100, 0)} der ursprünglichen Summe offen.`,
        },
        {
          type: 'list',
          items: [
            '**Längere Zinsbindung** verschiebt das Risiko nach hinten und kostet einen Aufschlag. Bei niedrigem Zinsniveau ist dieser Aufschlag die vermutlich sinnvollste Versicherung, die es im Kreditbereich gibt.',
            '**Sondertilgungsrechte** – meist fünf Prozent der Summe pro Jahr – sind kostenlos, wenn sie im Vertrag stehen, und teuer, wenn sie nachträglich verlangt werden. Sie sind auch dann zu vereinbaren, wenn man sie nicht sicher nutzen wird.',
            '**Das gesetzliche Kündigungsrecht** nach zehn Jahren gilt unabhängig von der vereinbarten Zinsbindung: Nach zehn Jahren ab vollständiger Auszahlung kann mit sechs Monaten Frist gekündigt werden, ohne Vorfälligkeitsentschädigung. Eine Zinsbindung über fünfzehn oder zwanzig Jahre ist damit einseitig – sie bindet die Bank, nicht dich.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Reihenfolge bei mehreren Schulden',
        },
        {
          type: 'table',
          caption: 'Zwei Methoden',
          head: ['Methode', 'Regel', 'Stärke'],
          rows: [
            [
              'Lawine',
              'Zuerst den Kredit mit dem höchsten Zins',
              'Rechnerisch immer die günstigste Variante – ohne Ausnahme',
            ],
            [
              'Schneeball',
              'Zuerst den kleinsten Betrag',
              'Der erste abbezahlte Kredit kommt früher; das erhöht die Wahrscheinlichkeit, dranzubleiben',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Die Lawinenmethode ist mathematisch überlegen, und der Abstand ist bei üblichen Beträgen klein. Die Schneeballmethode gewinnt trotzdem oft in der Praxis, weil ein sichtbarer Erfolg nach wenigen Monaten mehr trägt als eine rechnerische Optimierung, die man nach einem Jahr aufgibt. Bei sehr unterschiedlichen Zinssätzen – Dispo gegen Immobilienkredit – gibt es diese Wahl allerdings nicht: Der Dispo geht immer zuerst.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Sparen und teure Schulden gleichzeitig',
          items: [
            'Wer bei zehn Prozent Dispozins gleichzeitig Geld zu zwei Prozent anlegt, verliert die Differenz jedes Jahr – bei jeder Marktlage und ohne Ausnahme.',
            'Der Vorgang ist ein Musterbeispiel für mentale Buchführung: Zwei Töpfe werden getrennt betrachtet, und die Rechnung über beide zusammen wird nicht aufgemacht.',
            'Die einzige begründete Ausnahme ist der Notgroschen. Ihn aufzulösen, um zu tilgen, führt beim nächsten unerwarteten Betrag zurück in den Dispo – dann hat man beides verloren.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Umschulden',
        },
        {
          type: 'paragraph',
          text: 'Eine Umschuldung löst einen teuren Kredit durch einen billigeren ab. Sie rechnet sich nur, wenn alle Kosten in den Vergleich kommen – und der wichtigste davon fällt bei der Ablösung an.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Vorfälligkeitsentschädigung.** Bei Immobilienkrediten darf die Bank den entgangenen Zinsgewinn ersetzt verlangen, wenn vor Ablauf der Zinsbindung abgelöst wird. Der Betrag kann fünfstellig sein. Bei Verbraucherkrediten ist er gesetzlich gedeckelt – auf ein Prozent der Restschuld, bei einer Restlaufzeit unter einem Jahr auf ein halbes.',
            '**Fehlerhafte Widerrufsbelehrung.** Ist die Belehrung im Kreditvertrag fehlerhaft, kann das Widerrufsrecht über die übliche Frist hinaus fortbestehen. Ob das im Einzelfall trägt, ist eine Rechtsfrage – geprüft haben das in der Vergangenheit vor allem Verbraucherzentralen und Fachanwälte.',
            '**Restschuldversicherung.** Sie kostet oft einen erheblichen Teil der Kreditsumme und leistet nur in eng definierten Fällen. Sie ist grundsätzlich freiwillig; wird sie zur Bedingung gemacht, gehört sie in den Effektivzins. Wer eine Absicherung braucht, bekommt sie über eine Risikolebensversicherung meist deutlich günstiger.',
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
            'Der Tilgungssatz bestimmt die Laufzeit – ein Prozent bedeutet über vierzig Jahre.',
            'Die Restschuld nach der Zinsbindung ist das eigentliche Risiko eines Immobilienkredits.',
            'Nach zehn Jahren kann jeder Immobilienkredit ohne Entschädigung gekündigt werden.',
            'Sparen bei gleichzeitig teuren Schulden ist ein sicherer Verlust – außer beim Notgroschen.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Tilgen oder anlegen? Der Vergleich nach Steuern',
      metaDescription:
        'Warum Tilgung eine risikolose Rendite ist, wie der Vergleich nach Steuern aussieht, wann Schuldzinsen absetzbar sind und was ein Kredit als Hebel anrichtet.',
      title: 'Tilgen oder anlegen',
      lead: 'Wie sich beides sauber vergleichen lässt – und warum die Antwort selten am reinen Zinsvergleich hängt.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Der Vergleich, den fast alle falsch aufstellen',
        },
        {
          type: 'paragraph',
          text: 'Die übliche Rechnung lautet: Kreditzins drei Prozent, erwartete Aktienrendite sieben Prozent, also anlegen. Sie ist an zwei Stellen falsch aufgestellt, und beide gehen in dieselbe Richtung.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Was die Rechnung übersieht',
          items: [
            '**Tilgung ist risikolos.** Der Ertrag steht exakt fest: Er beträgt den Kreditzins, und zwar sicher. Die Anlagerendite ist eine Erwartung mit erheblicher Streuung. Beide Zahlen dürfen nicht ohne Weiteres verglichen werden – der faire Vergleichspartner der Tilgung ist eine ebenso sichere Anlage, und die bringt deutlich weniger als sieben Prozent.',
            '**Steuern wirken nur auf einer Seite.** Kapitalerträge unterliegen der Abgeltungsteuer samt Solidaritätszuschlag; ersparte Schuldzinsen sind kein Ertrag und werden nicht besteuert. Aus sieben Prozent Bruttorendite werden nach Steuern gut fünf – aus drei Prozent Tilgungsersparnis bleiben drei.',
            '**Der Effekt auf die Liquidität.** Getilgtes Geld ist gebunden, angelegtes ist verfügbar. Bei einem Immobilienkredit ist das ein echter Nachteil der Tilgung, und er ist der Grund, warum der Notgroschen auch bei laufendem Kredit stehen bleibt.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Als Größenordnung lässt sich daraus eine belastbare Regel ableiten: Bei Kreditzinsen im zweistelligen Bereich gewinnt die Tilgung praktisch immer. Im mittleren einstelligen Bereich wird es eine Abwägung zwischen Sicherheit und Erwartung. Unterhalb von etwa zwei bis drei Prozent nach Steuern spricht mehr für die Anlage – vorausgesetzt, der Anlagehorizont ist lang genug, dass die Erwartung überhaupt tragen kann.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wo Schuldzinsen absetzbar sind',
        },
        {
          type: 'table',
          caption: 'Die steuerliche Behandlung hängt am Zweck',
          head: ['Fall', 'Absetzbar?', 'Folge'],
          rows: [
            [
              'Vermietete Immobilie',
              'Ja, als Werbungskosten bei den Vermietungseinkünften',
              'Der effektive Zins sinkt um den persönlichen Steuersatz – die Tilgung wird entsprechend weniger attraktiv',
            ],
            [
              'Selbstgenutzte Immobilie',
              'Nein',
              'Es gibt keine Einkunftsart, der die Zinsen zuzuordnen wären. Der Zins wirkt in voller Höhe',
            ],
            [
              'Konsumkredit',
              'Nein',
              'Wie bei der Selbstnutzung: voller Zins, keine Entlastung',
            ],
            [
              'Wertpapierkredit',
              'In aller Regel nein',
              'Bei Einkünften aus Kapitalvermögen ist der Abzug tatsächlicher Werbungskosten grundsätzlich ausgeschlossen – der Sparerpauschbetrag tritt an ihre Stelle',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Die letzte Zeile ist die folgenreichste und wird bei Anlagen auf Kredit regelmäßig übersehen: Die Zinsen des Kredits mindern die Steuerlast nicht, die Erträge der Anlage erhöhen sie. Die Rechnung ist damit schlechter, als der bloße Vergleich von Kreditzins und Anlagerendite vermuten lässt.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Förderkredite und Bausparverträge',
          items: [
            '**Zinsverbilligte Förderkredite** für Modernisierung oder energetische Sanierung liegen unter dem Marktzins und teils mit Tilgungszuschuss. Sie sind meist an konkrete Maßnahmen und Nachweise gebunden – der Antrag muss vor Beginn der Arbeiten gestellt werden, ein häufiger und dann nicht mehr heilbarer Fehler.',
            '**Ein Bausparvertrag** ist wirtschaftlich zwei Verträge: eine Sparphase mit niedriger Verzinsung und ein Darlehensrecht zu einem heute festgelegten Zins. Bewerten lässt er sich nur als Ganzes – die schlechte Verzinsung der Sparphase ist der Preis der Zinssicherung.',
            'Die typische Fehleinschätzung besteht darin, nur eine der beiden Phasen anzusehen. Wer das Darlehen später nicht abruft, hat eine schlecht verzinste Spareinlage bezahlt und nichts dafür bekommen.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Kredit als Hebel',
        },
        {
          type: 'paragraph',
          text: 'Fremdkapital erhöht die Rendite auf das eingesetzte Eigenkapital, solange die Gesamtrendite über dem Kreditzins liegt – der **Leverage-Effekt**. Er ist keine Meinung, sondern Arithmetik. Und er wirkt in beide Richtungen mit derselben Verstärkung.',
        },
        {
          type: 'list',
          items: [
            '**Bei Immobilien** ist er der Normalfall und der eigentliche Grund für die Vermögenswirkung des Immobilienkaufs. Er ist dort vergleichsweise beherrschbar, weil der Kredit nicht kurzfristig fällig gestellt wird, solange die Rate fließt.',
            '**Bei Wertpapieren** ist er das nicht. Ein **Lombard- oder Wertpapierkredit** ist durch das Depot besichert, und der Beleihungswert sinkt mit den Kursen. Fallende Kurse lösen deshalb eine Nachschussforderung genau dann aus, wenn Nachschießen am schwersten fällt.',
            '**Die doppelte Wirkung im Abschwung.** Kurse fallen, gleichzeitig steigt die geforderte Sicherheit. Wer nicht nachschießen kann, wird zwangsweise verkauft – am Tiefpunkt, ohne Wahl. Das ist derselbe Mechanismus wie bei Derivaten: aus einem Verlustrisiko wird ein Liquiditätsrisiko.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die Grenze kommt aus dem Einkommen, nicht aus dem Zinssatz',
          items: [
            'Die belastbare Frage lautet nicht „rechnet es sich?“, sondern „was passiert bei Einkommensausfall, Zinsanstieg nach der Bindung und einem Marktrückgang – gleichzeitig?“',
            'Diese drei treten häufiger zusammen auf als unabhängig voneinander, weil sie eine gemeinsame Ursache haben können: eine Rezession.',
            'Wer die Rate nur bei laufendem Einkommen und niedrigem Zins tragen kann, hat keinen Hebel, sondern eine Wette auf das Ausbleiben normaler Ereignisse.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Keine Steuer- oder Rechtsberatung',
          items: [
            'Absetzbarkeit, Vorfälligkeitsentschädigung und Widerrufsrechte hängen an der konkreten Vertragsgestaltung und an einer Rechtsprechung, die sich fortentwickelt.',
            'Bei größeren Beträgen gehört das zu jemandem mit Zulassung – Steuerberatung zur Absetzbarkeit, Rechtsberatung zum Vertrag.',
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
            'Tilgung liefert eine risikolose Rendite in Höhe des Kreditzinses – der faire Vergleich ist eine sichere Anlage, nicht der Aktienmarkt.',
            'Kapitalerträge werden besteuert, ersparte Schuldzinsen nicht; der Vergleich gehört nach Steuern geführt.',
            'Bei Kapitalanlagen sind Kreditzinsen in aller Regel nicht absetzbar – die Rechnung ist schlechter, als sie aussieht.',
            'Ein Wertpapierkredit macht aus einem Kursrückgang eine Zwangsliquidation; die Grenze der Verschuldung kommt aus dem Einkommen.',
          ],
        },
      ],
    },
  },
}
