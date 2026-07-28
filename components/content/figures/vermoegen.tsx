import {
  BalkenDiagramm,
  FARBEN,
  Feld,
  LinienDiagramm,
  SaeulenDiagramm,
  UmbrochenerText,
} from '@/components/content/figures/Diagramme'
import { Beschriftung, FigureSvg } from '@/components/content/figures/Rahmen'
import { kurseinbrueche } from '@/data/crashes'
import { formatCurrencyRounded, formatNumber, formatPercent } from '@/lib/format'
import {
  bitcoinBloeckeJeEpoche,
  bitcoinMinutenJeBlock,
  bitcoinObergrenze,
  bitcoinStartbelohnung,
  bitcoinStartjahr,
  immobilieInstandhaltung,
  immobilieJahresmiete,
  immobilieKaufpreis,
  immobilieMietausfallProzent,
  immobilieNebenkostenProzent,
  immobilieVerwaltung,
  sparerPauschbetrag,
  sparerRenditen,
} from '@/lib/lernszenarien'

/**
 * Grafiken zu Vermögen, Steuer, Immobilie, Krypto und Krisen.
 *
 * Was diese fünf verbindet, ist die Art der Frage: Sie lassen sich alle mit
 * einer einzigen Rechnung beantworten, und niemand rechnet sie. Ab welchem
 * Depotwert ist der Freibetrag weg? Wie viel bleibt von einer Mietrendite
 * übrig? Wie viele Bitcoin gibt es in zwanzig Jahren? Sagt die Tiefe eines
 * Crashs etwas über seine Dauer?
 */

// ------------------------------------------------- Wann der Freibetrag reicht

export function SparerpauschbetragGrenze() {
  const balken = sparerRenditen.map((rendite) => {
    const depotwert = sparerPauschbetrag / (rendite / 100)
    return {
      label: `${formatPercent(rendite, 1)} Ertrag`,
      wert: depotwert,
      wertText: formatCurrencyRounded(depotwert),
      farbe: FARBEN.marke,
    }
  })

  const niedrig = sparerPauschbetrag / (sparerRenditen[0] / 100)
  const hoch = sparerPauschbetrag / (sparerRenditen[sparerRenditen.length - 1] / 100)

  return (
    <BalkenDiagramm
      id="sparerpauschbetrag-grenze"
      balken={balken}
      labelBreite={124}
      beschreibung={
        `Bis zu welchem Depotwert der Sparerpauschbetrag von ` +
        `${formatCurrencyRounded(sparerPauschbetrag)} die steuerpflichtigen Erträge eines Jahres deckt – ` +
        `je nachdem, wie viel Prozent davon als Zins, Dividende oder Vorabpauschale anfallen. ` +
        balken.map((b) => `bei ${b.label} sind es ${b.wertText}`).join(', ') +
        `. Wer wenig laufenden Ertrag hat, kommt bis ${formatCurrencyRounded(niedrig)} ohne Steuer aus; ` +
        `bei hohem laufendem Ertrag ist der Freibetrag schon ab ${formatCurrencyRounded(hoch)} verbraucht. ` +
        `Die Rechnung sagt nichts über Kursgewinne – die werden erst beim Verkauf steuerpflichtig.`
      }
    />
  )
}

// ---------------------------------------- Von der Mietrendite zur Nettorendite

/**
 * Die Mietrendite, in ihre Bestandteile zerlegt.
 *
 * Die Zahlen sind die des Lernthemas Immobilien. Sie stehen dort als
 * Annahmen über der Tabelle; hier wird nur gezeichnet, was sie ergeben.
 */
export function ImmobilieNettorendite() {
  const jahresmiete = immobilieJahresmiete
  const verwaltung = immobilieVerwaltung
  const instandhaltung = immobilieInstandhaltung
  const mietausfall = jahresmiete * (immobilieMietausfallProzent / 100)
  const nettomiete = jahresmiete - verwaltung - instandhaltung - mietausfall
  const einsatz = immobilieKaufpreis * (1 + immobilieNebenkostenProzent / 100)
  const brutto = (jahresmiete / immobilieKaufpreis) * 100
  const netto = (nettomiete / einsatz) * 100

  return (
    <SaeulenDiagramm
      id="immobilie-nettorendite"
      saeulen={[
        {
          label: 'Jahresmiete',
          teile: [{ wert: jahresmiete, farbe: FARBEN.marke }],
          wertText: formatCurrencyRounded(jahresmiete),
          hinweis: `${formatPercent(brutto, 1)} auf den Kaufpreis`,
        },
        {
          label: 'was übrig bleibt',
          teile: [
            { wert: nettomiete, farbe: FARBEN.akzent },
            { wert: mietausfall, farbe: FARBEN.warnung },
            { wert: instandhaltung, farbe: FARBEN.gefahr },
            { wert: verwaltung, farbe: FARBEN.ruhig },
          ],
          wertText: formatCurrencyRounded(nettomiete),
          hinweis: `${formatPercent(netto, 1)} auf den Gesamteinsatz`,
        },
      ]}
      einheit="Euro im Jahr"
      legende={[
        { farbe: FARBEN.akzent, text: 'Nettomiete' },
        { farbe: FARBEN.warnung, text: 'Mietausfall' },
        { farbe: FARBEN.gefahr, text: 'Instandhaltung' },
        { farbe: FARBEN.ruhig, text: 'Verwaltung' },
      ]}
      hoehe={300}
      beschreibung={
        `Eine Wohnung für ${formatCurrencyRounded(immobilieKaufpreis)} bringt ` +
        `${formatCurrencyRounded(jahresmiete)} Miete im Jahr – beworben als ` +
        `${formatPercent(brutto, 1)} Rendite. Davon gehen ab: ` +
        `${formatCurrencyRounded(verwaltung)} Verwaltung, ${formatCurrencyRounded(instandhaltung)} ` +
        `Instandhaltung und ${formatCurrencyRounded(mietausfall)} kalkulierter Mietausfall. Übrig bleiben ` +
        `${formatCurrencyRounded(nettomiete)}. Bezogen auf den tatsächlichen Einsatz von ` +
        `${formatCurrencyRounded(einsatz)} – Kaufpreis plus ${formatPercent(immobilieNebenkostenProzent, 0)} ` +
        `Nebenkosten – sind das ${formatPercent(netto, 1)}. Aus der beworbenen Zahl ist damit weniger als die ` +
        `Hälfte geworden, und der Kredit ist darin noch nicht enthalten.`
      }
    />
  )
}

// ------------------------------------------------------- Die Bitcoin-Menge

/**
 * Die Umlaufmenge nach dem Emissionsplan des Protokolls.
 *
 * Anders als bei allen übrigen Grafiken ist hier keine Annahme im Spiel: Die
 * Menge folgt einer Regel, die im Programmcode steht. Fünfzig Münzen je Block,
 * alle 210.000 Blöcke halbiert, ein Block etwa alle zehn Minuten. Daraus
 * ergibt sich der Verlauf – und die Obergrenze, gegen die er läuft.
 *
 * Die Zeitachse ist die einzige Näherung: Die Blockzeit schwankt um zehn
 * Minuten, weshalb sich Halbierungen um Monate verschieben können.
 */
const BLOCKBELOHNUNG = bitcoinStartbelohnung
const BLOECKE_JE_EPOCHE = bitcoinBloeckeJeEpoche
const MINUTEN_JE_BLOCK = bitcoinMinutenJeBlock
const STARTJAHR = bitcoinStartjahr

export function BitcoinAngebot() {
  const jahreJeEpoche = (BLOECKE_JE_EPOCHE * MINUTEN_JE_BLOCK) / (60 * 24 * 365.25)

  const punkte: { x: number; y: number }[] = [{ x: STARTJAHR, y: 0 }]
  let menge = 0
  let belohnung = BLOCKBELOHNUNG

  // Zweiunddreißig Epochen: Danach ist die Belohnung auf null gerundet.
  for (let epoche = 0; epoche < 32; epoche++) {
    menge += belohnung * BLOECKE_JE_EPOCHE
    punkte.push({ x: STARTJAHR + (epoche + 1) * jahreJeEpoche, y: menge })
    belohnung /= 2
  }

  const bis = 2060
  const gezeigt = punkte.filter((punkt) => punkt.x <= bis)
  const heute = punkte.find((punkt) => punkt.x >= 2026) ?? punkte[punkte.length - 1]

  return (
    <LinienDiagramm
      id="bitcoin-angebot"
      reihen={[
        {
          name: 'Münzen im Umlauf',
          farbe: FARBEN.marke,
          punkte: gezeigt,
        },
        {
          name: `Obergrenze ${formatNumber(bitcoinObergrenze / 1_000_000, 0)} Millionen`,
          farbe: FARBEN.ruhig,
          gestrichelt: true,
          punkte: [
            { x: STARTJAHR, y: bitcoinObergrenze },
            { x: bis, y: bitcoinObergrenze },
          ],
        },
      ]}
      xVon={STARTJAHR}
      xBis={bis}
      xTeilstriche={[2009, 2020, 2030, 2040, 2050, 2060].map((wert) => ({
        wert,
        text: String(wert),
      }))}
      yEinheit="Münzen in Millionen"
      yFormat={(wert) => formatNumber(wert / 1_000_000, 0)}
      hoehe={290}
      beschreibung={
        `Die Umlaufmenge nach dem Emissionsplan des Protokolls: ${BLOCKBELOHNUNG} Münzen je Block, alle ` +
        `${formatNumber(BLOECKE_JE_EPOCHE, 0)} Blöcke halbiert, ein Block etwa alle ${MINUTEN_JE_BLOCK} ` +
        `Minuten. Die Kurve steigt anfangs steil und flacht mit jeder Halbierung ab. Um ` +
        `${formatNumber(Math.round(heute.x), 0)} sind bereits rund ` +
        `${formatNumber(Math.round(heute.y / 100_000) / 10, 1)} Millionen im Umlauf – über ` +
        `${formatPercent((heute.y / bitcoinObergrenze) * 100, 0)} der Obergrenze von ` +
        `${formatNumber(bitcoinObergrenze / 1_000_000, 0)} Millionen. Der Rest verteilt sich auf mehr als ` +
        `hundert Jahre. Die Knappheit ist damit kein Versprechen, sondern eine Regel im Programmcode – was ` +
        `sie über den Preis aussagt, ist eine andere Frage: Ein knappes Gut ohne Nachfrage ist wertlos.`
      }
    />
  )
}

// -------------------------------------------------- Ausmaß und Erholungsdauer

export function CrashesErholung() {
  /* Nach Rückgang sortiert – nur so ist zu sehen, dass die Erholungsdauer
     dieser Reihenfolge gerade nicht folgt. */
  const sortiert = [...kurseinbrueche].sort(
    (a, b) => b.rueckgangProzent - a.rueckgangProzent
  )

  return (
    <BalkenDiagramm
      id="crashes-erholung"
      balken={sortiert.map((einbruch) => ({
        label: `${einbruch.name} · − ${formatPercent(einbruch.rueckgangProzent, 0)}`,
        wert: einbruch.erholungJahre,
        wertText:
          einbruch.erholungJahre < 1
            ? `${formatNumber(einbruch.erholungJahre * 12, 0)} Monate`
            : `${formatNumber(einbruch.erholungJahre, 0)} Jahre bis zum alten Stand`,
        farbe: einbruch.erholungJahre >= 10 ? FARBEN.gefahr : FARBEN.marke,
      }))}
      labelBreite={160}
      beschreibung={
        'Fünf große Kurseinbrüche, nach der Tiefe des Rückgangs sortiert, und daneben die Zeit bis zum ' +
        'Wiedererreichen des alten Stands: ' +
        sortiert
          .map(
            (e) =>
              `${e.name}, ${formatPercent(e.rueckgangProzent, 0)} Rückgang, ` +
              (e.erholungJahre < 1
                ? `${formatNumber(e.erholungJahre * 12, 0)} Monate Erholung`
                : `${formatNumber(e.erholungJahre, 0)} Jahre Erholung`)
          )
          .join('; ') +
        '. Die Reihenfolge der Balken folgt der Tiefe – ihre Länge tut es nicht. Der Dotcom-Einbruch und ' +
        'die Finanzkrise waren gleich tief und unterschiedlich lang; die Pandemie war tiefer als 1987 und ' +
        'schneller vorbei. Was den Unterschied macht, ist nicht der Auslöser, sondern was danach ' +
        'wirtschaftspolitisch geschah. Alle Angaben sind Größenordnungen für breite Indizes.'
      }
    />
  )
}

// ------------------------------------------------------------ Sondervermögen

/**
 * Wo das Geld eines Fonds tatsächlich liegt.
 *
 * Kein Diagramm, sondern eine Anordnung: Der ganze Punkt des Sondervermögens
 * ist, dass eine Grenze zwischen zwei Kästen verläuft. Eine Achse hätte hier
 * nichts zu messen.
 */
export function FondsSondervermoegen() {
  const hoehe = 250
  const spalte = 288
  const links = 16
  const rechts = 640 - links - spalte

  return (
    <FigureSvg id="fonds-sondervermoegen" viewBox={`0 0 640 ${hoehe}`}>
      <Feld x={links} y={30} breite={spalte} hoehe={172} farbe={FARBEN.ruhig}>
        <Beschriftung
          x={links + spalte / 2}
          y={56}
          anchor="middle"
          ton="stark"
          gewicht="kraeftig"
        >
          Fondsgesellschaft
        </Beschriftung>
        <UmbrochenerText
          x={links + spalte / 2}
          y={80}
          breite={spalte - 28}
          text="Verwaltet, entscheidet über Käufe und Verkäufe, kassiert die Verwaltungsgebühr."
          ton="gedaempft"
        />
        <UmbrochenerText
          x={links + spalte / 2}
          y={140}
          breite={spalte - 28}
          text="Wird sie insolvent, fällt in die Masse, was ihr gehört – Büros, Verträge, Forderungen."
          ton="leise"
        />
      </Feld>

      <Feld x={rechts} y={30} breite={spalte} hoehe={172} farbe={FARBEN.marke}>
        <Beschriftung
          x={rechts + spalte / 2}
          y={56}
          anchor="middle"
          ton="stark"
          gewicht="kraeftig"
        >
          Fondsvermögen
        </Beschriftung>
        <UmbrochenerText
          x={rechts + spalte / 2}
          y={80}
          breite={spalte - 28}
          text="Die Aktien und Anleihen selbst, verwahrt bei einer unabhängigen Depotbank."
          ton="gedaempft"
        />
        <UmbrochenerText
          x={rechts + spalte / 2}
          y={140}
          breite={spalte - 28}
          text="Gehört den Anlegern. Fällt in keine Insolvenzmasse – weder der Gesellschaft noch der Depotbank."
          ton="leise"
        />
      </Feld>

      <Beschriftung x={320} y={20} anchor="middle" ton="leise" groesse={12}>
        rechtlich getrennt
      </Beschriftung>

      <UmbrochenerText
        x={320}
        y={228}
        breite={600}
        text="Wovor die Trennung nicht schützt: Fallen die enthaltenen Aktien um 40 Prozent, fällt dein Anteil um 40 Prozent."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}

// ------------------------------------------------------- Die Liquiditätsspirale

/**
 * Die vier Stationen des Verkaufszwangs – als Kreis, weil es einer ist.
 *
 * ## Warum keine Kette
 *
 * Für Abläufe gibt es hier `AblaufKette`: Kästen nebeneinander, Pfeile
 * dazwischen, ein Anfang und ein Ende. Genau das trifft hier nicht zu. Der
 * Text sagt es selbst – „der Kreis schließt sich“. Eine Liquiditätsspirale hat
 * keinen letzten Kasten; ihre vierte Station ist die Ursache der ersten.
 *
 * Als Kette gezeichnet wäre das ein Ablauf, der irgendwann aufhört, und damit
 * wäre die Aussage verloren. Der geschlossene Ring ist der Inhalt der Grafik.
 *
 * ## Was hier bewusst fehlt
 *
 * Zahlen. Wie schnell sich der Kreis dreht und wie tief er trägt, hängt am
 * Ausmaß der Kreditfinanzierung im Markt – dafür gibt es keine Größe, die für
 * „einen Crash“ allgemein gilt. Was allgemein gilt, ist die Reihenfolge.
 */
const SPIRALE = [
  {
    titel: 'Verkäufe',
    text: 'Wer nachschießen muss und nicht kann, verkauft – nicht weil er will',
  },
  {
    titel: 'Preise fallen',
    text: 'Viele Verkäufe auf einmal treffen auf wenige Käufer',
  },
  {
    titel: 'Sicherheiten schrumpfen',
    text: 'Was als Pfand hinterlegt ist, ist plötzlich weniger wert',
  },
  {
    titel: 'Nachschuss gefordert',
    text: 'Die Bank verlangt frisches Geld oder stellt die Position glatt',
  },
] as const

export function CrashesSpirale() {
  // Platz für drei Zeilen Fußtext unter dem Ring, samt Unterlängen.
  const hoehe = 416
  const mitteX = 320
  const mitteY = 196
  const kastenBreite = 232
  const kastenHoehe = 78
  /* Der Abstand der Kästen von der Mitte, waagerecht weiter als senkrecht:
     Ein Kasten ist dreimal so breit wie hoch, ein kreisrunder Ring ließe die
     linken und rechten fast zusammenstoßen. */
  const radiusX = 190
  const radiusY = 118

  // Oben, rechts, unten, links – im Uhrzeigersinn, wie der Kreis gelesen wird.
  const plaetze = [
    { x: mitteX, y: mitteY - radiusY },
    { x: mitteX + radiusX, y: mitteY },
    { x: mitteX, y: mitteY + radiusY },
    { x: mitteX - radiusX, y: mitteY },
  ]

  return (
    <FigureSvg id="crashes-spirale" viewBox={`0 0 640 ${hoehe}`}>
      <Beschriftung x={320} y={20} anchor="middle" ton="leise" groesse={12}>
        vier Stationen, kein Ende – jede folgt aus der vorigen
      </Beschriftung>

      {/* Der Ring liegt hinter den Kästen und ist das eigentliche Bild: Er hat
          keinen Anfang. Die Pfeilspitzen auf ihm geben die Richtung. */}
      <ellipse
        cx={mitteX}
        cy={mitteY}
        rx={radiusX}
        ry={radiusY}
        fill="none"
        stroke={FARBEN.gefahr}
        strokeWidth={2}
        strokeDasharray="7 5"
      />

      {plaetze.map((platz, index) => {
        /*
          Die Pfeilspitze sitzt auf dem Ring, mittig zwischen zwei Kästen, und
          zeigt in Umlaufrichtung. Bei einer Ellipse ist die Tangente nicht die
          Verbindung der Nachbarpunkte – sie wird deshalb aus der Ableitung
          gebildet: x = rx·cos t, y = ry·sin t ergibt (−rx·sin t, ry·cos t).
        */
        const winkel = (-Math.PI / 2 + ((index + 0.5) * Math.PI) / 2) % (2 * Math.PI)
        const px = mitteX + radiusX * Math.cos(winkel)
        const py = mitteY + radiusY * Math.sin(winkel)
        const tx = -radiusX * Math.sin(winkel)
        const ty = radiusY * Math.cos(winkel)
        const laenge = Math.hypot(tx, ty)
        const dreh = (Math.atan2(ty, tx) * 180) / Math.PI

        return (
          <g key={`pfeil-${index}`}>
            <path
              d={`M${px + (tx / laenge) * 7} ${py + (ty / laenge) * 7} l-11 -6 v12 Z`}
              fill={FARBEN.gefahr}
              transform={`rotate(${dreh} ${px + (tx / laenge) * 7} ${py + (ty / laenge) * 7})`}
            />
          </g>
        )
      })}

      {SPIRALE.map((station, index) => {
        const platz = plaetze[index]
        const x = platz.x - kastenBreite / 2
        const y = platz.y - kastenHoehe / 2
        return (
          <g key={station.titel}>
            <Feld
              x={x}
              y={y}
              breite={kastenBreite}
              hoehe={kastenHoehe}
              farbe={FARBEN.gefahr}
            >
              <Beschriftung
                x={platz.x}
                y={y + 24}
                anchor="middle"
                ton="stark"
                gewicht="kraeftig"
              >
                {station.titel}
              </Beschriftung>
              <UmbrochenerText
                x={platz.x}
                y={y + 44}
                breite={kastenBreite - 20}
                text={station.text}
                ton="gedaempft"
                groesse={11.5}
              />
            </Feld>
          </g>
        )
      })}

      <UmbrochenerText
        x={320}
        y={370}
        breite={608}
        text="Deshalb ist ein Einbruch schneller als der Anstieg davor: Ein erheblicher Teil der Verkäufe ist nicht entschieden, sondern erzwungen. Wer ohne Kredit gekauft hat, steht in diesem Kreis nicht drin."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}
