import {
  FARBEN,
  LinienDiagramm,
  type Reihe,
} from '@/components/content/figures/Diagramme'
import { formatNumber } from '@/lib/format'
import { optionBasis, optionMonate } from '@/lib/lernszenarien'
import { gewinnschwelle, innererWert, preis } from '@/lib/optionen'

/**
 * Die Grafiken zum Lernthema Option.
 *
 * ## Warum gerade diese beiden
 *
 * Optionen scheitern beim Verständnis fast immer an denselben zwei Punkten.
 * Erstens: Das Ergebnis ist nicht symmetrisch – nach unten ist der Verlust
 * gedeckelt, nach oben ist er es nicht, und zwar je nach Seite des Geschäfts
 * genau andersherum. Zweitens: Eine Option kann wertlos verfallen, obwohl der
 * Kurs sich in die erwartete Richtung bewegt hat, weil die Zeit schneller war.
 *
 * Beides sind Verlaufsaussagen. Eine Tabelle mit fünf Stützstellen zeigt sie
 * nicht; ein Knick zwischen zwei Zeilen sieht aus wie jeder andere Schritt.
 *
 * Alle Zahlen kommen aus `lib/optionen.ts` mit den Annahmen aus
 * `lib/lernszenarien.ts` – denselben, aus denen die Tabellen im Text entstehen.
 */

// ------------------------------------------------ Auszahlung bei Verfall

const KURS_VON = 70
const KURS_BIS = 130
const SCHRITTE = 60

export function OptionAuszahlung() {
  const praemieCall = preis('call', optionBasis)
  const praemiePut = preis('put', optionBasis)

  const kurse = Array.from(
    { length: SCHRITTE + 1 },
    (_, index) => KURS_VON + ((KURS_BIS - KURS_VON) * index) / SCHRITTE
  )

  /*
    Gezeichnet wird das Ergebnis bei Verfall, nicht der Preis vorher.

    Bei Verfall gibt es keinen Zeitwert mehr: Was bleibt, ist der innere Wert
    abzüglich der bezahlten Prämie. Das ist die Zahl, die am Ende auf dem
    Konto steht – und die einzige, über die sich ohne Modellannahmen reden
    lässt.
  */
  const reihen: Reihe[] = [
    {
      name: 'Kaufoption (Call)',
      farbe: FARBEN.marke,
      punkte: kurse.map((kurs) => ({
        x: kurs,
        y: innererWert('call', kurs, optionBasis.basispreis) - praemieCall,
      })),
    },
    {
      name: 'Verkaufoption (Put)',
      farbe: FARBEN.akzent,
      punkte: kurse.map((kurs) => ({
        x: kurs,
        y: innererWert('put', kurs, optionBasis.basispreis) - praemiePut,
      })),
    },
  ]

  const schwelleCall = gewinnschwelle('call', optionBasis)
  const schwellePut = gewinnschwelle('put', optionBasis)

  return (
    <LinienDiagramm
      id="option-auszahlung"
      reihen={reihen}
      xVon={KURS_VON}
      xBis={KURS_BIS}
      xTeilstriche={[70, 85, 100, 115, 130].map((wert) => ({
        wert,
        text: formatNumber(wert, 0),
      }))}
      xLabel="Kurs des Basiswerts bei Verfall"
      yEinheit="Ergebnis je Option in Euro"
      /*
        Der Achsenboden liegt unter der höheren Prämie, auf einem runden Wert.

        Direkt auf der Prämie läge die waagerechte Verlustlinie genau auf der
        untersten Rasterlinie und wäre nicht mehr als Linie zu erkennen. Der
        runde Wert sorgt außerdem für lesbare Teilstriche – aus dem Boden
        leitet sich die gesamte Achsenteilung ab.
      */
      yMinimum={-2 * Math.ceil(Math.max(praemieCall, praemiePut) / 5) * 5}
      yFormat={(wert) => formatNumber(wert, 0)}
      nulllinie
      hoehe={310}
      beschreibung={
        `Ergebnis zweier Optionen auf einen Basiswert von ${formatNumber(optionBasis.kurs, 0)} Euro ` +
        `mit Basispreis ${formatNumber(optionBasis.basispreis, 0)} Euro bei Verfall. Beide Linien verlaufen ` +
        `zunächst waagerecht im Minus – so hoch ist die bezahlte Prämie, und mehr kann der Käufer nicht ` +
        `verlieren. Ab dem Knick am Basispreis steigt das Ergebnis; die Gewinnschwelle liegt beim Call bei ` +
        `${formatNumber(schwelleCall, 2)} Euro, beim Put bei ${formatNumber(schwellePut, 2)} Euro. ` +
        `Der Call kennt nach oben keine Grenze, der Put endet bei einem Kurs von null.`
      }
    />
  )
}

// --------------------------------------------------------- Zeitwertverfall

export function OptionZeitwertverfall() {
  /*
    Von zwölf Monaten bis null, in Monatsschritten – und die letzten vier
    Wochen in Wochenschritten.

    Die Beschleunigung passiert genau dort. Mit gleichmäßigen Monatsschritten
    verbindet die Linie den vorletzten Punkt mit der Null und sieht aus wie
    eine Gerade; die Krümmung, um die es geht, fiele unter den Tisch.
  */
  const monate = Array.from({ length: 12 }, (_, index) => 12 - index)
  const wochen = [0.75, 0.5, 0.25, 0.05]
  const stuetzstellen = [...monate.filter((m) => m >= 1), ...wochen]

  const punkte = stuetzstellen.map((restMonate) => ({
    x: restMonate,
    y: preis('call', { ...optionBasis, jahre: restMonate / 12 }),
  }))

  const bei = (restMonate: number) =>
    preis('call', { ...optionBasis, jahre: restMonate / 12 })

  const jahresPraemie = bei(12)
  const monatsPraemie = bei(1)
  /** Wie viel vom Anfangswert der letzte Monat allein trägt. */
  const anteilLetzterMonat = (monatsPraemie / jahresPraemie) * 100

  return (
    <LinienDiagramm
      id="option-zeitwertverfall"
      reihen={[
        {
          name: 'Prämie einer Option am Geld',
          farbe: FARBEN.marke,
          punkte: [...punkte].reverse(),
        },
      ]}
      /* Die x-Achse läuft rückwärts: links viel Zeit, rechts der Verfall. Das
         ist die Leserichtung der Sache selbst. */
      xVon={12}
      xBis={0}
      xTeilstriche={[...optionMonate, 0].map((wert) => ({
        wert,
        text: wert === 0 ? 'Verfall' : `${wert} Mon.`,
      }))}
      xLabel="Restlaufzeit"
      yEinheit="Prämie in Euro"
      yFormat={(wert) => formatNumber(wert, 1)}
      hoehe={300}
      beschreibung={
        `Die Prämie einer Kaufoption am Geld über die Restlaufzeit. Bei zwölf Monaten kostet sie ` +
        `${formatNumber(jahresPraemie, 2)} Euro, bei einem Monat noch ${formatNumber(monatsPraemie, 2)} Euro – ` +
        `${formatNumber(anteilLetzterMonat, 0)} Prozent des Anfangswerts. Elf Monate haben also drei Viertel ` +
        `des Werts gekostet, der letzte Monat allein das restliche Viertel. Die Kurve fällt zum Verfall hin ` +
        `immer steiler auf null.`
      }
    />
  )
}
