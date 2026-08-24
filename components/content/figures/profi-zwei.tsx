import {
  FARBEN,
  Feld,
  LinienDiagramm,
  SaeulenDiagramm,
  UmbrochenerText,
} from '@/components/content/figures/Diagramme'
import { Beschriftung, FigureSvg } from '@/components/content/figures/Rahmen'
import { ewigeRente, noetigeBruttorendite, schuldenquotenpfad } from '@/lib/bewertung'
import { formatCurrencyRounded, formatPercent } from '@/lib/format'
import {
  bewertungKapitalkosten,
  bewertungWachstum,
  dynamikJahre,
  dynamikRendite,
  dynamikStartrate,
  dynamikSteigerungen,
  effektiverSteuersatz,
  schuldenDifferenzen,
  schuldenJahre,
  schuldenStartquote,
  schuldenWachstum,
  tilgungszinsen,
} from '@/lib/lernszenarien'

/**
 * Grafiken für die Profi-Stufen.
 *
 * Was sie eint: Jede zeichnet eine Aussage, die im Text als Größenordnung
 * steht – „ein halber Prozentpunkt verschiebt den Wert leicht um fünfzehn
 * Prozent“, „aus sieben Prozent brutto werden nach Steuern gut fünf“. Solche
 * Sätze sind nachrechenbar, und die Rechnung steht in `lib/bewertung.ts`.
 */

// ------------------------------------------------------------ Der Barwert

/**
 * Warum eine Bewertung keine Zahl ist, sondern eine Bandbreite.
 *
 * ## Was hier gezeichnet wird
 *
 * Der Barwert derselben ewig wachsenden Zahlungsreihe über dem
 * Kapitalkostensatz, für zwei Wachstumsannahmen. Die Kurve ist eine Hyperbel:
 * Zum unteren Ende hin steigt sie nicht, sie läuft davon.
 *
 * Das ist der ganze Punkt des Abschnitts. Wer eine Bewertung als eine Zahl
 * ausgibt, verschweigt, dass ein halber Prozentpunkt an einer Stelle, die
 * niemand kennt, den Wert zweistellig verschiebt.
 */
export function AktieBarwert() {
  const schritte = 60
  const { von, bis } = bewertungKapitalkosten

  const reihen = bewertungWachstum.map((wachstum, index) => ({
    name: `Wachstum ${formatPercent(wachstum, 0)} im Jahr`,
    farbe: index === 0 ? FARBEN.marke : FARBEN.gefahr,
    punkte: Array.from({ length: schritte + 1 }, (_, i) => {
      const r = von + (i / schritte) * (bis - von)
      return { x: r, y: ewigeRente(1, r, wachstum) ?? 0 }
    }),
  }))

  return (
    <LinienDiagramm
      id="aktie-barwert"
      xVon={von}
      xBis={bis}
      xTeilstriche={[6, 7, 8, 9].map((r) => ({
        wert: r,
        text: formatPercent(r, 0),
      }))}
      xLabel="Kapitalkostensatz"
      yEinheit="Wert je Euro jährlicher Zahlung"
      hoehe={320}
      reihen={reihen}
    />
  )
}

// ------------------------------------------------- Tilgen oder anlegen

/**
 * Welche Bruttorendite eine Anlage bringen muss, um eine Tilgung zu schlagen.
 *
 * ## Warum das nicht dieselbe Zahl ist
 *
 * Der Ertrag einer Tilgung ist der ersparte Kreditzins, und er wird nicht
 * besteuert – eine ersparte Ausgabe ist kein Ertrag. Der Ertrag einer Anlage
 * wird besteuert. Wer die beiden Prozentzahlen nebeneinanderlegt, vergleicht
 * eine Nettogröße mit einer Bruttogröße, und zwar systematisch zugunsten der
 * Anlage.
 *
 * Der zweite Einwand aus dem Text lässt sich nicht zeichnen und steht deshalb
 * darunter: Die Tilgung ist sicher, die Rendite ist eine Erwartung. Die Säulen
 * zeigen, was eine Anlage im Mittel bringen müsste – nicht, mit welcher
 * Wahrscheinlichkeit sie es tut.
 */
export function KreditTilgenOderAnlegen() {
  const zeilen = tilgungszinsen.map((zins) => ({
    zins,
    noetig: noetigeBruttorendite(zins, effektiverSteuersatz),
  }))

  return (
    <SaeulenDiagramm
      id="kredit-tilgen-oder-anlegen"
      einheit="nötige Bruttorendite der Anlage"
      hoehe={310}
      legende={[
        { farbe: FARBEN.marke, text: 'so viel wie der Kreditzins' },
        { farbe: FARBEN.gefahr, text: 'zusätzlich für die Steuer' },
      ]}
      saeulen={zeilen.map((zeile) => ({
        label: `${formatPercent(zeile.zins, 0)} Kredit`,
        teile: [
          { wert: zeile.zins, farbe: FARBEN.marke },
          { wert: zeile.noetig - zeile.zins, farbe: FARBEN.gefahr },
        ],
        wertText: formatPercent(zeile.noetig, 1),
        hinweis: `+ ${formatPercent(zeile.noetig - zeile.zins, 1)}`,
      }))}
    />
  )
}

// ---------------------------------------------------------- Schuldendynamik

/**
 * Warum die Höhe einer Schuldenquote fast nichts sagt.
 *
 * Gezeichnet ist dieselbe Startquote, fortgeschrieben mit vier verschiedenen
 * Zins-Wachstums-Differenzen und ohne jeden Primärsaldo. Die Quote bewegt sich
 * trotzdem – und in welche Richtung, entscheidet allein diese Differenz.
 *
 * Der Primärsaldo fehlt bewusst. Er ist die einzige Größe, die eine Regierung
 * steuern kann, und deshalb der Gegenstand jeder Haushaltsdebatte. Die Aussage
 * dieser Grafik gilt ihm gerade nicht: Auch bei einem ausgeglichenen Haushalt
 * läuft die Quote, und zwar in eine Richtung, über die niemand abstimmt.
 */
export function StaatsschuldDynamik() {
  const reihen = schuldenDifferenzen.map((differenz, index) => {
    const pfad = schuldenquotenpfad(
      schuldenStartquote,
      schuldenWachstum + differenz,
      schuldenWachstum,
      schuldenJahre
    )
    const farben = [FARBEN.akzent, FARBEN.ruhig, FARBEN.warnung, FARBEN.gefahr]
    return {
      name:
        differenz === 0
          ? 'Zins gleich Wachstum'
          : `Zins ${differenz > 0 ? '+' : '−'} ${formatPercent(Math.abs(differenz), 0)}`,
      farbe: farben[index],
      punkte: pfad.map((quote, jahr) => ({ x: jahr, y: quote })),
      endText: formatPercent(pfad[pfad.length - 1], 0),
    }
  })

  return (
    <LinienDiagramm
      id="staatsschuld-dynamik"
      xVon={0}
      xBis={schuldenJahre}
      xTeilstriche={[0, 5, 10, 15, schuldenJahre].map((jahr) => ({
        wert: jahr,
        text: jahr === 0 ? 'heute' : `${jahr} J.`,
      }))}
      yEinheit="Schuldenquote in Prozent des BIP"
      hoehe={320}
      rechterRand={52}
      reihen={reihen}
    />
  )
}

// --------------------------------------------------- Dynamisierter Sparplan

/**
 * Was es bringt, die Sparrate mit dem Einkommen wachsen zu lassen.
 *
 * Gerechnet wird Jahr für Jahr: Die Rate steigt jeweils zu Jahresbeginn, das
 * angesparte Vermögen verzinst sich. Eine geschlossene Formel dafür gäbe es,
 * sie wäre aber schwerer zu prüfen als die Schleife – und die Schleife bildet
 * ab, was tatsächlich passiert.
 */
function endkapitalMitDynamik(steigerungProzent: number): number {
  let kapital = 0
  let rate = dynamikStartrate

  for (let jahr = 0; jahr < dynamikJahre; jahr++) {
    for (let monat = 0; monat < 12; monat++) {
      kapital = kapital * (1 + dynamikRendite / 100 / 12) + rate
    }
    rate = rate * (1 + steigerungProzent / 100)
  }
  return kapital
}

function eingezahltMitDynamik(steigerungProzent: number): number {
  let summe = 0
  let rate = dynamikStartrate
  for (let jahr = 0; jahr < dynamikJahre; jahr++) {
    summe += rate * 12
    rate = rate * (1 + steigerungProzent / 100)
  }
  return summe
}

export function SparplanDynamisierung() {
  const zeilen = dynamikSteigerungen.map((steigerung) => ({
    steigerung,
    endkapital: endkapitalMitDynamik(steigerung),
    eingezahlt: eingezahltMitDynamik(steigerung),
    letzteRate: dynamikStartrate * (1 + steigerung / 100) ** (dynamikJahre - 1),
  }))

  return (
    <SaeulenDiagramm
      id="sparplan-dynamisierung"
      einheit={`Euro nach ${dynamikJahre} Jahren`}
      hoehe={310}
      legende={[
        { farbe: FARBEN.ruhig, text: 'eingezahlt' },
        { farbe: FARBEN.marke, text: 'Ertrag' },
      ]}
      saeulen={zeilen.map((zeile) => ({
        label:
          zeile.steigerung === 0
            ? 'gleiche Rate'
            : `+ ${formatPercent(zeile.steigerung, 0)} im Jahr`,
        teile: [
          { wert: zeile.eingezahlt, farbe: FARBEN.ruhig },
          { wert: zeile.endkapital - zeile.eingezahlt, farbe: FARBEN.marke },
        ],
        wertText: formatCurrencyRounded(zeile.endkapital),
        hinweis: `zuletzt ${formatCurrencyRounded(zeile.letzteRate)}`,
      }))}
    />
  )
}

// ------------------------------------------------------- Effizienzstufen

/**
 * Die drei Stufen der Informationseffizienz als ineinanderliegende Mengen.
 *
 * ## Warum verschachtelt und nicht nebeneinander
 *
 * Weil sie einander enthalten: Wer behauptet, alle öffentlichen Informationen
 * steckten im Kurs, behauptet damit auch, die vergangenen Kurse täten es. Die
 * Tabelle im Thema stellt die drei nebeneinander und verliert genau das. Als
 * ineinanderliegende Rahmen ist zu sehen, dass die stärkere Stufe die
 * schwächere immer einschließt – und dass die äußerste widerlegt ist, ohne
 * dass das die inneren berührt.
 */
const EFFIZIENZSTUFEN = [
  {
    stufe: 'Schwach',
    inhalt: 'vergangene Kurse',
    stand: 'weitgehend bestätigt',
    farbe: FARBEN.marke,
  },
  {
    stufe: 'Halbstark',
    inhalt: '+ alle öffentlichen Informationen',
    stand: 'überwiegend bestätigt',
    farbe: FARBEN.akzent,
  },
  {
    stufe: 'Streng',
    inhalt: '+ nicht öffentliche Informationen',
    stand: 'klar widerlegt',
    farbe: FARBEN.gefahr,
  },
] as const

export function MarktEffizienzstufen() {
  const hoehe = 300
  const aussenBreite = 596
  const aussenHoehe = 200
  const einrueckungX = 42
  const einrueckungY = 34
  const oben = 34

  return (
    <FigureSvg id="markt-effizienzstufen" viewBox={`0 0 640 ${hoehe}`}>
      {/*
        Gezeichnet wird von außen nach innen, damit die inneren Rahmen über
        den äußeren liegen. Die Reihenfolge im Datensatz ist die umgekehrte –
        dort steht die schwächste Stufe zuerst, weil sie die eingeschlossene
        ist.
      */}
      {[...EFFIZIENZSTUFEN].reverse().map((eintrag, position) => {
        /*
          `schrumpf` ist der Abstand zur äußersten Stufe.

          Er war zuerst der Index im Datensatz, und damit war die Schachtelung
          verkehrt herum: Die strenge Stufe – die alles einschließt – wurde als
          kleinster Kasten gezeichnet. Sichtbar war davon nur der äußerste
          Rahmen, weil die inneren dahinter verschwanden.
        */
        const schrumpf = position
        const breite = aussenBreite - schrumpf * einrueckungX * 2
        const kastenHoehe = aussenHoehe - schrumpf * einrueckungY * 2
        const x = (640 - breite) / 2
        const y = oben + schrumpf * einrueckungY

        return (
          <g key={eintrag.stufe}>
            <Feld x={x} y={y} breite={breite} hoehe={kastenHoehe} farbe={eintrag.farbe} />
            <Beschriftung
              x={x + 14}
              y={y + 21}
              ton="stark"
              gewicht="kraeftig"
              groesse={13}
            >
              {eintrag.stufe}
            </Beschriftung>
            <Beschriftung x={320} y={y + 21} anchor="middle" ton="gedaempft" groesse={12}>
              {eintrag.inhalt}
            </Beschriftung>
            <Beschriftung
              x={x + breite - 14}
              y={y + 21}
              anchor="end"
              ton="leise"
              groesse={11.5}
            >
              {eintrag.stand}
            </Beschriftung>
          </g>
        )
      })}

      <UmbrochenerText
        x={320}
        y={oben + aussenHoehe + 28}
        breite={608}
        text="Die stärkere Stufe schließt die schwächere ein. Dass die äußerste widerlegt ist – sonst wäre Insiderhandel nicht einträglich –, sagt deshalb nichts über die inneren beiden."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}
