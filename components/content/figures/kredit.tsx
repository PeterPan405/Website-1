import { FARBEN, SaeulenDiagramm } from '@/components/content/figures/Diagramme'
import { formatCurrencyRounded, formatNumber } from '@/lib/format'
import {
  auswerten,
  rateBeiTilgungssatz,
  restschuldNach,
  tilgungsplan,
} from '@/lib/kredit'
import {
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
