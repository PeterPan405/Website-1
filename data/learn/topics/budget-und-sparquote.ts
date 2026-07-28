import type { LearnTopic } from '@/data/learn/types'
import { calculateBudget, calculateCompoundInterest } from '@/lib/finance'
import { formatCurrencyRounded, formatPercent } from '@/lib/format'
import {
  haushaltAusgaben as AUSGABEN,
  haushaltEinnahmen as EINNAHMEN,
  hebelAusgang as AUSGANG,
  hebelMehrRate as MEHR_RATE,
  hebelMehrRendite as MEHR_RENDITE,
  hebelZeitraeume as ZEITRAEUME,
} from '@/lib/lernszenarien'

/*
  Beide Rechnungen dieses Themas laufen über die Funktionen der Website.

  Das ist hier mehr als Bequemlichkeit: Der Haushaltsrechner und der
  Zinsrechner stehen auf derselben Seite verlinkt. Käme der Fließtext zu
  anderen Zahlen als der Rechner daneben, wäre das der peinlichste Fehler,
  den dieses Thema haben kann.
*/

const haushalt = calculateBudget([...EINNAHMEN], [...AUSGABEN])

/*
  Die zweite Rechnung: Welcher Hebel wiegt schwerer – mehr sparen oder mehr
  Rendite? Die Antwort hängt am Zeitraum, und genau das wird oft unterschlagen.
  Deshalb wird der Wechselpunkt hier gesucht statt behauptet.
*/

function endkapital(rate: number, rendite: number, jahre: number): number {
  return calculateCompoundInterest({
    principal: 0,
    contribution: rate,
    interval: 'monthly',
    annualRatePercent: rendite,
    years: jahre,
  }).finalBalance
}

function hebelVergleich(jahre: number) {
  const basis = endkapital(AUSGANG.rate, AUSGANG.rendite, jahre)
  return {
    jahre,
    basis,
    durchRate: endkapital(AUSGANG.rate + MEHR_RATE, AUSGANG.rendite, jahre) - basis,
    durchRendite: endkapital(AUSGANG.rate, AUSGANG.rendite + MEHR_RENDITE, jahre) - basis,
  }
}

const hebelreihe = ZEITRAEUME.map(hebelVergleich)

/** Das erste Jahr, in dem der Renditehebel den Sparhebel überholt. */
const wechseljahr = (() => {
  for (let jahre = 1; jahre <= 50; jahre++) {
    const zeile = hebelVergleich(jahre)
    if (zeile.durchRendite > zeile.durchRate) return jahre
  }
  return null
})()

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner ermittelt die eigene Sparquote und zeigt an einem
 * durchgerechneten Haushalt, was dabei herauskommt. Fortgeschritten behandelt
 * Kontenmodelle, unregelmäßige Ausgaben und die Quote über die Zeit. Profi
 * stellt Sparhebel und Renditehebel gegeneinander und sucht den Punkt, an dem
 * sich das Verhältnis umkehrt.
 */
export const budgetUndSparquote: LearnTopic = {
  slug: 'budget-und-sparquote',
  title: 'Budget & Sparquote',
  headline: 'Der Betrag, der alles andere bestimmt',
  metaTitle: 'Budget und Sparquote: Haushaltsplan richtig aufstellen',
  metaDescription:
    'Wie du deine tatsächlichen Ausgaben ermittelst, eine belastbare Sparquote berechnest und wann der gesparte Betrag mehr entscheidet als die Rendite.',
  lead: 'Bevor die Frage „worin anlegen“ sinnvoll wird, steht die Frage „wie viel“ – und die beantwortet nur ein Haushaltsplan.',
  overview: [
    'Die Sparquote ist der Anteil des Einkommens, der nach allen Ausgaben übrig bleibt. Sie ist die einzige Größe der Geldanlage, die vollständig in der eigenen Hand liegt – die Rendite ist es nicht.',
    'In den ersten Jahren entscheidet sie deutlich mehr als die Rendite, weil der Zinseszins noch kaum Masse hat, auf die er wirken könnte. Wann sich das umkehrt, wird in der Profi-Stufe ausgerechnet statt behauptet.',
    'Die Stufen führen von der ehrlichen Bestandsaufnahme über Kontenmodelle und den Umgang mit unregelmäßigen Ausgaben bis zu der Frage, wo das Sparen an seine Grenze kommt und die Einkommensseite übernehmen muss.',
  ],
  keywords: [
    'Sparquote',
    'Haushaltsbuch',
    'Budget',
    'Fixkosten',
    'Notgroschen',
    'Ausgaben',
  ],
  related: ['worauf-achten-einsteiger', 'tagesgeld', 'zinseszins', 'schulden-und-kredit'],
  calculators: ['/rechner/haushaltsrechner', '/rechner/zinsrechner'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Sparquote berechnen: der erste Haushaltsplan',
      metaDescription:
        'Was eine Sparquote ist, wie du deine echten Ausgaben ermittelst und warum Schätzungen dabei fast immer zu niedrig ausfallen.',
      title: 'Wie viel bleibt tatsächlich übrig?',
      lead: 'Wie du deine Sparquote ermittelst – und warum die geschätzte Zahl fast nie stimmt.',
      readingMinutes: 8,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Fast jeder Text über Geldanlage beginnt mit der Frage, worin man anlegen soll. Die Frage davor wird übersprungen, dabei ist sie die wichtigere: Wie viel Geld ist überhaupt da? Und darauf gibt es nur eine belastbare Antwort – die aus den eigenen Kontoauszügen.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was die Sparquote ist',
        },
        {
          type: 'paragraph',
          text: 'Die Sparquote ist der Anteil deines Nettoeinkommens, der nach **allen** Ausgaben übrig bleibt. Nicht nach den Fixkosten – nach allen. Der Unterschied ist der Grund, warum die meisten ihre Quote zu hoch einschätzen: Der Betrag nach Miete und Versicherungen sieht deutlich besser aus als der Betrag am Monatsende.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Sparen und Anlegen sind zwei Schritte',
          items: [
            '**Sparen** heißt: Der Betrag verlässt das Girokonto und wird nicht ausgegeben.',
            '**Anlegen** heißt: Der gesparte Betrag wird investiert und schwankt dafür.',
            'Erst das eine, dann das andere. Wer anlegt, bevor ein Notgroschen steht, verkauft im ersten Ernstfall zum falschen Zeitpunkt.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die eigenen Ausgaben ehrlich erfassen',
        },
        {
          type: 'paragraph',
          text: 'Schätzen funktioniert nicht. Nimm drei Monate Kontoauszüge und sortiere jede Buchung in eine Kategorie. Drei Monate deshalb, weil ein einzelner Monat immer untypisch ist – irgendetwas ist immer.',
        },
        {
          type: 'list',
          items: [
            '**Fixkosten:** Miete, Strom, Versicherungen, Abonnements, Mobilfunk. Gleich hoch, gleicher Termin.',
            '**Variable Kosten:** Lebensmittel, Freizeit, Kleidung, Tanken. Schwanken monatlich, aber sie sind da.',
            '**Jahreskosten:** Kfz-Versicherung, Urlaub, Weihnachten, Rundfunkbeitrag. Sie tauchen in einem beliebigen Dreimonatsfenster nicht auf und reißen später das Budget.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Zwei Fehler, die fast alle machen',
          items: [
            '**Bargeld als Kategorie.** „Abhebung 200 €“ ist keine Ausgabe, sondern ein Versteck. Wenn viel bar läuft, muss dieser Teil eine Woche lang notiert werden – sonst fehlt der größte unklare Posten.',
            '**Jahreskosten vergessen.** Wer nur drei Monate ansieht, übersieht sie systematisch. Rechne sie zusammen, teile durch zwölf und trage den Betrag als monatliche Position ein.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Ein durchgerechnetes Beispiel',
        },
        {
          type: 'paragraph',
          text: `Ein Haushalt mit ${formatCurrencyRounded(haushalt.totalIncome)} netto im Monat. Die Ausgaben sind vollständig erfasst, einschließlich einer monatlichen Rücklage für die Jahreskosten:`,
        },
        {
          type: 'table',
          caption: 'Ausgaben nach Größe – Anteil an den Gesamtausgaben',
          head: ['Position', 'Betrag im Monat', 'Anteil'],
          rows: haushalt.expenseShares.map((posten) => [
            posten.label,
            formatCurrencyRounded(posten.amount),
            formatPercent(posten.sharePercent, 0),
          ]),
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Was daraus folgt',
          items: [
            `Ausgaben insgesamt: ${formatCurrencyRounded(haushalt.totalExpenses)}. Es bleiben ${formatCurrencyRounded(haushalt.balance)} übrig.`,
            `Das ist eine Sparquote von ${formatPercent(haushalt.savingsRatePercent, 1)} – über dem Durchschnitt und ohne Verzicht erreichbar, weil hier nichts vergessen wurde.`,
            `Notgroschen als drei bis sechs Monatsausgaben: ${formatCurrencyRounded(haushalt.emergencyFundRange.min)} bis ${formatCurrencyRounded(haushalt.emergencyFundRange.max)}.`,
            `Mit dem Überschuss dauert der Aufbau der unteren Grenze ${haushalt.monthsToEmergencyFund} Monate. Erst danach beginnt das Anlegen.`,
          ],
        },
        {
          type: 'paragraph',
          text: 'Die Zahl, die dabei am meisten überrascht, ist fast immer der Anteil des Wohnens. Er ist zugleich der einzige Posten, an dem eine Änderung wirklich etwas bewegt – dazu mehr in der Profi-Stufe.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der erste Plan',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Die 50/30/20-Regel als Startpunkt.** Die Hälfte für Notwendiges, dreißig Prozent für Wünsche, zwanzig Prozent fürs Sparen. In Städten mit hoher Miete geht sie nicht auf – dann ist sie kein Ziel, sondern eine Diagnose.',
            '**Zuerst sparen, nicht zuletzt.** Ein Dauerauftrag am Tag nach dem Geldeingang. Was nicht auf dem Girokonto liegt, wird nicht ausgegeben; was am Monatsende übrig bleiben soll, bleibt es selten.',
            '**Notgroschen vor Anlage.** Drei bis sechs Monatsausgaben auf dem Tagesgeldkonto. Er verdient wenig und soll das auch – seine Aufgabe ist, im Ernstfall da zu sein.',
          ],
        },
        {
          type: 'figure',
          figure: 'budget-haushalt',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Die Sparquote ist der Betrag nach allen Ausgaben, nicht nach den Fixkosten.',
            'Drei Monate Kontoauszüge auswerten statt schätzen – Schätzungen fallen zu niedrig aus.',
            'Jahreskosten durch zwölf teilen und monatlich einplanen.',
            'Gespart wird zuerst, per Dauerauftrag, und der Notgroschen steht vor der ersten Anlage.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Budget steuern: Kontenmodelle und Jahreskosten',
      metaDescription:
        'Kontenmodelle im Vergleich, wie unregelmäßige Ausgaben planbar werden und wie eine Sparquote Gehaltssprünge und Einkommensausfälle übersteht.',
      title: 'Ein Budget, das im Alltag hält',
      lead: 'Welche Methoden funktionieren, wie unregelmäßige Ausgaben eingeplant werden und woran Budgets in der Praxis scheitern.',
      readingMinutes: 10,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Ein Budget aufzustellen ist die kleinere Aufgabe. Es im dritten Monat noch zu haben, ist die eigentliche. Fast alle Methoden, die daran scheitern, haben denselben Fehler: Sie verlangen jeden Monat eine Entscheidung.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Drei Methoden im Vergleich',
        },
        {
          type: 'table',
          caption: 'Aufwand gegen Genauigkeit',
          head: ['Methode', 'Wie sie funktioniert', 'Passt zu'],
          rows: [
            [
              'Drei-Konten-Modell',
              'Gehaltskonto für den Eingang, Ausgabenkonto für den Alltag, Rücklagenkonto für Jahreskosten und Notgroschen',
              'Fast allen. Wenig Aufwand, klare Trennung, läuft nach der Einrichtung von allein',
            ],
            [
              'Unterkonten je Zweck',
              'Digitale Fassung der Umschlagmethode: je ein Unterkonto für Urlaub, Auto, Geschenke',
              'Wer mehrere größere Ziele parallel ansparen will',
            ],
            [
              'Zero-Based-Budget',
              'Jeder Euro des Monatseinkommens bekommt vorab eine Aufgabe, bis null übrig ist',
              'Wer die Ausgabenseite wirklich umbauen will – genau, aber aufwendig',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Automatisierung schlägt Disziplin',
          items: [
            'Jede Buchung, die per Dauerauftrag läuft, ist eine Entscheidung weniger. Entscheidungen sind die knappe Größe, nicht das Geld.',
            'Reihenfolge am Monatsanfang: erst die Sparrate, dann die Rücklage für Jahreskosten, dann der Rest aufs Ausgabenkonto.',
            'Was auf dem Ausgabenkonto liegt, darf ohne schlechtes Gewissen ausgegeben werden. Genau das macht das Modell haltbar.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Unregelmäßige Ausgaben planbar machen',
        },
        {
          type: 'paragraph',
          text: 'Budgets scheitern selten am Alltag. Sie scheitern an der Kfz-Versicherung im Januar, der Nebenkostenabrechnung im Mai und dem Urlaub im August. Diese Posten sind alle bekannt – nur eben nicht monatlich.',
        },
        {
          type: 'paragraph',
          text: 'Das Gegenmittel ist unspektakulär: Alle Jahreskosten zusammenzählen, durch zwölf teilen, den Betrag monatlich auf das Rücklagenkonto überweisen. Er verschwindet damit aus dem verfügbaren Geld – und die Rechnung im Januar trifft ein Konto, auf dem sie erwartet wird.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Rücklage und Notgroschen sind nicht dasselbe',
          items: [
            '**Die Rücklage** ist für Geplantes: Versicherung, Urlaub, Weihnachten. Sie wird jedes Jahr aufgebraucht, das ist ihr Zweck.',
            '**Der Notgroschen** ist für Ungeplantes: Waschmaschine, Autoreparatur, Einkommensausfall. Er wird nur im Ernstfall angefasst.',
            'In einem gemeinsamen Topf frisst das Geplante das Ungeplante. Der Urlaub wird gebucht, und der Notgroschen war nur noch eine Zahl.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Quote über die Zeit halten',
        },
        {
          type: 'paragraph',
          text: 'Der häufigste Grund für eine sinkende Sparquote ist keine Krise, sondern eine Gehaltserhöhung. Die Ausgaben steigen mit – neue Wohnung, größeres Auto, besseres Abonnement –, und nach einem Jahr bleibt prozentual weniger übrig als vorher. Der Vorgang heißt **Lifestyle-Inflation** und läuft ohne bewusste Entscheidung ab.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Die Regel der halben Erhöhung',
          items: [
            'Von jeder Gehaltserhöhung wandert die Hälfte sofort in die Sparrate, die andere Hälfte steht zur Verfügung.',
            'Der Reiz liegt darin, dass sie ohne Verzicht auskommt: Es bleibt mehr Geld als vorher – nur eben nicht alles zusätzliche.',
            'Angepasst wird am besten im selben Monat, in dem die Erhöhung kommt. Danach ist der höhere Betrag Gewohnheit.',
          ],
        },
        {
          type: 'list',
          items: [
            '**Bei schwankendem Einkommen** wird eine Untergrenze festgelegt, kein fester Betrag: In guten Monaten mehr, aber nie weniger als die Untergrenze. Ein Prozentsatz vom Eingang funktioniert dafür besser als ein Eurobetrag.',
            '**Bei Einkommensausfall** wird die Sparrate gesenkt, bevor Schulden aufgenommen werden. Ein pausierter Sparplan kostet Rendite; ein Dispokredit kostet zweistellige Zinsen.',
            '**Nach einer Pause** wird nicht nachgeholt. Der Versuch, ein „verlorenes“ Jahr aufzuholen, überlastet das Budget genau dann, wenn es sich gerade erholt hat.',
          ],
        },
        {
          type: 'figure',
          figure: 'budget-sparquote-jahre',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Das Drei-Konten-Modell reicht für die meisten und läuft nach der Einrichtung ohne Entscheidungen.',
            'Jahreskosten durch zwölf teilen und auf ein eigenes Konto legen – getrennt vom Notgroschen.',
            'Die halbe Gehaltserhöhung sparen, im selben Monat, in dem sie kommt.',
            'Bei schwankendem Einkommen eine Untergrenze statt eines Fixbetrags festlegen.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Sparquote gegen Rendite: welcher Hebel wann größer ist',
      metaDescription:
        'Wann der gesparte Betrag mehr bringt als eine höhere Rendite, wie Inflation eine feste Sparrate entwertet und wo das Sparen an seine Grenze kommt.',
      title: 'Sparquote, Rendite und Zeit',
      lead: 'Der Punkt, an dem der Renditehebel den Sparhebel überholt – ausgerechnet statt behauptet.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Zwei Hebel, ein Vergleich',
        },
        {
          type: 'paragraph',
          text: `Wer mehr Vermögen aufbauen will, hat genau zwei Stellschrauben: mehr einzahlen oder mehr Rendite erzielen. Welche wiegt schwerer? Die Antwort hängt allein am Zeitraum. Ausgangspunkt ist ein Sparplan über ${formatCurrencyRounded(AUSGANG.rate)} im Monat bei ${formatPercent(AUSGANG.rendite, 0)} jährlich. Verglichen wird, was ${formatCurrencyRounded(MEHR_RATE)} mehr im Monat bringen – und was ein Prozentpunkt mehr Rendite bringt.`,
        },
        {
          type: 'table',
          caption: `Zusätzliches Endkapital je Hebel, ausgehend von ${formatCurrencyRounded(AUSGANG.rate)} bei ${formatPercent(AUSGANG.rendite, 0)}`,
          head: [
            'Zeitraum',
            'Basis',
            `+ ${formatCurrencyRounded(MEHR_RATE)} im Monat`,
            `+ ${formatPercent(MEHR_RENDITE, 0)} Rendite`,
          ],
          rows: hebelreihe.map((zeile) => [
            `${zeile.jahre} Jahre`,
            formatCurrencyRounded(zeile.basis),
            `+ ${formatCurrencyRounded(zeile.durchRate)}`,
            `+ ${formatCurrencyRounded(zeile.durchRendite)}`,
          ]),
        },
        {
          type: 'paragraph',
          text: `Nach zehn Jahren bringt die höhere Sparrate ungefähr das Dreifache des Renditehebels. Nach vierzig Jahren ist es umgekehrt. Der Wechsel liegt bei etwa **${wechseljahr} Jahren** – ab dann wiegt der eine Prozentpunkt schwerer als die ${formatCurrencyRounded(MEHR_RATE)}.`,
        },
        {
          type: 'figure',
          figure: 'budget-hebel',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Warum das so ist',
          items: [
            'Der Sparhebel wirkt linear: Jeder zusätzliche Euro ist einmal da und verzinst sich dann normal mit.',
            'Der Renditehebel wirkt auf den gesamten Bestand – und der ist am Anfang klein. Ein Prozentpunkt auf 5.000 Euro sind 50 Euro im Jahr.',
            'Deshalb ist die Reihenfolge klar: In den ersten Jahren bringt jede Stunde, die in die Sparquote geht, mehr als jede Stunde Produktvergleich. Später kehrt sich das um – aber dann steht die Produktwahl längst.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Die Zahlen hängen an den gewählten Annahmen, und genau deshalb steht der Zinsrechner der Website daneben: Wer die eigene Rate und den eigenen Zeitraum einsetzt, bekommt seinen eigenen Wechselpunkt – der kann deutlich früher oder später liegen.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Quote real betrachten',
        },
        {
          type: 'paragraph',
          text: 'Eine Sparrate, die zehn Jahre unverändert bleibt, ist nach zehn Jahren keine gleich hohe Sparrate mehr. Die Ausgaben steigen mit der Inflation, das Einkommen meist ebenfalls – nur der feste Eurobetrag steht still und ist damit ein sinkender Anteil des Einkommens.',
        },
        {
          type: 'list',
          items: [
            '**Dynamisierung.** Die Sparrate einmal jährlich um die Inflationsrate anheben. Wer sie stattdessen als Prozentsatz des Nettoeinkommens definiert, bekommt die Anpassung geschenkt.',
            '**Die Mietfalle.** Steigt die Miete stärker als das Einkommen, sinkt die Sparquote, ohne dass sich am Verhalten etwas geändert hätte. Bei einem hohen Wohnkostenanteil ist das der Posten, der die Quote über die Jahre auffrisst.',
            '**Nominal gegen real.** Eine Quote von zwölf Prozent bleibt zwölf Prozent, auch wenn die Preise steigen – ein fester Betrag von 300 Euro tut das nicht. Das ist der praktische Grund, in Prozent zu planen statt in Euro.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wo das Sparen an seine Grenze kommt',
        },
        {
          type: 'paragraph',
          text: 'Die Ausgabenseite hat einen Boden. Irgendwann sind die Abonnements gekündigt, der Stromanbieter gewechselt und die Versicherungen geprüft – und der Ertrag weiterer Optimierung liegt bei zwanzig Euro im Monat, für die ein Wochenende draufgeht.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die einzigen Hebel mit echter Größe',
          items: [
            '**Wohnen.** Meist der größte Einzelposten. Eine Änderung hier bewegt mehr als alle kleinen Posten zusammen – und ist genau deshalb auch die unbequemste.',
            '**Mobilität.** Ein Auto kostet mit Abschreibung, Versicherung, Steuer, Sprit und Wartung deutlich mehr als die monatliche Rate suggeriert. Wer ohne auskommt, hebt seine Sparquote spürbar.',
            '**Die Einkommensseite.** Ab einem gewissen Punkt ist mehr Einkommen der einzige verbleibende Hebel: Gehaltsverhandlung, Qualifikation, Wechsel. Sie wird in Ratgebern selten genannt, weil sie sich nicht in einer Liste abarbeiten lässt.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Und es gibt eine Obergrenze nach der anderen Seite. Eine Quote, die jeden Restaurantbesuch und jede Reise ausschließt, wird nach zwei Jahren aufgegeben – meist zusammen mit dem Sparplan. Die durchhaltbare Quote schlägt die maximale, weil ein abgebrochener Plan keine Rendite hat.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            `In den ersten Jahren wiegt die Sparrate schwerer als die Rendite; der Wechsel liegt hier bei etwa ${wechseljahr} Jahren.`,
            'Die Sparquote in Prozent des Einkommens planen, nicht als festen Eurobetrag – sonst entwertet die Inflation sie.',
            'Wohnen, Mobilität und Einkommen sind die einzigen Hebel mit relevanter Größe.',
            'Die durchhaltbare Quote schlägt die maximale.',
          ],
        },
      ],
    },
  },
}
