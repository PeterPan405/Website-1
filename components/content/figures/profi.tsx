import {
  BalkenDiagramm,
  FARBEN,
  LinienDiagramm,
  SaeulenDiagramm,
  type Reihe,
} from '@/components/content/figures/Diagramme'
import { zinsschock } from '@/lib/anleihen'
import { formatCurrencyRounded, formatNumber, formatPercent } from '@/lib/format'
import { inflationsbeispiel } from '@/lib/inflations-beispiele'
import {
  anleiheBeispiel,
  anleiheMarktzins,
  effektiverSteuersatz,
  immobilieEigenkapitalquoten,
  immobilieKaufpreis,
  immobilieWertaenderungen,
  inflationNominalrenditen,
  entnahmeraten,
  goldEinsatz,
  goldWertsteigerungen,
  hebelAnstieg,
  hebelFaktoren,
  optionBasis,
  sparfall,
  streuungEinzelvolatilitaet,
  streuungKorrelation,
  streuungTitelzahlen,
  sequenzEntnahme,
  sequenzRenditen,
  sequenzStartkapital,
} from '@/lib/lernszenarien'
import { sensitivitaeten } from '@/lib/optionen'
import { reihenfolgevergleich } from '@/lib/sequenzrisiko'

/**
 * Grafiken für die Profi-Stufen.
 *
 * ## Warum diese Stufe eigene Grafiken braucht
 *
 * Bis hierher hatte keine einzige Profi-Stufe eine – dabei ist sie die, in der
 * am meisten gerechnet wird. Die Beispiele dort sind auch die, bei denen eine
 * Tabelle am schnellsten an ihre Grenze kommt: Ein Auszahlungsprofil, eine
 * Delta-Kurve, der Unterschied zwischen Näherung und exakter Rechnung – das
 * sind Verläufe, und Verläufe zeigen sich nicht in fünf Zeilen.
 */

// ------------------------------------------------------------ Sequenzrisiko

export function RisikoSequenz() {
  const vergleich = reihenfolgevergleich(
    sequenzStartkapital,
    sequenzRenditen,
    sequenzEntnahme
  )

  const zuPunkten = (verlauf: { jahr: number; wert: number }[]) => [
    { x: 0, y: sequenzStartkapital },
    ...verlauf.map((z) => ({ x: z.jahr, y: z.wert })),
  ]

  const reihen: Reihe[] = [
    {
      name: 'gute Jahre zuerst',
      farbe: FARBEN.marke,
      punkte: zuPunkten(vergleich.gutZuerst.verlauf),
      endText: formatCurrencyRounded(vergleich.gutZuerst.endwert),
    },
    {
      name: 'schlechte Jahre zuerst',
      farbe: FARBEN.gefahr,
      punkte: zuPunkten(vergleich.schlechtZuerst.verlauf),
      endText: formatCurrencyRounded(vergleich.schlechtZuerst.endwert),
    },
  ]

  const jahre = sequenzRenditen.length

  return (
    <LinienDiagramm
      id="risiko-sequenz"
      reihen={reihen}
      xVon={0}
      xBis={jahre}
      xTeilstriche={[0, 3, 6, 9, jahre].map((wert) => ({
        wert,
        text: wert === 0 ? 'Start' : `${wert} J.`,
      }))}
      yEinheit="Depotwert in Euro"
      hoehe={310}
      rechterRand={92}
      beschreibung={
        `Zwei Ruhestandsdepots über ${jahre} Jahre. Beide starten mit ` +
        `${formatCurrencyRounded(sequenzStartkapital)}, beide entnehmen jedes Jahr ` +
        `${formatCurrencyRounded(sequenzEntnahme)}, und beide erleben genau dieselben ` +
        `${jahre} Jahresrenditen – im Mittel ` +
        `${formatPercent(vergleich.mittlereRenditeProzent, 1)} im Jahr. Der einzige Unterschied ist die ` +
        `Reihenfolge. Wer die guten Jahre zuerst hat, steht am Ende bei ` +
        `${formatCurrencyRounded(vergleich.gutZuerst.endwert)}; wer die schlechten zuerst hat, bei ` +
        `${formatCurrencyRounded(vergleich.schlechtZuerst.endwert)} – ein Unterschied von ` +
        `${formatCurrencyRounded(vergleich.unterschied)}. Der Grund ist, dass in einem Rückgangsjahr ` +
        `Anteile billig verkauft werden müssen; die fehlen bei der späteren Erholung dauerhaft. Ohne ` +
        `Entnahme wären beide Linien am Ende deckungsgleich.`
      }
    />
  )
}

// -------------------------------------------------------------- Delta-Kurve

const KURS_VON = 60
const KURS_BIS = 140
const SCHRITTE = 80

export function OptionSensitivitaeten() {
  const kurse = Array.from(
    { length: SCHRITTE + 1 },
    (_, index) => KURS_VON + ((KURS_BIS - KURS_VON) * index) / SCHRITTE
  )

  /*
    Gezeichnet wird Delta, nicht alle vier Sensitivitäten.

    Sie haben völlig verschiedene Einheiten – Delta ist ein Anteil, Vega ein
    Eurobetrag je Prozentpunkt, Theta ein Eurobetrag je Tag. In ein Diagramm
    gezwungen ergäben sie ein Bild, das man nur mit vier Achsen lesen könnte.

    Delta allein trägt ohnehin die Aussage, um die es geht: Wie stark eine
    Option auf den Basiswert reagiert, hängt davon ab, wo der Basiswert steht.
    Und die Steigung dieser Kurve ist Gamma – es steckt also mit im Bild.
  */
  const deltaReihe = (art: 'call' | 'put', jahre: number) =>
    kurse.map((k) => ({
      x: k,
      y: sensitivitaeten(art, { ...optionBasis, kurs: k, jahre }).delta,
    }))

  const kurzeLaufzeit = 1 / 52

  const amGeld = sensitivitaeten('call', optionBasis)
  const tiefImGeld = sensitivitaeten('call', { ...optionBasis, kurs: KURS_BIS })
  const weitAusDemGeld = sensitivitaeten('call', { ...optionBasis, kurs: KURS_VON })

  return (
    <LinienDiagramm
      id="option-delta"
      reihen={[
        {
          name: `Kaufoption, ${formatNumber(optionBasis.jahre * 12, 0)} Monate`,
          farbe: FARBEN.marke,
          punkte: deltaReihe('call', optionBasis.jahre),
        },
        {
          name: 'Kaufoption, eine Woche vor Verfall',
          farbe: FARBEN.akzent,
          gestrichelt: true,
          punkte: deltaReihe('call', kurzeLaufzeit),
        },
      ]}
      xVon={KURS_VON}
      xBis={KURS_BIS}
      xTeilstriche={[60, 80, 100, 120, 140].map((wert) => ({
        wert,
        text: formatNumber(wert, 0),
      }))}
      xLabel={`Kurs des Basiswerts · Basispreis ${formatNumber(optionBasis.basispreis, 0)}`}
      yEinheit="Delta"
      yFormat={(wert) => formatNumber(wert, 1)}
      hoehe={310}
      beschreibung={
        `Das Delta einer Kaufoption über dem Kurs des Basiswerts, bei einem Basispreis von ` +
        `${formatNumber(optionBasis.basispreis, 0)}. Weit aus dem Geld liegt es nahe null ` +
        `(${formatNumber(weitAusDemGeld.delta, 2)} bei einem Kurs von ${KURS_VON}): Die Option reagiert ` +
        `kaum. Tief im Geld liegt es nahe eins (${formatNumber(tiefImGeld.delta, 2)} bei ${KURS_BIS}): ` +
        `Sie bewegt sich fast wie die Aktie selbst. Am Geld liegt es bei ` +
        `${formatNumber(amGeld.delta, 2)}. Die gestrichelte Linie zeigt dieselbe Option eine Woche vor ` +
        `Verfall – der Übergang wird zur Stufe. Genau diese Verschärfung ist das Gamma, und sie ist der ` +
        `Grund, warum eine Absicherung kurz vor Verfall dauernd nachjustiert werden muss.`
      }
    />
  )
}

// ------------------------------------------------------ Näherung und Konvexität

/** Zinsänderungen in Prozentpunkten, von deutlich fallend bis deutlich steigend. */
const AENDERUNGEN = Array.from({ length: 33 }, (_, index) => -4 + index * 0.25)

export function AnleiheKonvexitaet() {
  const punkte = AENDERUNGEN.map((aenderung) => {
    const ergebnis = zinsschock(anleiheBeispiel, anleiheMarktzins, aenderung)
    return { aenderung, ...ergebnis }
  })

  const beiPlusZwei = punkte.find((p) => p.aenderung === 2)!
  const beiMinusZwei = punkte.find((p) => p.aenderung === -2)!

  return (
    <LinienDiagramm
      id="anleihe-konvexitaet"
      reihen={[
        {
          name: 'tatsächlicher Kurs (Barwert)',
          farbe: FARBEN.marke,
          punkte: punkte.map((p) => ({ x: p.aenderung, y: p.tatsaechlichProzent })),
        },
        {
          name: 'was die Duration vorhersagt',
          farbe: FARBEN.ruhig,
          gestrichelt: true,
          punkte: punkte.map((p) => ({ x: p.aenderung, y: p.genaehertProzent })),
        },
      ]}
      xVon={-4}
      xBis={4}
      xTeilstriche={[-4, -2, 0, 2, 4].map((wert) => ({
        wert,
        text: `${wert > 0 ? '+' : ''}${formatNumber(wert, 0)}`,
      }))}
      xLabel="Zinsänderung in Prozentpunkten"
      yEinheit="Kursänderung in Prozent"
      /*
        Der Achsenboden folgt dem tiefsten tatsächlichen Wert, auf zehn
        abgerundet. Fest gesetzt wäre er nach der ersten Änderung an der
        Beispielanleihe entweder zu eng oder unnötig weit.
      */
      yMinimum={Math.floor(Math.min(...punkte.map((p) => p.genaehertProzent)) / 10) * 10}
      yFormat={(wert) => `${wert > 0 ? '+' : ''}${formatNumber(wert, 0)}`}
      nulllinie
      hoehe={310}
      beschreibung={
        `Für eine Anleihe mit ${formatPercent(anleiheBeispiel.kuponProzent, 0)} Kupon und ` +
        `${anleiheBeispiel.jahre} Jahren Restlaufzeit: die tatsächliche Kursänderung gegen das, was die ` +
        `Duration vorhersagt. Die Näherung ist eine Gerade, der wirkliche Verlauf eine Kurve – und die ` +
        `Kurve liegt auf beiden Seiten über der Geraden. Bei ` +
        `${formatNumber(2, 0)} Prozentpunkten mehr Zins fällt der Kurs um ` +
        `${formatNumber(Math.abs(beiPlusZwei.tatsaechlichProzent), 1)} Prozent statt der vorhergesagten ` +
        `${formatNumber(Math.abs(beiPlusZwei.genaehertProzent), 1)}; bei zwei Punkten weniger steigt er um ` +
        `${formatNumber(beiMinusZwei.tatsaechlichProzent, 1)} statt ` +
        `${formatNumber(beiMinusZwei.genaehertProzent, 1)}. Dieser Abstand ist die Konvexität. Sie fällt ` +
        `immer zugunsten des Anleihebesitzers aus: Es fällt weniger als gedacht und steigt mehr als ` +
        `gedacht. Die Duration allein ist deshalb keine grobe Schätzung, sondern eine systematisch ` +
        `vorsichtige.`
      }
    />
  )
}

// ---------------------------------------------------- Was Steuerstundung wert ist

/**
 * Jährlich versteuert gegen erst am Ende versteuert.
 *
 * Der Lerntext sagt, die gestundete Variante liege „spürbar vorn“, ohne die
 * Zahl zu nennen. Sie steht jetzt in der Grafik – und sie ist größer, als
 * „spürbar“ vermuten lässt.
 *
 * Gerechnet wird ohne Vorabpauschale und ohne Teilfreistellung: Beide
 * verkleinern den Effekt, beide hängen an Werten, die sich jährlich ändern,
 * und beide stehen im Text daneben. Was hier gezeigt wird, ist die
 * Obergrenze des Effekts – so ist es auch beschriftet.
 */
export function ZinseszinsSteuerstundung() {
  const jahre = Array.from({ length: sparfall.jahre + 1 }, (_, index) => index)
  const satz = effektiverSteuersatz / 100
  const brutto = sparfall.brutto / 100

  /*
    Zwei Verläufe, ein Unterschied.

    Bei jährlicher Versteuerung wächst das Kapital mit der um die Steuer
    verminderten Rendite – Jahr für Jahr, auf einer dadurch kleineren Basis.
    Bei Stundung wächst es brutto, und die Steuer fällt einmal am Ende auf
    den gesamten Gewinn an.
  */
  const jaehrlich = jahre.map((jahr) => {
    let wert = 0
    for (let i = 0; i < jahr; i++) {
      wert = (wert + sparfall.rate * 12) * (1 + brutto * (1 - satz))
    }
    return { x: jahr, y: wert }
  })

  const gestundet = jahre.map((jahr) => {
    let wert = 0
    for (let i = 0; i < jahr; i++) {
      wert = (wert + sparfall.rate * 12) * (1 + brutto)
    }
    const eingezahlt = sparfall.rate * 12 * jahr
    return { x: jahr, y: wert - Math.max(wert - eingezahlt, 0) * satz }
  })

  const endeJaehrlich = jaehrlich[jaehrlich.length - 1].y
  const endeGestundet = gestundet[gestundet.length - 1].y

  return (
    <LinienDiagramm
      id="zinseszins-steuerstundung"
      reihen={[
        {
          name: 'Steuer erst beim Verkauf',
          farbe: FARBEN.marke,
          punkte: gestundet,
          endText: formatCurrencyRounded(endeGestundet),
        },
        {
          name: 'jährlich versteuert',
          farbe: FARBEN.warnung,
          gestrichelt: true,
          punkte: jaehrlich,
        },
      ]}
      xVon={0}
      xBis={sparfall.jahre}
      xTeilstriche={[0, 10, 20, 30].map((wert) => ({
        wert,
        text: wert === 0 ? 'Start' : `${wert} J.`,
      }))}
      yEinheit="nach Steuern, in Euro"
      hoehe={300}
      rechterRand={96}
      beschreibung={
        `${formatCurrencyRounded(sparfall.rate)} monatlich über ${sparfall.jahre} Jahre bei ` +
        `${formatPercent(sparfall.brutto, 0)} Bruttorendite und ` +
        `${formatPercent(effektiverSteuersatz, 2)} Steuer auf Erträge. Wird jedes Jahr versteuert, ` +
        `bleiben am Ende ${formatCurrencyRounded(endeJaehrlich)}; fällt die Steuer erst beim Verkauf an, ` +
        `sind es ${formatCurrencyRounded(endeGestundet)} – ` +
        `${formatCurrencyRounded(endeGestundet - endeJaehrlich)} mehr bei identischem Steuersatz. Der ` +
        `Unterschied entsteht allein daraus, dass der noch nicht abgeführte Betrag bis zum Verkauf ` +
        `mitarbeitet. Die deutsche Vorabpauschale verkleinert diesen Vorteil; sie ist hier nicht ` +
        `eingerechnet, die Grafik zeigt also die Obergrenze.`
      }
    />
  )
}

// ------------------------------------------------- Steuer auf Scheingewinne

/**
 * Was von einer Nominalrendite nach Steuer und Inflation übrig bleibt.
 *
 * Der wunde Punkt: Versteuert wird der nominale Ertrag, auch der Teil, der
 * nur die Geldentwertung ausgleicht. Wer real bei null steht, zahlt trotzdem.
 */
export function InflationSteuer() {
  const saeulen = inflationNominalrenditen.map((nominal) => {
    const nachSteuer = nominal * (1 - effektiverSteuersatz / 100)
    const real = nachSteuer - inflationsbeispiel.rate
    return {
      label: formatPercent(nominal, 0),
      teile: [
        { wert: Math.max(real, 0), farbe: FARBEN.marke },
        { wert: Math.min(inflationsbeispiel.rate, nachSteuer), farbe: FARBEN.warnung },
        { wert: nominal - nachSteuer, farbe: FARBEN.gefahr },
      ],
      wertText: `${real >= 0 ? '+' : '−'} ${formatPercent(Math.abs(real), 1)}`,
      hinweis: 'real nach Steuer',
    }
  })

  const schwelle = inflationsbeispiel.rate / (1 - effektiverSteuersatz / 100)

  return (
    <SaeulenDiagramm
      id="inflation-steuer"
      saeulen={saeulen}
      einheit="Nominalrendite in Prozent"
      legende={[
        { farbe: FARBEN.gefahr, text: 'Steuer' },
        { farbe: FARBEN.warnung, text: 'Kaufkraftverlust' },
        { farbe: FARBEN.marke, text: 'was real übrig bleibt' },
      ]}
      hoehe={300}
      beschreibung={
        `Vier Nominalrenditen bei ${formatPercent(inflationsbeispiel.rate, 1)} Inflation und ` +
        `${formatPercent(effektiverSteuersatz, 2)} Steuer. Versteuert wird der nominale Ertrag – auch der ` +
        `Teil, der nur die Geldentwertung ausgleicht. ` +
        saeulen
          .map((s, index) =>
            index === 0
              ? `Bei ${s.label} nominal bleiben real ${s.wertText}`
              : `bei ${s.label} nominal ${s.wertText}`
          )
          .join(', ') +
        `. Erst ab ${formatPercent(schwelle, 1)} Nominalrendite steht man nach Steuer und Inflation ` +
        `überhaupt bei null. Das ist der Grund, warum ein Zinssatz, der die Inflation gerade deckt, real ` +
        `ein Verlust ist.`
      }
    />
  )
}

// ------------------------------------------------------ Der Hebel bei Immobilien

/**
 * Wertänderung des Objekts, umgerechnet auf das eingesetzte Eigenkapital.
 *
 * Die Zahlen sind die des Lernthemas: Der Kredit bleibt in voller Höhe
 * stehen, also trifft die gesamte Wertänderung den eigenen Einsatz. Nach oben
 * wird das in Beratungsgesprächen vorgerechnet, nach unten selten.
 */
export function ImmobilieHebel() {
  const balken = immobilieEigenkapitalquoten.flatMap((quote) => {
    const eigenkapital = immobilieKaufpreis * (quote / 100)
    return immobilieWertaenderungen.map((aenderung) => {
      const wirkung = ((immobilieKaufpreis * (aenderung / 100)) / eigenkapital) * 100
      return {
        label: `${formatPercent(quote, 0)} Eigenkapital, ${aenderung > 0 ? '+' : '−'}${formatPercent(Math.abs(aenderung), 0)}`,
        wert: Math.abs(wirkung),
        wertText: `${wirkung > 0 ? '+' : '−'} ${formatPercent(Math.abs(wirkung), 0)}`,
        farbe: wirkung > 0 ? FARBEN.marke : FARBEN.gefahr,
      }
    })
  })

  const kleinste = immobilieEigenkapitalquoten[immobilieEigenkapitalquoten.length - 1]

  return (
    <BalkenDiagramm
      id="immobilie-hebel"
      balken={balken}
      labelBreite={186}
      beschreibung={
        `Ein Objekt für ${formatCurrencyRounded(immobilieKaufpreis)}, finanziert mit unterschiedlich viel ` +
        `Eigenkapital. Der Kredit bleibt bei einer Wertänderung in voller Höhe stehen, also trifft die ` +
        `gesamte Änderung den eigenen Einsatz. ` +
        balken.map((b) => `${b.label} ergibt ${b.wertText}`).join('; ') +
        `. Bei ${formatPercent(kleinste, 0)} Eigenkapital wird aus zehn Prozent Wertverlust ein Verlust von ` +
        `hundert Prozent des Einsatzes – das Eigenkapital ist dann rechnerisch weg, der Kredit läuft weiter. ` +
        `Der Hebel wirkt in beide Richtungen gleich stark; vorgerechnet wird meist nur die eine.`
      }
    />
  )
}

// -------------------------------------------------- Pfadabhängigkeit

/**
 * Warum ein Hebelprodukt mit täglichem Vielfachen zurückbleibt.
 *
 * Der Basiswert steigt und fällt anschließend genau so weit zurück, dass er
 * wieder bei hundert steht. Das Produkt tut das nicht, und der Rückstand
 * wächst mit dem Faktor. Zwei Tage genügen, um ihn zu zeigen – über Wochen
 * mit Seitwärtsbewegung wird daraus ein Verlust, obwohl der Basiswert sich
 * nicht bewegt hat.
 */
export function DerivatPfadabhaengigkeit() {
  const rueckgang = (100 / (100 + hebelAnstieg)) * 100 - 100

  const nachZweiTagen = (faktor: number) => {
    const tagEins = 100 * (1 + (faktor * hebelAnstieg) / 100)
    return tagEins * (1 + (faktor * rueckgang) / 100)
  }

  const saeulen = [
    {
      label: 'Basiswert',
      teile: [{ wert: 100, farbe: FARBEN.marke }],
      wertText: formatNumber(100, 1),
      hinweis: 'wieder am Ausgangspunkt',
    },
    ...hebelFaktoren.map((faktor) => {
      const ende = nachZweiTagen(faktor)
      return {
        label: `Faktor ${faktor}`,
        teile: [{ wert: ende, farbe: FARBEN.gefahr }],
        wertText: formatNumber(ende, 1),
        hinweis: `${formatNumber(ende - 100, 1)} gegenüber Start`,
      }
    }),
  ]

  const schlimmster = nachZweiTagen(hebelFaktoren[hebelFaktoren.length - 1])

  return (
    <SaeulenDiagramm
      id="derivat-pfadabhaengigkeit"
      saeulen={saeulen}
      einheit="Stand nach zwei Tagen, Start = 100"
      hoehe={290}
      beschreibung={
        `Zwei Tage: Der Basiswert steigt um ${formatPercent(hebelAnstieg, 0)} und fällt dann um ` +
        `${formatNumber(Math.abs(rueckgang), 2)} Prozent – womit er wieder genau bei 100 steht. ` +
        `Produkte mit täglichem Vielfachen stehen danach bei ` +
        hebelFaktoren
          .map((f) => `Faktor ${f}: ${formatNumber(nachZweiTagen(f), 1)}`)
          .join(', ') +
        `. Keines ist wieder bei 100, und der Rückstand wächst mit dem Faktor: beim höchsten sind es ` +
        `${formatNumber(100 - schlimmster, 1)} Punkte. Der Grund ist, dass das Vielfache **täglich** ` +
        `neu angesetzt wird – nach dem ersten Tag arbeitet es auf einer anderen Basis. Über Wochen mit ` +
        `Seitwärtsbewegung wird daraus ein Verlust, obwohl der Basiswert sich nicht bewegt hat.`
      }
    />
  )
}

// ------------------------------------------------- Wie viele Titel es braucht

export function StreuungTitelzahl() {
  /*
    Die Standardformel für ein gleichgewichtetes Depot.

    Die Schwankung eines Depots aus n gleich gewichteten Titeln beträgt
    σ · √(1/n + (1 − 1/n) · ρ). Der zweite Summand verschwindet nicht: Er ist
    die gemeinsame Marktbewegung, und gegen die hilft keine Zahl von Titeln.
    Genau das ist die Aussage – Streuung senkt das Risiko bis zu einer Grenze
    und nicht darüber hinaus.
  */
  const volatilitaet = (n: number) =>
    streuungEinzelvolatilitaet * Math.sqrt(1 / n + (1 - 1 / n) * streuungKorrelation)

  const untergrenze = streuungEinzelvolatilitaet * Math.sqrt(streuungKorrelation)

  return (
    <LinienDiagramm
      id="streuung-titelzahl"
      reihen={[
        {
          name: 'Schwankung des Depots',
          farbe: FARBEN.marke,
          punkte: streuungTitelzahlen.map((n) => ({
            x: Math.log10(n),
            y: volatilitaet(n),
          })),
        },
        {
          name: 'Grenze durch die gemeinsame Marktbewegung',
          farbe: FARBEN.ruhig,
          gestrichelt: true,
          punkte: [
            { x: 0, y: untergrenze },
            { x: Math.log10(250), y: untergrenze },
          ],
        },
      ]}
      /*
        Die x-Achse ist logarithmisch.

        Von einem auf zwanzig Titel passiert fast alles; von hundert auf
        zweihundertfünfzig nichts mehr. Linear aufgetragen klebte der ganze
        Inhalt am linken Rand.
      */
      xVon={0}
      xBis={Math.log10(250)}
      xTeilstriche={[1, 5, 20, 100, 250].map((n) => ({
        wert: Math.log10(n),
        text: String(n),
      }))}
      xLabel="Zahl der Titel im Depot"
      yEinheit="Schwankung im Jahr, in Prozent"
      yFormat={(wert) => formatNumber(wert, 0)}
      hoehe={300}
      beschreibung={
        `Ein gleichgewichtetes Depot aus Titeln mit je ` +
        `${formatPercent(streuungEinzelvolatilitaet, 0)} Schwankung und einer mittleren Korrelation von ` +
        `${formatNumber(streuungKorrelation, 1)}. Ein einzelner Titel schwankt mit ` +
        `${formatNumber(volatilitaet(1), 0)} Prozent, fünf Titel mit ${formatNumber(volatilitaet(5), 0)}, ` +
        `zwanzig mit ${formatNumber(volatilitaet(20), 0)} und hundert mit ` +
        `${formatNumber(volatilitaet(100), 0)}. Der weitaus größte Teil des Gewinns liegt zwischen einem und ` +
        `zwanzig Titeln; danach passiert kaum noch etwas. Die gestrichelte Linie bei ` +
        `${formatNumber(untergrenze, 0)} Prozent ist die Grenze: Sie entsteht daraus, dass alle Aktien ` +
        `teilweise gemeinsam schwanken, und gegen sie hilft keine Zahl von Titeln. Wer streut, entfernt das ` +
        `Risiko einzelner Unternehmen – nicht das des Marktes.`
      }
    />
  )
}

// ----------------------------------------------------- Wie lange das Geld reicht

/**
 * Entnahmeraten gegen die Reihenfolge der Renditejahre.
 *
 * Die verbreitete Faustregel nennt vier Prozent. Ob sie trägt, hängt an
 * etwas, das niemand wählen kann – deshalb steht hier beides nebeneinander.
 */
export function PortfolioEntnahme() {
  const saeulen = entnahmeraten.map((rate) => {
    const entnahme = (sequenzStartkapital * rate) / 100
    const vergleich = reihenfolgevergleich(sequenzStartkapital, sequenzRenditen, entnahme)
    return {
      label: formatPercent(rate, 0),
      teile: [
        { wert: Math.max(vergleich.schlechtZuerst.endwert, 0), farbe: FARBEN.gefahr },
        {
          wert: Math.max(
            vergleich.gutZuerst.endwert - vergleich.schlechtZuerst.endwert,
            0
          ),
          farbe: FARBEN.marke,
        },
      ],
      wertText: formatCurrencyRounded(vergleich.gutZuerst.endwert),
      hinweis: `mind. ${formatCurrencyRounded(vergleich.schlechtZuerst.endwert)}`,
    }
  })

  const vier = entnahmeraten.indexOf(4 as (typeof entnahmeraten)[number])
  const beiVier = reihenfolgevergleich(
    sequenzStartkapital,
    sequenzRenditen,
    (sequenzStartkapital * 4) / 100
  )

  return (
    <SaeulenDiagramm
      id="portfolio-entnahme"
      saeulen={saeulen}
      einheit="Restkapital nach den Jahren, in Euro"
      legende={[
        { farbe: FARBEN.gefahr, text: 'schlechte Jahre zuerst' },
        { farbe: FARBEN.marke, text: 'zusätzlich, wenn die guten zuerst kamen' },
      ]}
      hoehe={300}
      beschreibung={
        `Vier Entnahmeraten auf ${formatCurrencyRounded(sequenzStartkapital)} über ` +
        `${sequenzRenditen.length} Jahre, gerechnet gegen dieselbe Renditereihe – einmal mit den schlechten ` +
        `Jahren zuerst, einmal mit den guten. Der untere Teil jeder Säule ist das, was in beiden Fällen ` +
        `sicher übrig bleibt; der obere ist der Unterschied, den allein die Reihenfolge ausmacht. ` +
        (vier >= 0
          ? `Bei der verbreiteten Vier-Prozent-Regel stehen am Ende zwischen ` +
            `${formatCurrencyRounded(beiVier.schlechtZuerst.endwert)} und ` +
            `${formatCurrencyRounded(beiVier.gutZuerst.endwert)}. `
          : '') +
        `Je höher die Rate, desto größer wird der obere Teil im Verhältnis – die Regel wird also nicht nur ` +
        `knapper, sondern auch unsicherer. Eine Entnahmerate ist deshalb keine Zahl, sondern eine Zahl mit ` +
        `einer Spanne.`
      }
    />
  )
}

// -------------------------------------------------- Gold und die Haltefrist

export function RohstoffeGoldSteuer() {
  const saeulen = goldWertsteigerungen.map((zuwachs) => {
    const gewinn = (goldEinsatz * zuwachs) / 100
    const steuer = gewinn * (effektiverSteuersatz / 100)
    return {
      label: `+ ${formatPercent(zuwachs, 0)}`,
      teile: [
        { wert: gewinn - steuer, farbe: FARBEN.marke },
        { wert: steuer, farbe: FARBEN.gefahr },
      ],
      wertText: formatCurrencyRounded(gewinn),
      hinweis: `${formatCurrencyRounded(steuer)} Unterschied`,
    }
  })

  return (
    <SaeulenDiagramm
      id="rohstoffe-gold-steuer"
      saeulen={saeulen}
      einheit="Gewinn in Euro"
      legende={[
        { farbe: FARBEN.marke, text: 'bleibt in jedem Fall' },
        { farbe: FARBEN.gefahr, text: 'nur bei Wertpapieren fällig' },
      ]}
      hoehe={290}
      beschreibung={
        `${formatCurrencyRounded(goldEinsatz)} Einsatz, drei Wertsteigerungen. Bei physischem Gold ist der ` +
        `Gewinn nach einem Jahr Haltedauer in Deutschland steuerfrei; bei einem Wertpapier auf denselben ` +
        `Goldpreis fallen ${formatPercent(effektiverSteuersatz, 2)} an, gleich wie lange gehalten wurde. ` +
        saeulen
          .map((s, index) =>
            index === 0
              ? `Bei ${formatPercent(goldWertsteigerungen[index], 0)} Wertsteigerung sind das ${s.hinweis}`
              : `bei ${formatPercent(goldWertsteigerungen[index], 0)} ${s.hinweis}`
          )
          .join(', ') +
        `. Der Unterschied ist kein Detail, sondern bei gleicher Bruttorendite gut ein Viertel des Gewinns. ` +
        `Dem stehen Kosten gegenüber, die ein Wertpapier nicht hat: Aufschlag beim Kauf, Abschlag beim ` +
        `Verkauf, Verwahrung. Der Rechtsstand kann sich ändern.`
      }
    />
  )
}
