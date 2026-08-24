import {
  AblaufKette,
  FARBEN,
  Feld,
  LinienDiagramm,
  SaeulenDiagramm,
  UmbrochenerText,
} from '@/components/content/figures/Diagramme'
import { Beschriftung, FigureSvg } from '@/components/content/figures/Rahmen'
import { calculateCompoundInterest } from '@/lib/finance'
import { marginverlauf } from '@/lib/margin'
import { formatCurrencyRounded } from '@/lib/format'
import {
  einlagensicherungGrenze,
  handelszeiten,
  marginErsteinschussProzent,
  marginKontraktwert,
  marginKursverlauf,
  marginUntergrenzeProzent,
  verteiljahre,
  verteilmonate,
  verteilrendite,
  verteilsumme,
} from '@/lib/lernszenarien'

/**
 * Grafiken zu Handel, Sicherungssystemen und Termingeschäften.
 *
 * Gemeinsam ist ihnen, dass sie eine Aussage zeichnen, die in einer Tabelle
 * nicht steht – auch wenn alle Zahlen darin vorkommen. Wann welcher
 * Handelsplatz geöffnet hat, ist eine Tabellenzeile; dass es Stunden gibt, in
 * denen nur einer offen ist, sieht man erst, wenn die Zeiten übereinander
 * liegen.
 */

// ----------------------------------------------------------- Handelszeiten

/**
 * Eine Stundenangabe als Uhrzeit.
 *
 * 17,5 ist eine Zahl, „17:30 Uhr“ ist eine Uhrzeit. Die Zeiten liegen als
 * Dezimalstunden vor, weil sich damit rechnen lässt; im Text und in der
 * Vorlesefassung haben sie in dieser Form nichts zu suchen.
 */
function alsUhrzeit(stunde: number): string {
  const volle = Math.floor(stunde)
  const minuten = Math.round((stunde - volle) * 60)
  return minuten === 0
    ? `${volle} Uhr`
    : `${volle}:${String(minuten).padStart(2, '0')} Uhr`
}

/**
 * Wann welcher Handelsplatz geöffnet hat – und wann keiner vergleichen kann.
 *
 * Die Aussage des Abschnitts „Der teuerste Zeitpunkt“ ist keine über
 * Öffnungszeiten, sondern eine über Überlappung: Um 22 Uhr ist der
 * Referenzmarkt seit über vier Stunden zu, und es gibt keinen Kurs, an dem
 * sich die Fairness eines Angebots messen ließe. Genau diese Lücke ist hier
 * eingefärbt.
 */
export function BoerseHandelszeiten() {
  const von = 7
  const bis = 24
  const links = 16
  const rechts = 624
  const balkenHoehe = 30
  const abstand = 22
  const oben = 58
  const hoehe = oben + handelszeiten.length * (balkenHoehe + abstand) + 96

  const x = (stunde: number) => links + ((stunde - von) / (bis - von)) * (rechts - links)

  const referenz = handelszeiten[0]
  const laengster = handelszeiten[handelszeiten.length - 1]
  const blindVon = referenz.bis
  const blindBis = laengster.bis

  return (
    <FigureSvg id="boerse-handelszeiten" viewBox={`0 0 640 ${hoehe}`}>
      <Beschriftung x={links} y={22} ton="leise" groesse={12}>
        Uhrzeit
      </Beschriftung>

      {/* Der blinde Bereich liegt hinter den Balken – er ist der Hintergrund,
          vor dem der lange Direkthandelsbalken allein dasteht. */}
      <rect
        x={x(blindVon)}
        y={oben - 10}
        width={x(blindBis) - x(blindVon)}
        height={handelszeiten.length * (balkenHoehe + abstand)}
        fill="var(--c-danger-soft)"
      />

      {[8, 10, 12, 14, 16, 18, 20, 22].map((stunde) => (
        <g key={stunde}>
          <line
            x1={x(stunde)}
            y1={oben - 10}
            x2={x(stunde)}
            y2={oben + handelszeiten.length * (balkenHoehe + abstand) - 10}
            stroke={FARBEN.raster}
            strokeWidth={1}
          />
          <Beschriftung x={x(stunde)} y={38} anchor="middle" ton="leise" groesse={12}>
            {stunde}
          </Beschriftung>
        </g>
      ))}

      {handelszeiten.map((platz, index) => {
        const y = oben + index * (balkenHoehe + abstand)
        const farbe = index === 0 ? FARBEN.marke : FARBEN.ruhig
        return (
          <g key={platz.name}>
            <rect
              x={x(platz.von)}
              y={y}
              width={x(platz.bis) - x(platz.von)}
              height={balkenHoehe}
              rx={5}
              fill={index === 0 ? 'var(--c-brand-soft)' : 'var(--c-surface-muted)'}
              stroke={farbe}
              strokeWidth={1.5}
            />
            <Beschriftung
              x={x(platz.von) + 10}
              y={y + 19}
              ton="stark"
              gewicht="kraeftig"
              groesse={12.5}
            >
              {platz.name}
            </Beschriftung>
            <Beschriftung x={links} y={y + balkenHoehe + 15} ton="leise" groesse={11.5}>
              {platz.hinweis}
            </Beschriftung>
          </g>
        )
      })}

      <UmbrochenerText
        x={320}
        y={hoehe - 52}
        breite={608}
        text={`Zwischen ${alsUhrzeit(blindVon)} und ${alsUhrzeit(blindBis)} stellt nur noch der Direkthandel einen Preis. Es gibt dann keinen Kurs, gegen den man ihn halten könnte – und die Spanne ist regelmäßig größer als am Nachmittag.`}
        ton="gedaempft"
      />
    </FigureSvg>
  )
}

// -------------------------------------------------- Sicherung und Anspruch

/**
 * Umfang gegen Rechtsqualität – die Achse, die in der Tabelle fehlt.
 *
 * Die Tabelle im Thema nennt beides, aber nebeneinander. Der Zusammenhang
 * wird erst sichtbar, wenn man sie gegeneinander aufträgt: Je weiter die
 * Zusage reicht, desto schwächer ist sie rechtlich unterlegt. Das ist keine
 * Wertung der freiwilligen Systeme – sie haben zuverlässig gezahlt –, sondern
 * die Feststellung, worauf man sich jeweils verlässt.
 *
 * Die Grafik trägt bewusst keine Beträge über der gesetzlichen Grenze: Wie
 * weit ein freiwilliger Fonds reicht, hängt am Eigenkapital der einzelnen
 * Bank und ändert sich mit jeder Satzungsänderung.
 */
const SICHERUNGEN = [
  {
    name: 'Gesetzliche Sicherung',
    text: `${formatCurrencyRounded(einlagensicherungGrenze)} je Person und Bank`,
    farbe: FARBEN.marke,
  },
  {
    name: 'Freiwilliger Fonds',
    text: 'weit darüber – nach Satzung, nicht nach Gesetz',
    farbe: FARBEN.warnung,
  },
  {
    name: 'Institutssicherung',
    text: 'stützt die Bank, statt Einleger zu entschädigen',
    farbe: FARBEN.akzent,
  },
] as const

export function EinlagensicherungAnspruch() {
  // Drei Zeilen Fußtext unter der x-Achse, samt Unterlängen.
  const hoehe = 356
  const achseX = 104
  const achseY = 268
  const kastenBreite = 200
  const kastenHoehe = 72

  /*
    Die Kästen stehen an festen Plätzen, nicht an gerechneten Koordinaten.

    Der erste Entwurf hat die drei Systeme als Punkte auf zwei Achsen gesetzt
    und die Namen darüber geschrieben. Am linken und rechten Rand lief die
    Beschriftung dann aus dem Bild – ein mittig gesetzter Text von zweihundert
    Pixeln passt neben einen Punkt, der selbst am Rand sitzt, nun einmal
    nicht. Feste Plätze für die Kästen lösen das, ohne die Aussage zu ändern:
    Die Anordnung von links oben nach rechts unten ist der Inhalt.
  */
  const plaetze = [
    { x: achseX + 8, y: 44 },
    { x: 220, y: 132 },
    { x: 620 - kastenBreite, y: 190 },
  ]

  return (
    <FigureSvg id="einlagensicherung-anspruch" viewBox={`0 0 640 ${hoehe}`}>
      <Beschriftung x={achseX - 8} y={54} anchor="end" ton="leise" groesse={12}>
        einklagbar
      </Beschriftung>
      <Beschriftung x={achseX - 8} y={achseY - 12} anchor="end" ton="leise" groesse={12}>
        nach Satzung
      </Beschriftung>

      <line
        x1={achseX}
        y1={30}
        x2={achseX}
        y2={achseY}
        stroke={FARBEN.raster}
        strokeWidth={1.5}
      />
      <line
        x1={achseX}
        y1={achseY}
        x2={624}
        y2={achseY}
        stroke={FARBEN.raster}
        strokeWidth={1.5}
      />

      <Beschriftung x={achseX} y={achseY + 20} ton="leise" groesse={12}>
        bis zur gesetzlichen Grenze
      </Beschriftung>
      <Beschriftung x={624} y={achseY + 20} anchor="end" ton="leise" groesse={12}>
        weit darüber
      </Beschriftung>

      {/* Die Verbindung ist keine Kurve durch Messwerte, sondern der Hinweis,
          dass die drei nicht zufällig so liegen. Deshalb dünn und gestrichelt. */}
      <path
        d={plaetze
          .map(
            (platz, index) =>
              `${index === 0 ? 'M' : 'L'}${platz.x + kastenBreite / 2} ${platz.y + kastenHoehe / 2}`
          )
          .join(' ')}
        fill="none"
        stroke={FARBEN.ruhig}
        strokeWidth={1.2}
        strokeDasharray="5 5"
      />

      {/*
        Die Reihenfolge der Plätze ist nicht die der Tabelle im Thema.

        Dort stehen die Systeme nach ihrer Verbreitung; hier stehen sie nach
        Reichweite, und das ist die Aussage der Zeichnung. Die Zuordnung steht
        deshalb ausdrücklich da und ergibt sich nicht aus der Position im
        Datensatz – sonst verschiebt sich die Grafik lautlos, sobald jemand die
        Tabelle umsortiert.
      */}
      {['Gesetzliche Sicherung', 'Institutssicherung', 'Freiwilliger Fonds'].map(
        (name, index) => {
          const system = SICHERUNGEN.find((s) => s.name === name)!
          const platz = plaetze[index]
          return (
            <Feld
              key={system.name}
              x={platz.x}
              y={platz.y}
              breite={kastenBreite}
              hoehe={kastenHoehe}
              farbe={system.farbe}
            >
              <Beschriftung
                x={platz.x + kastenBreite / 2}
                y={platz.y + 24}
                anchor="middle"
                ton="stark"
                gewicht="kraeftig"
                groesse={13}
              >
                {system.name}
              </Beschriftung>
              <UmbrochenerText
                x={platz.x + kastenBreite / 2}
                y={platz.y + 44}
                breite={kastenBreite - 20}
                text={system.text}
                ton="leise"
                groesse={11.5}
              />
            </Feld>
          )
        }
      )}

      <UmbrochenerText
        x={320}
        y={achseY + 46}
        breite={608}
        text="Je weiter die Zusage reicht, desto schwächer ist sie rechtlich unterlegt. Das entwertet die freiwilligen Systeme nicht – sie haben zuverlässig gezahlt. Es heißt nur: Wer sich darauf verlässt, verlässt sich auf eine Zusage anderer Qualität."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}

// ------------------------------------------------ Freibetrag: die Reihenfolge

/**
 * In welcher Reihenfolge der Freistellungsauftrag verteilt wird.
 *
 * Vier Schritte, und die Begründung steckt allein in ihrer Reihenfolge: Ganz
 * vorn steht, was automatisch und ohne Zutun belastet wird, ganz hinten, was
 * man selbst auslöst. Als Liste steht das im Text; als Kette ist zu sehen,
 * dass es ein Gefälle ist – von „passiert von allein“ zu „entscheide ich“.
 */
export function SparerpauschbetragReihenfolge() {
  return (
    <AblaufKette
      id="sparerpauschbetrag-reihenfolge"
      hoehe={178}
      stationen={[
        {
          titel: 'Fondsdepot',
          text: 'Die Vorabpauschale wird im Januar automatisch belastet',
          farbe: FARBEN.gefahr,
        },
        {
          titel: 'Zinskonten',
          text: 'Tages- und Festgeld: der Ertrag steht vorher fest',
        },
        {
          titel: 'Dividenden',
          text: 'Ungefähr kalkulierbar, aber nicht auf den Euro',
        },
        {
          titel: 'Kursgewinne',
          text: 'Entstehen nur, wenn du verkaufst – also zuletzt',
          farbe: FARBEN.akzent,
        },
      ]}
    />
  )
}

// ---------------------------------------------------- Margin und Margin Call

/**
 * Warum eine richtige Einschätzung trotzdem glattgestellt wird.
 *
 * ## Was gerechnet wird
 *
 * Ein Future auf einen Kontraktwert, hinterlegt mit einem Ersteinschuss. Jeden
 * Abend wird die Kursbewegung dem Sicherheitskonto gutgeschrieben oder
 * abgebucht. Fällt es unter die Untergrenze, kommt der Margin Call.
 *
 * Der Kursverlauf ist so gewählt, dass er nach dem Einbruch über den
 * Ausgangswert hinaus steigt. Das ist der Punkt: Die Position wird
 * geschlossen, obwohl die Einschätzung dahinter am Ende zutrifft. Der Text
 * nennt das den Unterschied zwischen Verlustrisiko und Liquiditätsrisiko – und
 * dieser Unterschied ist nur zu sehen, wenn beide Linien nebeneinander laufen.
 */
export function DerivatMargin() {
  const untergrenze = marginKontraktwert * (marginUntergrenzeProzent / 100)

  /*
    Gerechnet wird in `lib/margin.ts`, und zwar der ganze Verlauf – auch über
    den Margin Call hinaus.

    Was danach passiert, ist der eigentliche Inhalt der Grafik: Der Kurs
    erholt sich, das Konto hätte sich mit ihm erholt – nur gibt es die
    Position dann nicht mehr. Diese Fortsetzung wird gestrichelt gezeichnet
    und heißt auch so; sie ist eine Rechnung, kein Verlauf.
  */
  const { tage, margincall } = marginverlauf(
    marginKontraktwert,
    marginErsteinschussProzent,
    marginUntergrenzeProzent,
    marginKursverlauf
  )

  const call = margincall ?? tage.length - 1
  const haetteGehabt = tage[tage.length - 1].konto

  return (
    <LinienDiagramm
      id="derivat-margin"
      xVon={0}
      xBis={marginKursverlauf.length - 1}
      xTeilstriche={tage.map((t) => ({ wert: t.tag, text: `${t.tag + 1}` }))}
      xLabel="Handelstag"
      yEinheit="Euro auf dem Sicherheitskonto"
      hoehe={320}
      rechterRand={64}
      reihen={[
        {
          name: 'Sicherheitskonto',
          farbe: FARBEN.marke,
          punkte: tage.slice(0, call + 1).map((t) => ({ x: t.tag, y: t.konto })),
        },
        {
          name: 'ohne Glattstellung – nur gerechnet',
          farbe: FARBEN.ruhig,
          gestrichelt: true,
          punkte: tage.slice(call).map((t) => ({ x: t.tag, y: t.konto })),
          endText: formatCurrencyRounded(haetteGehabt),
        },
        {
          name: 'Untergrenze',
          farbe: FARBEN.gefahr,
          gestrichelt: true,
          punkte: tage.map((t) => ({ x: t.tag, y: untergrenze })),
        },
      ]}
    />
  )
}

// -------------------------------------------------------- Zeit am Markt

/**
 * Was das Verteilen einer größeren Summe kostet – ohne jede Kursbewegung.
 *
 * ## Warum ohne Schwankung gerechnet wird
 *
 * Weil der Nachteil des Verteilens sonst nach Pech aussähe. Er ist keins: In
 * einem Markt, der gleichmäßig steigt – ohne den Rückgang, den das Verteilen
 * abfedern soll –, liegt das verteilte Depot am Ende hinten, weil ein Teil des
 * Geldes monatelang nicht am Markt war. Das ist Arithmetik und in diesem Sinne
 * das Gegenteil einer Prognose.
 *
 * Was die Grafik ausdrücklich nicht zeigt: den Fall, für den man das Verteilen
 * tatsächlich kauft – den Einbruch kurz nach dem Start. Der steht im Text
 * daneben, und das Nebeneinander ist beabsichtigt: Hier ist der Preis, dort
 * die Versicherung.
 */
export function SparplanWartezeit() {
  const monatsrate = (monate: number) => verteilsumme / monate

  const zeilen = verteilmonate.map((monate) => {
    if (monate === 0) {
      return {
        monate,
        endkapital: calculateCompoundInterest({
          principal: verteilsumme,
          contribution: 0,
          interval: 'monthly',
          annualRatePercent: verteilrendite,
          years: verteiljahre,
        }).finalBalance,
      }
    }

    /*
      Verteilt heißt: Erst wächst die Einzahlungsphase, danach wächst das
      Ergebnis den Rest der Zeit weiter. Das lässt sich in zwei Schritten
      rechnen, statt eine eigene Formel dafür zu erfinden.
    */
    const nachEinzahlung = calculateCompoundInterest({
      principal: 0,
      contribution: monatsrate(monate),
      interval: 'monthly',
      annualRatePercent: verteilrendite,
      years: monate / 12,
    }).finalBalance

    return {
      monate,
      endkapital: calculateCompoundInterest({
        principal: nachEinzahlung,
        contribution: 0,
        interval: 'monthly',
        annualRatePercent: verteilrendite,
        years: verteiljahre - monate / 12,
      }).finalBalance,
    }
  })

  const sofort = zeilen[0].endkapital

  return (
    <SaeulenDiagramm
      id="sparplan-wartezeit"
      einheit={`Euro nach ${verteiljahre} Jahren`}
      hoehe={300}
      saeulen={zeilen.map((zeile) => ({
        label: zeile.monate === 0 ? 'alles sofort' : `über ${zeile.monate} Monate`,
        teile: [
          {
            wert: zeile.endkapital,
            farbe: zeile.monate === 0 ? FARBEN.marke : FARBEN.ruhig,
          },
        ],
        wertText: formatCurrencyRounded(zeile.endkapital),
        hinweis:
          zeile.monate === 0
            ? 'die Vergleichsgröße'
            : `− ${formatCurrencyRounded(sofort - zeile.endkapital)}`,
      }))}
    />
  )
}

// -------------------------------------------------- Zyklisch und defensiv

/**
 * Wie sich zyklische und defensive Werte im Konjunkturverlauf unterscheiden.
 *
 * ## Warum ohne Zahlen an der Achse
 *
 * Weil es keine gibt, die allgemein gälten. Wie stark eine Branche schwankt,
 * hängt am Zyklus, am Land und am Zeitraum; jede Zahl hier wäre ein
 * herausgegriffenes Beispiel, das aussähe wie eine Regel. Was allgemein gilt,
 * ist die Form: Beide folgen derselben Konjunktur, der eine mit großem, der
 * andere mit kleinem Ausschlag.
 *
 * Die Kurven sind deshalb ausdrücklich als schematisch bezeichnet – und sie
 * enden auf derselben Höhe, weil die Aussage über die Schwankung geht und
 * nicht über die Rendite.
 */
export function BranchenZyklus() {
  /*
    Die Kästen liegen unter dem Tiefpunkt der zyklischen Kurve.

    Vorher standen sie bei mitte + 62 und deckten damit genau die Stelle ab,
    um die es geht: den tiefsten Punkt des starken Ausschlags. Eine Grafik,
    die ihre eigene Aussage verdeckt, ist keine.
  */
  const hoehe = 344
  const links = 20
  const rechts = 620
  const mitte = 140
  const oben = 46
  const kastenOben = 236

  const punkte = (ausschlag: number) =>
    Array.from({ length: 61 }, (_, i) => {
      const anteil = i / 60
      const x = links + anteil * (rechts - links)
      const y = mitte - Math.sin(anteil * 2 * Math.PI) * ausschlag
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    }).join(' ')

  return (
    <FigureSvg id="branchen-zyklus" viewBox={`0 0 640 ${hoehe}`}>
      <Beschriftung x={320} y={22} anchor="middle" ton="leise" groesse={12}>
        schematisch – die Form ist die Aussage, nicht die Höhe
      </Beschriftung>

      <Beschriftung x={links} y={oben - 8} ton="leise" groesse={12}>
        Aufschwung
      </Beschriftung>
      <Beschriftung x={320} y={oben - 8} anchor="middle" ton="leise" groesse={12}>
        Abschwung
      </Beschriftung>
      <Beschriftung x={rechts} y={oben - 8} anchor="end" ton="leise" groesse={12}>
        Aufschwung
      </Beschriftung>

      <line
        x1={links}
        y1={mitte}
        x2={rechts}
        y2={mitte}
        stroke={FARBEN.raster}
        strokeWidth={1.5}
      />

      <path d={punkte(80)} fill="none" stroke={FARBEN.gefahr} strokeWidth={2.5} />
      <path d={punkte(25)} fill="none" stroke={FARBEN.akzent} strokeWidth={2.5} />

      <Feld x={links} y={kastenOben} breite={288} hoehe={64} farbe={FARBEN.gefahr}>
        <Beschriftung x={links + 14} y={kastenOben + 24} ton="gefahr" gewicht="kraeftig">
          Zyklisch
        </Beschriftung>
        <Beschriftung x={links + 14} y={kastenOben + 44} ton="leise" groesse={11.5}>
          Auto, Maschinenbau, Chemie, Banken, Luxus
        </Beschriftung>
      </Feld>

      <Feld x={332} y={kastenOben} breite={288} hoehe={64} farbe={FARBEN.akzent}>
        <Beschriftung x={346} y={kastenOben + 24} ton="akzent" gewicht="kraeftig">
          Defensiv
        </Beschriftung>
        <Beschriftung x={346} y={kastenOben + 44} ton="leise" groesse={11.5}>
          Nahrungsmittel, Versorger, Gesundheit, Telekom
        </Beschriftung>
      </Feld>

      <UmbrochenerText
        x={320}
        y={kastenOben + 84}
        breite={608}
        text="Beide folgen derselben Konjunktur. Eine Branchenwette ist deshalb fast immer eine Wette auf den Zeitpunkt der Wende – und der ist so wenig vorhersagbar wie alles andere am Markt."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}
