import { FARBEN, SaeulenDiagramm } from '@/components/content/figures/Diagramme'
import { formatCurrencyRounded, formatNumber } from '@/lib/format'
import {
  auswerten,
  rateBeiTilgungssatz,
  restschuldNach,
  tilgungsplan,
} from '@/lib/kredit'
import {
  immobilieAnfangstilgung,
  immobilieDarlehenszins,
  immobilieDarlehensquote,
  immobilieKaufpreis,
  immobilienkredit,
  immobilienTilgungssaetze,
  immobilienZinsbindung,
} from '@/lib/lernszenarien'

/**
 * Die Grafiken zu Kredit und Immobilie.
 *
 * ## Warum ausgerechnet der Tilgungsverlauf
 *
 * Die Rate eines Annuitätendarlehens bleibt gleich – das ist der Punkt an der
 * Sache und zugleich das, was sie undurchsichtig macht. Was sich ändert, ist
 * die Aufteilung *innerhalb* der Rate: Am Anfang ist fast alles Zins, am Ende
 * fast alles Tilgung. Wer das nicht weiß, wundert sich nach fünf Jahren über
 * eine Restschuld, die kaum kleiner geworden ist.
 *
 * Als Tabelle steht diese Verschiebung im Text; als gestapelte Säule sieht man
 * sie in einem Blick.
 *
 * Alle Zahlen kommen aus `lib/kredit.ts`, die Annahmen aus
 * `lib/lernszenarien.ts` – dieselben, mit denen der Text rechnet.
 */

// ------------------------------------------------------- Zins gegen Tilgung

/** Die Anfangstilgung, die im Text als üblicher Fall durchgerechnet wird. */
const TILGUNG = 2

export function KreditTilgungsverlauf() {
  const rate = rateBeiTilgungssatz(immobilienkredit, TILGUNG)
  const plan = tilgungsplan(immobilienkredit, rate)
  const ergebnis = auswerten(immobilienkredit, rate)

  /*
    Gezeigt werden fünf Jahre über die Laufzeit verteilt, nicht alle.

    Bei rund vierzig Jahren Laufzeit wären vierzig Säulen so schmal, dass die
    Aufteilung in ihnen nicht mehr zu erkennen ist – und genau die ist der
    Inhalt der Grafik.
  */
  const laufzeitJahre = Math.ceil(plan.length / 12)
  const stuetzjahre = [1, 5, 10, 20, laufzeitJahre]

  const saeulen = stuetzjahre.map((jahr) => {
    const monate = plan.slice((jahr - 1) * 12, jahr * 12)
    const zins = monate.reduce((summe, monat) => summe + monat.zins, 0)
    const tilgung = monate.reduce((summe, monat) => summe + monat.tilgung, 0)
    return {
      label: `Jahr ${jahr}`,
      teile: [
        { wert: zins, farbe: FARBEN.gefahr },
        { wert: tilgung, farbe: FARBEN.marke },
      ],
      hinweis: `${formatNumber((tilgung / (zins + tilgung)) * 100, 0)} % Tilgung`,
    }
  })

  const erstes = saeulen[0]
  const letztes = saeulen[saeulen.length - 1]

  return (
    <SaeulenDiagramm
      id="kredit-zins-und-tilgung"
      saeulen={saeulen}
      einheit="Euro im Jahr"
      legende={[
        { farbe: FARBEN.gefahr, text: 'Zins' },
        { farbe: FARBEN.marke, text: 'Tilgung' },
      ]}
      hoehe={300}
      beschreibung={
        `Ein Darlehen über ${formatCurrencyRounded(immobilienkredit.summe)} zu ` +
        `${formatNumber(immobilienkredit.zinsProzent, 1)} Prozent mit ${TILGUNG} Prozent Anfangstilgung. ` +
        `Die Jahresrate bleibt über die gesamte Laufzeit gleich hoch – jede Säule ist gleich groß. ` +
        `Was sich verschiebt, ist ihre Aufteilung: Im ersten Jahr sind ${erstes.hinweis}, im letzten ` +
        `${letztes.hinweis}. Insgesamt läuft der Kredit ${formatNumber(ergebnis.monate / 12, 0)} Jahre, ` +
        `und es fallen ${formatCurrencyRounded(ergebnis.zinsenGesamt)} Zinsen an.`
      }
    />
  )
}

// ------------------------------------------------ Anfangstilgung und Laufzeit

export function KreditAnfangstilgung() {
  const saeulen = immobilienTilgungssaetze.map((satz) => {
    const rate = rateBeiTilgungssatz(immobilienkredit, satz)
    const ergebnis = auswerten(immobilienkredit, rate)
    return {
      label: `${satz} % Tilgung`,
      teile: [{ wert: ergebnis.monate / 12, farbe: FARBEN.akzent }],
      wertText: `${formatNumber(ergebnis.monate / 12, 0)} J.`,
      hinweis: `${formatCurrencyRounded(rate)} im Monat`,
    }
  })

  const langsam = immobilienTilgungssaetze[0]
  const zuegig = immobilienTilgungssaetze[1]
  const rateLangsam = rateBeiTilgungssatz(immobilienkredit, langsam)
  const rateZuegig = rateBeiTilgungssatz(immobilienkredit, zuegig)
  const jahreLangsam = auswerten(immobilienkredit, rateLangsam).monate / 12
  const jahreZuegig = auswerten(immobilienkredit, rateZuegig).monate / 12
  const restLangsam = restschuldNach(immobilienkredit, rateLangsam, immobilienZinsbindung)

  return (
    <SaeulenDiagramm
      id="kredit-anfangstilgung"
      saeulen={saeulen}
      einheit="Laufzeit in Jahren"
      hoehe={290}
      beschreibung={
        `Dasselbe Darlehen über ${formatCurrencyRounded(immobilienkredit.summe)}, vier Anfangstilgungen. ` +
        `Mit ${langsam} Prozent dauert die Rückzahlung ${formatNumber(jahreLangsam, 0)} Jahre, mit ` +
        `${zuegig} Prozent nur ${formatNumber(jahreZuegig, 0)} – bei einer Rate, die um ` +
        `${formatNumber(((rateZuegig - rateLangsam) / rateLangsam) * 100, 0)} Prozent höher liegt. ` +
        `Nach ${immobilienZinsbindung} Jahren Zinsbindung stehen bei der langsamsten Variante noch ` +
        `${formatCurrencyRounded(restLangsam)} offen, die dann zum unbekannten Zins der Zukunft neu ` +
        `finanziert werden müssen.`
      }
    />
  )
}

// ------------------------------------------------ Restschuld und Zinsbindung

/**
 * Wie wenig nach der Zinsbindung getilgt ist.
 *
 * ## Warum alle Säulen gleich hoch sind
 *
 * Sie zeigen dieselbe Darlehenssumme, aufgeteilt in getilgt und offen. Die
 * Aussage steckt nicht in der Höhe, sondern im Verhältnis – und dieses
 * Verhältnis ist der Punkt, an dem die meisten Finanzierungen falsch geplant
 * werden. Zehn Jahre lang eine Rate zu zahlen fühlt sich nach der Hälfte an;
 * getilgt ist knapp ein Fünftel.
 *
 * Der Grund steht in der Grafik daneben: Anfangs geht fast die ganze Rate für
 * Zinsen weg. Hier ist die Folge daraus zu sehen.
 *
 * Gerechnet wird mit `restschuldNach` – derselben Funktion, aus der auch die
 * Zahl in der Tabelle über der Grafik stammt.
 */
export function ImmobilieRestschuld() {
  const darlehen = {
    summe: immobilieKaufpreis * (immobilieDarlehensquote / 100),
    zinsProzent: immobilieDarlehenszins,
  }
  const rate = rateBeiTilgungssatz(darlehen, immobilieAnfangstilgung)
  const laufzeit = Math.round(auswerten(darlehen, rate).monate / 12)

  /*
    Die Stützjahre enthalten die Zinsbindung, weil sie der Anlass der Grafik
    ist – und das Laufzeitende, weil sonst offenbliebe, dass die Kurve
    überhaupt bei null ankommt. Der Rest teilt die Strecke grob auf.
  */
  const stuetzjahre = [5, immobilienZinsbindung, 20, laufzeit]

  const zeilen = stuetzjahre.map((jahr) => {
    const offen = restschuldNach(darlehen, rate, jahr)
    return {
      jahr,
      offen,
      getilgt: darlehen.summe - offen,
      anteil: (offen / darlehen.summe) * 100,
    }
  })

  const beiBindung = zeilen.find((zeile) => zeile.jahr === immobilienZinsbindung)!

  return (
    <SaeulenDiagramm
      id="immobilie-restschuld"
      einheit="Euro Darlehen"
      hoehe={300}
      legende={[
        { farbe: FARBEN.marke, text: 'getilgt' },
        { farbe: FARBEN.gefahr, text: 'noch offen' },
      ]}
      saeulen={zeilen.map((zeile) => ({
        label: `nach ${zeile.jahr} Jahren`,
        teile: [
          { wert: zeile.getilgt, farbe: FARBEN.marke },
          { wert: zeile.offen, farbe: FARBEN.gefahr },
        ],
        wertText:
          zeile.offen < 1 ? 'nichts mehr offen' : formatCurrencyRounded(zeile.offen),
        hinweis:
          zeile.jahr === immobilienZinsbindung
            ? 'Ende der Zinsbindung'
            : `${formatNumber(100 - zeile.anteil, 0)} % getilgt`,
      }))}
      beschreibung={
        `Ein Darlehen über ${formatCurrencyRounded(darlehen.summe)} zu ` +
        `${formatNumber(darlehen.zinsProzent, 1)} Prozent mit ${immobilieAnfangstilgung} Prozent ` +
        `Anfangstilgung. Jede Säule zeigt dieselbe Summe, aufgeteilt in bereits getilgt und noch offen: ` +
        zeilen
          .map(
            (zeile) =>
              `nach ${zeile.jahr} Jahren sind ${formatCurrencyRounded(zeile.getilgt)} getilgt und ` +
              `${formatCurrencyRounded(zeile.offen)} offen`
          )
          .join('; ') +
        `. Am Ende der üblichen Zinsbindung von ${immobilienZinsbindung} Jahren stehen damit noch ` +
        `${formatNumber(beiBindung.anteil, 0)} Prozent der ursprünglichen Summe offen. Genau dieser ` +
        `Betrag muss zu den dann geltenden Konditionen weiterfinanziert werden – und welche das sein ` +
        `werden, weiß heute niemand. Vollständig getilgt ist das Darlehen erst nach ${laufzeit} Jahren.`
      }
    />
  )
}
