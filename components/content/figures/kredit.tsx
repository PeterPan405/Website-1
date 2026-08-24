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

  return (
    <SaeulenDiagramm
      id="kredit-anfangstilgung"
      saeulen={saeulen}
      einheit="Laufzeit in Jahren"
      hoehe={290}
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
    />
  )
}
