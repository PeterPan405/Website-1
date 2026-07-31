import type { LearnTopic } from '@/data/learn/types'
import { formatCurrencyRounded, formatNumber, formatPercent } from '@/lib/format'
/*
  Die einzige Stelle, an der eine Datei unter `data/` etwas aus `lib/` holt.

  `lib/zins-beispiele.ts` und `lib/finance.ts` sind reine Rechnung ohne eigene
  Datenabhängigkeit – es entsteht also kein Kreis. Der Grund für die Ausnahme:
  Die Zahlen dieses Themas stehen zusätzlich in den Grafiken daneben. Als
  Literale geschrieben wären das zwei Quellen für dieselbe Zahl, und beim
  Anlegen dieses Moduls hat sich gezeigt, dass sie längst auseinandergelaufen
  waren – die Sparplantabelle wies 478.000 Euro aus, gerechnet sind es rund
  454.000.
*/
import {
  grundbeispiel,
  grundbeispielReihe,
  kostenbeispiel,
  kostenbeispielBrutto,
  kostenbeispielReihe,
  sparbeispiel,
  sparbeispielReihe,
} from '@/lib/zins-beispiele'

const grundreihe = grundbeispielReihe()
const stuetzjahre = grundreihe.filter((punkt) =>
  (grundbeispiel.jahre as readonly number[]).includes(punkt.jahr)
)
const sparfaelle = sparbeispielReihe()
const kostenfaelle = kostenbeispielReihe()
/** Was der Unterschied zwischen der billigsten und der teuersten Variante kostet. */
const kostenspanne =
  kostenfaelle[0].endkapital - kostenfaelle[kostenfaelle.length - 1].endkapital

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner erklärt den Mechanismus und die Verdopplungszeit,
 * Fortgeschritten rechnet mit Sparraten, unterjähriger Verzinsung, Kosten und
 * Realzins, Profi behandelt geometrisches Mittel, Volatilitätsbremse,
 * Sequenzrisiko und den Steuerstundungseffekt.
 */
export const zinseszins: LearnTopic = {
  slug: 'zinseszins',
  title: 'Zinseszins',
  headline: 'Das achte Weltwunder: der Zinseszins',
  metaTitle: 'Zinseszins erklärt: Formel, Wirkung und Grenzen',
  metaDescription:
    'Wie aus Zinsen auf Zinsen Vermögen entsteht, warum die Zeit stärker wirkt als der Betrag und wo Kosten, Steuern und Inflation den Effekt aufzehren.',
  lead: 'Zinseszins ist der einzige Mechanismus im Finanzwesen, der ohne weitere Arbeit funktioniert – vorausgesetzt, man lässt ihn lange genug laufen.',
  overview: [
    'Zinseszins bedeutet, dass auch die bereits erhaltenen Erträge wieder Erträge erzielen. Aus einem linearen Zuwachs wird dadurch ein exponentieller – und exponentielles Wachstum unterschätzt das menschliche Bauchgefühl systematisch.',
    'Der Effekt ist keine Erfindung von Anlageprodukten. Er ist reine Mathematik und wirkt in beide Richtungen: beim Vermögensaufbau für dich, bei Inflation, Kreditzinsen und Fondskosten gegen dich.',
    'Dieses Thema führt von der Grundformel über Sparpläne und Realzins bis zu den Punkten, an denen die einfache Rechnung in der Praxis nicht mehr trägt: schwankende Renditen, Steuern während der Laufzeit und die Reihenfolge der Renditejahre in der Entnahmephase.',
  ],
  keywords: [
    'Zinseszins',
    'Zinseszinsformel',
    'exponentielles Wachstum',
    '72er-Regel',
    'Sparplan',
    'Realzins',
    'Effektivzins',
  ],
  related: ['tagesgeld', 'cost-average-sparplan', 'etf', 'rente', 'sparerpauschbetrag'],
  calculators: ['/rechner/zinsrechner', '/rechner/inflationsrechner'],
  symbols: ['msci-world'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Zinseszins einfach erklärt – mit Beispielen',
      metaDescription:
        'Was Zinseszins bedeutet, wie die Formel funktioniert, wie du die Verdopplungszeit im Kopf ausrechnest und warum früh anfangen mehr bringt als viel sparen.',
      title: 'Zinseszins einfach erklärt',
      lead: 'Nach dieser Stufe kannst du die Grundformel anwenden, die Verdopplungszeit im Kopf schätzen und einschätzen, warum Zeit der wichtigste Faktor ist.',
      readingMinutes: 8,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Du legst 1.000 Euro zu 5 Prozent an. Nach einem Jahr hast du 1.050 Euro. Im zweiten Jahr bekommst du wieder 5 Prozent – aber nicht auf 1.000 Euro, sondern auf 1.050 Euro. Also 52,50 Euro statt 50 Euro. Diese 2,50 Euro sind der Zinseszins: Zinsen auf Zinsen.',
        },
        {
          type: 'paragraph',
          text: 'Im ersten Jahr wirkt das lächerlich klein. Genau deshalb wird der Effekt so gründlich unterschätzt. Über lange Zeiträume dominiert er alles andere.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Einfacher Zins und Zinseszins im Vergleich',
        },
        {
          type: 'paragraph',
          text: 'Bei **einfachem Zins** werden die Erträge jedes Jahr entnommen. Das Kapital bleibt gleich, der Zuwachs ist jedes Jahr identisch – eine Gerade. Bei **Zinseszins** bleiben die Erträge liegen und verzinsen sich mit. Der Zuwachs wird jedes Jahr größer – eine Kurve, die immer steiler wird.',
        },
        {
          type: 'figure',
          figure: 'zins-gerade-vs-kurve',
        },
        {
          type: 'table',
          caption: `${formatCurrencyRounded(grundbeispiel.kapital)} bei ${formatPercent(grundbeispiel.zinssatz, 0)} – mit und ohne Wiederanlage der Erträge`,
          head: ['Jahr', 'Einfacher Zins', 'Zinseszins', 'Differenz'],
          rows: stuetzjahre.map((punkt) => [
            String(punkt.jahr),
            formatCurrencyRounded(punkt.einfach),
            formatCurrencyRounded(punkt.zinseszins),
            formatCurrencyRounded(punkt.zinseszins - punkt.einfach),
          ]),
        },
        {
          type: 'paragraph',
          text: 'Nach zehn Jahren ist der Unterschied überschaubar. Nach vierzig Jahren ist das Zinseszins-Ergebnis dreifach so hoch. Der Zinssatz ist in beiden Spalten identisch – der einzige Unterschied ist, dass die Erträge liegen bleiben.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Formel',
        },
        {
          type: 'formula',
          expression: 'Endkapital = Startkapital × (1 + Zinssatz)^Jahre',
          description:
            'Der Zinssatz wird als Dezimalzahl eingesetzt: 5 Prozent sind 0,05. Das Hochzeichen bedeutet „hoch“ – bei 10 Jahren also (1,05) zehnmal mit sich selbst multipliziert.',
        },
        {
          type: 'paragraph',
          text: 'Ein Beispiel zum Nachrechnen: 5.000 Euro, 4 Prozent, 15 Jahre. 1,04 hoch 15 ergibt rund 1,801. Multipliziert mit 5.000 Euro sind das **9.005 Euro**. Von den 4.005 Euro Zuwachs stammen 3.000 Euro aus dem einfachen Zins und rund 1.005 Euro aus dem Zinseszins.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die 72er-Regel',
        },
        {
          type: 'paragraph',
          text: 'Für den Alltag genügt eine Näherung im Kopf: Teile 72 durch den Zinssatz in Prozent, und du erhältst die Zahl der Jahre bis zur Verdopplung.',
        },
        {
          type: 'formula',
          expression: 'Verdopplungszeit in Jahren ≈ 72 / Zinssatz in Prozent',
          description:
            'Bei 6 Prozent: 72 / 6 = 12 Jahre. Bei 3 Prozent: 24 Jahre. Bei 9 Prozent: 8 Jahre. Im Bereich von 4 bis 12 Prozent ist die Näherung auf wenige Monate genau.',
        },
        {
          type: 'paragraph',
          text: 'Die Regel funktioniert in beide Richtungen. Bei 3 Prozent Inflation halbiert sich die Kaufkraft deines Geldes in etwa 24 Jahren. Bei 12 Prozent Zinsen auf einen Dispokredit verdoppelt sich die Schuld in sechs Jahren, wenn nichts zurückgezahlt wird.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Warum Zeit stärker wirkt als der Betrag',
        },
        {
          type: 'paragraph',
          text: 'In der Formel steht der Zinssatz im Exponenten, das Startkapital nur als Faktor. Doppeltes Startkapital verdoppelt das Ergebnis. Doppelte Laufzeit **quadriert** den Wachstumsfaktor. Das ist der entscheidende Unterschied.',
        },
        {
          type: 'figure',
          figure: 'zins-frueh-vs-spaet',
        },
        {
          type: 'table',
          caption: `Alle sparen ${formatCurrencyRounded(sparbeispiel.rate)} monatlich bei ${formatPercent(sparbeispiel.zinssatz, 0)} – bis zum ${sparbeispiel.endalter}. Lebensjahr`,
          head: ['Start mit', 'Eingezahlt', 'Endkapital', 'davon Erträge'],
          rows: sparfaelle.map((fall) => [
            `${fall.startalter} Jahren`,
            formatCurrencyRounded(fall.eingezahlt),
            formatCurrencyRounded(fall.endkapital),
            formatCurrencyRounded(fall.ertraege),
          ]),
        },
        {
          type: 'paragraph',
          text: 'Wer mit 25 anfängt, zahlt nicht einmal doppelt so viel ein wie jemand, der mit 45 beginnt – landet aber bei rund dem Vierfachen. **Die zehn Jahre am Anfang sind wertvoller als die zehn Jahre am Ende**, weil das Geld aus den ersten Jahren am längsten arbeiten kann.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Was daraus praktisch folgt',
          items: [
            'Früh mit kleinen Beträgen anzufangen schlägt spätes Anfangen mit großen Beträgen. Die Höhe der Rate lässt sich später anpassen, verlorene Jahre nicht.',
            'Erträge nicht entnehmen. Ein Fonds, der Erträge automatisch wieder anlegt (thesaurierend), erledigt das ohne dein Zutun.',
            'Unterbrechungen sind teurer als eine niedrigere Rate. Lieber 50 Euro dauerhaft als 300 Euro mit Pausen.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Effekt arbeitet auch gegen dich',
        },
        {
          type: 'paragraph',
          text: 'Dieselbe Mathematik gilt für alles, was prozentual wächst. Bei **Inflation** verliert dein Geld jedes Jahr auf den bereits verringerten Wert weiter an Kaufkraft. Bei **Kreditzinsen** wachsen Schulden exponentiell, wenn nicht getilgt wird. Und bei **Fondskosten** wirkt eine jährliche Gebühr nicht nur auf die Einzahlung, sondern jedes Jahr auf das gesamte angesparte Vermögen.',
        },
        {
          type: 'paragraph',
          text: 'Ein Prozentpunkt jährliche Kosten klingt nach wenig. Über 30 Jahre kostet er rund ein Viertel des Endvermögens – nicht ein Prozent. Warum das so ist, rechnet die Stufe „Fortgeschritten“ vor.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Eine wichtige Einschränkung',
          items: [
            'Die Formel setzt einen **festen** Zinssatz voraus. Bei Tagesgeld oder Anleihen ist das für einen bestimmten Zeitraum realistisch. Bei Aktien und Fonds gibt es keinen festen Satz – dort schwankt die Rendite jedes Jahr, teils deutlich negativ.',
            'Rechnungen mit „6 Prozent pro Jahr“ sind für Aktienanlagen deshalb Modellrechnungen, keine Prognosen. Der tatsächliche Verlauf sieht nie wie eine glatte Kurve aus.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Selbst ausprobieren',
          items: [
            'Der Zinsrechner rechnet Startkapital, Sparrate, Zinssatz und Laufzeit in beliebiger Kombination durch und zeigt, welcher Anteil des Ergebnisses aus Einzahlungen und welcher aus Erträgen stammt.',
          ],
        },
      ],
    },

    // --------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Zinseszins fortgeschritten: Sparraten, Effektivzins, Kosten',
      metaDescription:
        'Sparplanformel, unterjährige Verzinsung und Effektivzins, der exakte Realzins sowie die Frage, wie stark laufende Kosten das Endvermögen wirklich schmälern.',
      title: 'Zinseszins mit Sparraten und Kosten',
      lead: 'Die Grundformel reicht nur für eine Einmalanlage. Hier kommen regelmäßige Einzahlungen, Zinsperioden, Inflation und Kosten dazu.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Die Formel der Einsteigerstufe beschreibt eine einmalige Anlage, die unangetastet liegen bleibt. Realistisch ist meist eine Mischung: ein Startbetrag plus monatliche Einzahlungen, verzinst nicht jährlich, sondern häufiger – und belastet mit Kosten und Steuern.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Regelmäßige Einzahlungen',
        },
        {
          type: 'paragraph',
          text: 'Jede einzelne Sparrate hat ihre eigene Laufzeit: Die erste Rate verzinst sich über die volle Zeit, die letzte praktisch gar nicht. Die Summe all dieser Teilbeträge ergibt die Sparplanformel.',
        },
        {
          type: 'formula',
          expression: 'Endkapital = Rate × ((1 + i)^n − 1) / i',
          description:
            'i ist der Zinssatz **je Periode**, n die Anzahl der Perioden. Bei monatlichen Raten und 6 Prozent Jahreszins ist i = 0,06 / 12 = 0,005 und n = Jahre × 12. Ein vorhandenes Startkapital wird separat mit der Grundformel gerechnet und addiert.',
          rechner: {
            pfad: '/rechner/zinsrechner',
            werte: { start: 0, rate: 200, intervall: 'monthly', zins: 6, jahre: 30 },
            text: '200 € monatlich zu 6 Prozent über 30 Jahre im Zinsrechner öffnen',
          },
        },
        {
          type: 'paragraph',
          text: 'Beispiel: 200 Euro monatlich, 6 Prozent, 30 Jahre. i = 0,005, n = 360. Der Klammerausdruck ergibt rund 1,0043 hoch... ausgerechnet: **rund 200.900 Euro**. Eingezahlt wurden 72.000 Euro. Knapp 129.000 Euro sind Erträge – fast zwei Drittel des Endvermögens.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Vorschüssig oder nachschüssig',
          items: [
            'Die Formel oben nimmt an, dass die Rate am **Ende** jeder Periode eingeht (nachschüssig). Zahlst du am Monatsanfang (vorschüssig), verzinst sich jede Rate einen Monat länger: Ergebnis × (1 + i).',
            'Der Unterschied beträgt bei monatlichen Raten weniger als ein Prozent – für Vergleiche zwischen Anbietern aber relevant, weil beide Varianten verwendet werden.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Zinsperioden: nominal ist nicht effektiv',
        },
        {
          type: 'paragraph',
          text: 'Je häufiger Zinsen gutgeschrieben werden, desto früher verzinsen sie sich mit. 12 Prozent im Jahr sind daher nicht dasselbe wie 1 Prozent pro Monat.',
        },
        {
          type: 'formula',
          expression: 'Effektivzins = (1 + Nominalzins / m)^m − 1',
          description:
            'm ist die Anzahl der Zinsperioden pro Jahr. Bei 12 Prozent nominal und monatlicher Verzinsung: (1 + 0,01)^12 − 1 = 12,68 Prozent effektiv.',
        },
        {
          type: 'table',
          caption: '12 Prozent nominal bei unterschiedlicher Zinsgutschrift',
          head: ['Gutschrift', 'Perioden pro Jahr', 'Effektivzins'],
          rows: [
            ['jährlich', '1', '12,00 %'],
            ['halbjährlich', '2', '12,36 %'],
            ['vierteljährlich', '4', '12,55 %'],
            ['monatlich', '12', '12,68 %'],
            ['täglich', '365', '12,747 %'],
            ['stetig', '∞', '12,750 %'],
          ],
        },
        {
          type: 'paragraph',
          text: 'Der Zuwachs läuft gegen eine Grenze – die stetige Verzinsung mit e hoch Zinssatz. Deshalb ist „täglich statt monatlich“ als Werbeargument nahezu bedeutungslos. Beim Vergleich von Angeboten ist immer der **Effektivzins** die richtige Zahl, nicht der Nominalzins.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was nach Inflation übrig bleibt',
        },
        {
          type: 'paragraph',
          text: 'Die Näherung „Realzins = Nominalzins − Inflation“ genügt für kleine Werte. Korrekt ist die Division, weil beide Effekte multiplikativ wirken.',
        },
        {
          type: 'formula',
          expression: 'Realzins = (1 + Nominalzins) / (1 + Inflationsrate) − 1',
          description:
            'Bei 6 Prozent Rendite und 2,5 Prozent Inflation: 1,06 / 1,025 − 1 = 3,41 Prozent. Die Näherung hätte 3,5 Prozent ergeben – über 30 Jahre macht diese Kleinigkeit rund 8 Prozent Endvermögen aus.',
        },
        {
          type: 'paragraph',
          text: 'Für langfristige Planungen ist die reale Betrachtung die einzige sinnvolle: Ein Endkapital von 500.000 Euro in 35 Jahren sagt nichts, solange nicht klar ist, was man dann dafür kaufen kann. Rechne besser durchgehend in heutiger Kaufkraft – also mit dem Realzins und ohne Inflationsaufschlag auf die Sparrate.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Kosten: der teuerste Prozentpunkt deines Lebens',
        },
        {
          type: 'paragraph',
          text: 'Laufende Kosten eines Fonds werden jährlich vom gesamten Vermögen abgezogen, nicht von der Einzahlung. Sie schmälern damit genau die Basis, auf der der Zinseszins arbeitet – und ihre Wirkung wächst mit der Zeit ebenso exponentiell wie die Rendite.',
        },
        {
          type: 'figure',
          figure: 'zins-kosten',
        },
        {
          type: 'table',
          caption: `${formatCurrencyRounded(kostenbeispiel.rate)} monatlich über ${kostenbeispiel.jahre} Jahre, ${formatPercent(kostenbeispiel.bruttoRendite, 0)} Bruttorendite – ohne Kosten wären es ${formatCurrencyRounded(kostenbeispielBrutto())}`,
          head: ['Laufende Kosten', 'Nettorendite', 'Endkapital', 'Kosten gesamt'],
          rows: kostenfaelle.map((fall) => [
            formatPercent(fall.quote, 2),
            formatPercent(fall.nettoRendite, 2),
            formatCurrencyRounded(fall.endkapital),
            formatCurrencyRounded(fall.kosten),
          ]),
        },
        {
          type: 'paragraph',
          text: `Von ${formatPercent(kostenfaelle[0].quote, 1)} auf ${formatPercent(kostenfaelle[kostenfaelle.length - 1].quote, 1)} Kosten – ein Unterschied von ${formatNumber(kostenfaelle[kostenfaelle.length - 1].quote - kostenfaelle[0].quote, 1)} Prozentpunkten pro Jahr – kostet hier rund **${formatCurrencyRounded(kostenspanne)}**, also mehr als zwei Drittel der gesamten Einzahlungen. Das ist der Grund, warum bei langfristigen Anlagen die Kostenquote wichtiger ist als fast jedes Auswahlkriterium: Sie ist die einzige Größe, die im Voraus bekannt ist.`,
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Nicht nur die TER zählt',
          items: [
            'Die laufende Kostenquote (TER) enthält nicht alles. Transaktionskosten im Fonds, Ausführungsgebühren des Brokers und – bei Versicherungsmänteln – Abschluss- und Verwaltungskosten kommen dazu.',
            'Bei fondsgebundenen Versicherungen liegen die Gesamtkosten häufig deutlich über den Werten der Tabelle. Die entscheidende Frage lautet nicht „Wie hoch ist die TER?“, sondern „Was geht insgesamt pro Jahr vom Vermögen ab?“.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Steuern während der Laufzeit',
        },
        {
          type: 'paragraph',
          text: 'Solange Erträge unversteuert im Vermögen bleiben, verzinsen sie sich vollständig mit. Wird jedes Jahr Steuer fällig, fehlt der abgeführte Betrag für alle Folgejahre – der Zinseszins arbeitet auf einer kleineren Basis.',
        },
        {
          type: 'paragraph',
          text: 'In Deutschland greift bei Fonds die **Vorabpauschale**: Auch ohne Verkauf wird jährlich ein pauschaler Betrag versteuert, sofern der Fondswert gestiegen ist. Sie ist eine Vorauszahlung – beim späteren Verkauf werden die bereits versteuerten Beträge angerechnet, doppelt gezahlt wird nicht. Der Zinseszinsvorteil vollständiger Steuerstundung entfällt damit aber teilweise.',
        },
        {
          type: 'paragraph',
          text: 'Der **Sparerpauschbetrag** ist hier besonders wirksam: Wer die Vorabpauschale mit einem Freistellungsauftrag abdeckt, zahlt während der Ansparphase faktisch keine Steuer und behält den vollen Zinseszinseffekt.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Renditelüge des Durchschnitts',
        },
        {
          type: 'paragraph',
          text: 'Ein Fonds macht in Jahr 1 plus 50 Prozent, in Jahr 2 minus 50 Prozent. Der Durchschnitt ist null – aus 100 Euro wurden aber 75 Euro. Aus 150 minus die Hälfte sind 75.',
        },
        {
          type: 'figure',
          figure: 'zins-volatilitaetsbremse',
        },
        {
          type: 'formula',
          expression: 'Tatsächliche Rendite p. a. = (Endwert / Startwert)^(1/n) − 1',
          description:
            'Das **geometrische Mittel**. Im Beispiel: (75/100)^(1/2) − 1 = −13,4 Prozent pro Jahr. Das arithmetische Mittel von 0 Prozent beschreibt kein erreichbares Ergebnis.',
        },
        {
          type: 'paragraph',
          text: 'Für Zinseszinsrechnungen ist immer das geometrische Mittel die richtige Größe. Es liegt bei schwankenden Renditen stets unter dem arithmetischen – und die Differenz wächst mit der Schwankungsbreite. Das ist keine Rechenkosmetik, sondern der Kern der Frage, warum Risiko nicht automatisch belohnt wird. Die Stufe „Profi“ quantifiziert diesen Effekt.',
        },
      ],
    },

    // ------------------------------------------------------------------- Profi
    profi: {
      metaTitle: 'Zinseszins für Profis: Volatilitätsbremse und Sequenzrisiko',
      metaDescription:
        'Volatilitätsbremse, zeit- und geldgewichtete Rendite, Sequenzrisiko und Steuerstundung – wo die Zinseszinsformel praktisch versagt.',
      title: 'Zinseszins auf Profi-Niveau',
      lead: 'Warum Schwankung Rendite kostet, weshalb die Reihenfolge der Jahre bei Entnahmen entscheidend ist und was Steuerstundung wirklich wert ist.',
      readingMinutes: 14,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Bis hierher war die Rendite eine Zahl. In der Realität ist sie eine Verteilung, und das ändert die Ergebnisse grundlegend. Diese Stufe behandelt vier Punkte, an denen die einfache Zinseszinsformel systematisch zu optimistische Antworten liefert.',
        },
        {
          type: 'heading',
          level: 2,
          text: '1. Die Volatilitätsbremse',
        },
        {
          type: 'paragraph',
          text: 'Zwei Anlagen mit identischer Durchschnittsrendite, aber unterschiedlicher Schwankungsbreite führen zu unterschiedlichem Endvermögen. Die schwankungsärmere gewinnt – immer. Der Grund ist die Asymmetrie von Prozentrechnung: Ein Minus von 50 Prozent erfordert ein Plus von 100 Prozent zum Ausgleich.',
        },
        {
          type: 'formula',
          expression: 'geometrische Rendite ≈ arithmetische Rendite − σ² / 2',
          description:
            'σ ist die Standardabweichung der Jahresrenditen. Bei 8 Prozent Durchschnitt und 20 Prozent Schwankung: 0,08 − 0,04/2 = **6 Prozent** tatsächlich erzielbare Rendite pro Jahr. Zwei Prozentpunkte verschwinden allein durch die Schwankung.',
        },
        {
          type: 'table',
          caption: 'Wirkung der Schwankungsbreite bei 8 Prozent Durchschnittsrendite',
          head: [
            'Schwankung σ',
            'Abzug σ²/2',
            'Effektiv p. a.',
            'aus 10.000 € in 30 Jahren',
          ],
          rows: [
            ['5 %', '0,13 %', '7,87 %', '97.400 €'],
            ['15 %', '1,13 %', '6,87 %', '73.500 €'],
            ['25 %', '3,13 %', '4,87 %', '41.300 €'],
            ['35 %', '6,13 %', '1,87 %', '17.400 €'],
          ],
        },
        {
          type: 'paragraph',
          text: 'Alle vier Zeilen haben denselben Erwartungswert von 8 Prozent pro Jahr. Das erreichbare Endvermögen unterscheidet sich um den Faktor fünf. **Deshalb ist Streuung nicht nur Risikomanagement, sondern eine Renditequelle:** Sie senkt σ bei praktisch unveränderter Durchschnittsrendite.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Konsequenz für Produktvergleiche',
          items: [
            'Eine Anlage mit 12 Prozent Durchschnitt und 40 Prozent Schwankung liefert geometrisch rund 4 Prozent – weniger als eine mit 7 Prozent Durchschnitt und 15 Prozent Schwankung (gut 5,9 Prozent).',
            'Wird eine Rendite ohne Angabe der Schwankungsbreite genannt, fehlt die Hälfte der Information.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: '2. Zeitgewichtet oder geldgewichtet?',
        },
        {
          type: 'paragraph',
          text: 'Bei laufenden Ein- und Auszahlungen gibt es zwei sinnvolle Renditebegriffe, die unterschiedliche Fragen beantworten.',
        },
        {
          type: 'list',
          items: [
            '**Zeitgewichtete Rendite (TWR):** Blendet Zahlungsströme aus und misst nur die Wertentwicklung der Anlage. Sie beantwortet: Wie gut war das Produkt? Fondsprospekte nennen diese Zahl.',
            '**Geldgewichtete Rendite (MWR, entspricht dem internen Zinsfuß IRR):** Berücksichtigt, wann wie viel Geld investiert war. Sie beantwortet: Wie gut war **mein** Ergebnis?',
          ],
        },
        {
          type: 'formula',
          expression: 'Σ Zahlungₜ / (1 + IRR)^t = 0',
          description:
            'Der interne Zinsfuß ist der Satz, bei dem alle Ein- und Auszahlungen zusammen den Wert null ergeben. Er lässt sich nicht direkt auflösen, sondern nur iterativ bestimmen – jede Tabellenkalkulation hat dafür eine Funktion.',
        },
        {
          type: 'paragraph',
          text: 'Die beiden Zahlen können weit auseinanderliegen. Wer nach einem starken Jahr große Summen nachschiebt und im Crash aufhört, hat eine deutlich schlechtere geldgewichtete als zeitgewichtete Rendite. Diese Differenz – in Studien als „Behavior Gap“ beschrieben – ist der messbare Preis für Timing-Versuche. Für die eigene Bilanz ist ausschließlich die geldgewichtete Rendite relevant.',
        },
        {
          type: 'heading',
          level: 2,
          text: '3. Sequenzrisiko: Die Reihenfolge entscheidet',
        },
        {
          type: 'paragraph',
          text: 'In der **Ansparphase** ist die Reihenfolge der Renditejahre gleichgültig – Multiplikation ist kommutativ. Sobald regelmäßig **entnommen** wird, gilt das nicht mehr. Dann entscheidet die Reihenfolge über das Ergebnis.',
        },
        {
          type: 'paragraph',
          text: 'Der Grund: Wer in einem Verlustjahr Anteile verkaufen muss, verkauft zu niedrigen Kursen. Diese Anteile fehlen dauerhaft und können an der späteren Erholung nicht mehr teilnehmen.',
        },
        {
          type: 'table',
          caption:
            '500.000 € Startvermögen, 24.000 € Entnahme pro Jahr, gleiche Renditen in unterschiedlicher Reihenfolge',
          head: ['Szenario', 'Erste drei Jahre', 'Vermögen nach 25 Jahren'],
          rows: [
            ['Schwacher Start', '−20 %, −12 %, −6 %', 'vorzeitig aufgebraucht'],
            ['Starker Start', '+18 %, +14 %, +9 %', 'deutlich über Startwert'],
          ],
        },
        {
          type: 'paragraph',
          text: 'Beide Szenarien enthalten exakt dieselben Jahresrenditen, nur in umgekehrter Reihenfolge – und dieselbe Durchschnittsrendite. Das Ergebnis unterscheidet sich fundamental. Eine Zinseszinsrechnung mit konstanter Rendite kann das Risiko einer Entnahmephase daher grundsätzlich nicht abbilden.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Wie man Sequenzrisiko begrenzt',
          items: [
            '**Liquiditätspuffer:** Zwei bis drei Jahresausgaben in Tagesgeld halten, um in Verlustjahren nicht verkaufen zu müssen.',
            '**Flexible Entnahme:** Die Entnahme in schwachen Jahren senken, statt einen festen Betrag zu erzwingen. Wirkt stärker als jede Produktauswahl.',
            '**Anlageklassen mischen:** Anleihen und Aktien fallen selten gleich stark; in Verlustjahren wird aus dem stabileren Teil entnommen.',
            '**Vorsicht mit der 4-Prozent-Regel:** Sie beruht auf historischen US-Daten für einen 30-Jahres-Zeitraum. Andere Kostenstruktur, andere Steuern und längere Ruhestände verändern das Ergebnis erheblich.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: '4. Was Steuerstundung wert ist',
        },
        {
          type: 'paragraph',
          text: 'Steuer, die erst am Ende anfällt, wirkt wie ein zinsloses Darlehen des Fiskus: Der noch nicht abgeführte Betrag arbeitet bis zum Verkauf mit. Bei langen Laufzeiten ist dieser Effekt erheblich.',
        },
        {
          type: 'paragraph',
          text: 'Zu vergleichen sind zwei Varianten mit identischer Bruttorendite: einmal jährliche Versteuerung der Erträge, einmal Versteuerung erst beim Verkauf am Ende. Über 30 Jahre liegt die gestundete Variante spürbar vorn – nicht wegen eines niedrigeren Steuersatzes, sondern weil der Zinseszins auf der größeren Basis arbeitet.',
        },
        {
          type: 'paragraph',
          text: 'In Deutschland begrenzt die **Vorabpauschale** diesen Vorteil: Ein pauschaler Betrag wird bereits während der Haltedauer besteuert. Vollständig aufgehoben wird die Stundung damit nicht, weil die Pauschale in der Regel unter dem tatsächlichen Wertzuwachs liegt und beim Verkauf angerechnet wird.',
        },
        {
          type: 'list',
          items: [
            '**Teilfreistellung:** Bei Fonds mit hohem Aktienanteil bleibt ein Teil der Erträge steuerfrei – als Ausgleich für die Vorbelastung auf Fondsebene. Für Einzelaktien gibt es diese Entlastung nicht.',
            '**Thesaurierend oder ausschüttend:** Ausschüttungen lösen Steuer aus und müssen anschließend aktiv wieder angelegt werden. Bei nicht ausgeschöpftem Sparerpauschbetrag kann eine Ausschüttung dennoch günstig sein, weil sie den Freibetrag nutzt, der sonst verfällt.',
            '**Verkaufsreihenfolge:** Deutsche Depots verkaufen nach dem FIFO-Prinzip – die ältesten Anteile zuerst, mit den größten aufgelaufenen Gewinnen. Bei geplanten Teilverkäufen lohnt es, das vorher einzuplanen.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Keine Steuerberatung',
          items: [
            'Vorabpauschale, Teilfreistellungssätze und Freibeträge werden regelmäßig angepasst. Die Darstellung erklärt den Mechanismus, sie ersetzt keine Beratung im Einzelfall.',
          ],
        },
        {
          type: 'figure',
          figure: 'zinseszins-steuerstundung',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Alles zusammen: eine ehrliche Rechnung',
        },
        {
          type: 'paragraph',
          text: 'Wer alle Effekte berücksichtigt, kommt von der Bruttorendite eines Aktienmarkts zu einem deutlich nüchterneren Wert:',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Erwartete Bruttorendite eines breiten Aktienmarkts: rund 8 Prozent nominal.',
            'Abzüglich Volatilitätsbremse bei σ von etwa 17 Prozent: rund 1,4 Prozentpunkte.',
            'Abzüglich laufender Produktkosten: 0,2 bis 0,5 Prozentpunkte bei kostengünstigen Indexfonds.',
            'Abzüglich Steuerwirkung während der Laufzeit: je nach Freibetragsnutzung 0 bis 0,5 Prozentpunkte.',
            'Abzüglich Inflation von etwa 2 Prozent für die reale Betrachtung.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Übrig bleiben grob **3,5 bis 4,5 Prozent realer Zuwachs pro Jahr**. Das ist erheblich weniger als die 8 Prozent der Werbebroschüre – und immer noch genug, um Kaufkraft in rund 16 bis 20 Jahren zu verdoppeln. Der Zinseszins bleibt der wirksamste Mechanismus, den Privatanleger haben. Er ist nur langsamer, als die einfache Formel suggeriert.',
        },
      ],
    },
  },
}
