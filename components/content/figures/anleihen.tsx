import {
  FARBEN,
  LinienDiagramm,
  SaeulenDiagramm,
  type Reihe,
} from '@/components/content/figures/Diagramme'
import { kurs, zinsschock } from '@/lib/anleihen'
import { formatNumber, formatPercent } from '@/lib/format'
import { anleiheBeispiel, anleiheLaufzeiten, anleiheMarktzins } from '@/lib/lernszenarien'

/**
 * Die Grafiken zu Schuldverschreibung und Staatsanleihe.
 *
 * Beide zeichnen dieselbe Aussage von zwei Seiten: Der Kurs einer Anleihe
 * hängt am Marktzins, und zwar umso stärker, je länger sie noch läuft. Im
 * Text steht das als Tabelle mit vier Stützstellen – die Kurve dazwischen
 * ist das, was eine Tabelle nicht zeigen kann.
 *
 * Gerechnet wird mit `lib/anleihen.ts`, die Annahmen stehen in
 * `lib/lernszenarien.ts`. Keine Zahl in dieser Datei ist getippt.
 */

// ------------------------------------------------- Kurs über dem Marktzins

const ZINS_VON = 0
const ZINS_BIS = 8
/** Ein Schritt von 0,25 Prozentpunkten – fein genug, dass die Krümmung sichtbar wird. */
const SCHRITTE = 32

export function AnleiheKursUndZins() {
  const laufzeiten = [
    { jahre: 2, farbe: FARBEN.ruhig },
    { jahre: 10, farbe: FARBEN.marke },
    { jahre: 20, farbe: FARBEN.akzent },
  ]

  const reihen: Reihe[] = laufzeiten.map(({ jahre, farbe }) => ({
    name: `${jahre} Jahre Restlaufzeit`,
    farbe,
    punkte: Array.from({ length: SCHRITTE + 1 }, (_, index) => {
      const zins = ZINS_VON + ((ZINS_BIS - ZINS_VON) * index) / SCHRITTE
      return {
        x: zins,
        y: kurs({ kuponProzent: anleiheBeispiel.kuponProzent, jahre }, zins),
      }
    }),
  }))

  return (
    <LinienDiagramm
      id="anleihe-kurs-und-zins"
      reihen={reihen}
      xVon={ZINS_VON}
      xBis={ZINS_BIS}
      xTeilstriche={[0, 2, 4, 6, 8].map((wert) => ({
        wert,
        text: formatPercent(wert, 0),
      }))}
      xLabel="Marktzins"
      yEinheit="Kurs in Prozent des Nennwerts"
      hoehe={300}
    />
  )
}

// ---------------------------------------------------- Kursverlust je Laufzeit

export function StaatsanleiheZinsschock() {
  const AENDERUNG = 2

  const saeulen = anleiheLaufzeiten.map((jahre) => {
    const ergebnis = zinsschock(
      { kuponProzent: anleiheBeispiel.kuponProzent, jahre },
      anleiheMarktzins,
      AENDERUNG
    )
    const verlust = Math.abs(ergebnis.tatsaechlichProzent)
    return {
      label: `${jahre} Jahre`,
      teile: [{ wert: verlust, farbe: FARBEN.gefahr }],
      wertText: `−${formatNumber(verlust, 1)} %`,
    }
  })

  return (
    <SaeulenDiagramm
      id="staatsanleihe-zinsschock"
      saeulen={saeulen}
      einheit="Kursverlust in Prozent"
      hoehe={260}
    />
  )
}
