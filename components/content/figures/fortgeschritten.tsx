import {
  FARBEN,
  LinienDiagramm,
  SaeulenDiagramm,
} from '@/components/content/figures/Diagramme'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'
import {
  optionBasis,
  optionVolatilitaeten,
  sparquoteRendite,
  sparquoten,
  sparquoteZielvielfaches,
  streuungEinzelvolatilitaet,
} from '@/lib/lernszenarien'
import { preis } from '@/lib/optionen'

/**
 * Grafiken für die Fortgeschritten-Stufen.
 *
 * Was sie verbindet: Es sind die Stellen, an denen der Lerntext von einer
 * Regel auf ihre Bedingungen kommt. Eine Regel lässt sich in einem Satz
 * sagen; ihre Bedingungen sind ein Verlauf.
 */

// ------------------------------------------------ Sparquote und Zeitraum

/**
 * Wie lange es bis zur Unabhängigkeit dauert – ohne Einkommensangabe.
 *
 * ## Warum kein Einkommen vorkommt
 *
 * Das ist das Bemerkenswerte an dieser Rechnung und der Grund, sie zu
 * zeichnen. Das Ziel ist ein Vielfaches der **Ausgaben**, und die Ausgaben
 * sind das, was von der Sparquote übrig bleibt. Beide Seiten hängen am
 * Einkommen, also kürzt es sich heraus.
 *
 * Wer die Hälfte spart, braucht dieselbe Zahl Jahre – ob mit zweitausend
 * Euro im Monat oder mit zwanzigtausend. Nicht die Höhe des Einkommens
 * entscheidet, sondern der Abstand zwischen Einnehmen und Ausgeben.
 *
 * ## Die Formel
 *
 * Gesucht ist das `n`, für das eine jährliche Sparrate `S` bei Rendite `r`
 * auf das Ziel `Z` anwächst: `S · ((1+r)^n − 1) / r = Z`. Aufgelöst nach `n`
 * ergibt das `ln(1 + Z·r/S) / ln(1+r)`. Mit `Z = 25 · (1−s)` und `S = s`
 * bleibt allein die Sparquote übrig.
 */
function jahreBisZumZiel(sparquoteProzent: number): number {
  const s = sparquoteProzent / 100
  const r = sparquoteRendite / 100
  // Ohne Rendite ist es die schlichte Division: so viele Jahresausgaben, wie
  // das Ziel groß ist, geteilt durch das, was im Jahr übrig bleibt.
  if (r === 0) return (sparquoteZielvielfaches * (1 - s)) / s
  return Math.log(1 + ((sparquoteZielvielfaches * (1 - s)) / s) * r) / Math.log(1 + r)
}

export function BudgetSparquoteJahre() {
  const punkte = sparquoten.map((quote) => ({ x: quote, y: jahreBisZumZiel(quote) }))
  const beiZehn = jahreBisZumZiel(10)
  const beiZwanzig = jahreBisZumZiel(20)
  const beiFuenfzig = jahreBisZumZiel(50)

  return (
    <LinienDiagramm
      id="budget-sparquote-jahre"
      reihen={[
        {
          name: `Jahre bis zum ${sparquoteZielvielfaches}-Fachen der Jahresausgaben`,
          farbe: FARBEN.marke,
          punkte,
        },
      ]}
      xVon={sparquoten[0]}
      xBis={sparquoten[sparquoten.length - 1]}
      xTeilstriche={[...sparquoten].map((quote) => ({
        wert: quote,
        text: formatPercent(quote, 0),
      }))}
      xLabel="Sparquote vom Nettoeinkommen"
      yEinheit="Jahre"
      yFormat={(wert) => formatNumber(wert, 0)}
      hoehe={300}
      beschreibung={
        `Wie lange es dauert, bis das Ersparte das ${sparquoteZielvielfaches}-Fache der Jahresausgaben ` +
        `erreicht – bei ${formatPercent(sparquoteRendite, 0)} realer Rendite. Bei einer Sparquote von ` +
        `${formatPercent(10, 0)} sind es ${formatNumber(beiZehn, 0)} Jahre, bei ` +
        `${formatPercent(20, 0)} noch ${formatNumber(beiZwanzig, 0)}, bei ${formatPercent(50, 0)} nur ` +
        `${formatNumber(beiFuenfzig, 0)}. Die Kurve fällt am Anfang steil und flacht dann ab: Die ersten ` +
        `zehn Prozentpunkte mehr Sparquote bringen mehr als die letzten zehn. ` +
        `In dieser Rechnung kommt das Einkommen nicht vor, und das ist kein Versehen – es kürzt sich ` +
        `heraus, weil sowohl das Ziel als auch die Sparrate daran hängen. Entscheidend ist nicht, wie viel ` +
        `hereinkommt, sondern der Abstand zwischen Einnehmen und Ausgeben.`
      }
    />
  )
}

// ------------------------------------------ Korrelation als kostenloser Hebel

/**
 * Was zwei Anlagen zusammen schwanken, je nachdem wie sie zusammenhängen.
 *
 * Der Lerntext nennt die Korrelation den einzigen kostenlosen Hebel. Das ist
 * eine starke Behauptung und lässt sich ausrechnen: Bei perfektem Gleichlauf
 * ist die Mischung genau der Durchschnitt, bei perfektem Gegenlauf verschwindet
 * die Schwankung – und dazwischen liegt der Gewinn, für den niemand etwas
 * bezahlt.
 */
export function RisikoKorrelation() {
  const schritte = 41
  const korrelationen = Array.from(
    { length: schritte },
    (_, index) => -1 + (2 * index) / (schritte - 1)
  )

  /*
    Zwei gleich gewichtete Anlagen mit gleicher Einzelschwankung.

    σ = σ_einzel · √((1 + ρ) / 2). Die Gleichgewichtung ist eine Vereinfachung
    und die ehrlichere: Sie zeigt den Effekt der Korrelation, ohne ihn mit
    einer geschickt gewählten Gewichtung zu vermischen.
  */
  const mischung = (rho: number) => streuungEinzelvolatilitaet * Math.sqrt((1 + rho) / 2)

  return (
    <LinienDiagramm
      id="risiko-korrelation"
      reihen={[
        {
          name: 'Schwankung der Mischung',
          farbe: FARBEN.marke,
          punkte: korrelationen.map((rho) => ({ x: rho, y: mischung(rho) })),
        },
        {
          name: 'Schwankung jeder Anlage für sich',
          farbe: FARBEN.ruhig,
          gestrichelt: true,
          punkte: [
            { x: -1, y: streuungEinzelvolatilitaet },
            { x: 1, y: streuungEinzelvolatilitaet },
          ],
        },
      ]}
      xVon={-1}
      xBis={1}
      xTeilstriche={[-1, -0.5, 0, 0.5, 1].map((wert) => ({
        wert,
        text: formatNumber(wert, 1),
      }))}
      xLabel="Korrelation der beiden Anlagen"
      yEinheit="Schwankung im Jahr, in Prozent"
      yFormat={(wert) => formatNumber(wert, 0)}
      hoehe={300}
      beschreibung={
        `Zwei Anlagen zu gleichen Teilen, jede mit ${formatPercent(streuungEinzelvolatilitaet, 0)} ` +
        `Schwankung. Laufen sie vollständig gleich – Korrelation eins –, schwankt die Mischung genauso ` +
        `stark wie jede einzelne: ${formatNumber(mischung(1), 0)} Prozent. Die gestrichelte Linie zeigt ` +
        `diesen Fall. Bei Korrelation null sind es ${formatNumber(mischung(0), 0)} Prozent, bei ` +
        `minus 0,5 noch ${formatNumber(mischung(-0.5), 0)}, und bei vollständigem Gegenlauf verschwindet ` +
        `die Schwankung ganz. Nichts davon kostet Rendite: Die erwartete Rendite der Mischung ist der ` +
        `Durchschnitt der beiden, gleich wie sie zusammenhängen. Das ist gemeint, wenn von einem ` +
        `kostenlosen Hebel die Rede ist. Was die Grafik nicht zeigt: Korrelationen sind nicht stabil und ` +
        `steigen ausgerechnet dann, wenn alles fällt.`
      }
    />
  )
}

// -------------------------------------------- Volatilität und Optionsprämie

export function OptionVolatilitaet() {
  const saeulen = optionVolatilitaeten.map((vola) => {
    const praemie = preis('call', { ...optionBasis, volatilitaetProzent: vola })
    return {
      label: formatPercent(vola, 0),
      teile: [{ wert: praemie, farbe: FARBEN.marke }],
      wertText: formatCurrency(praemie),
      hinweis: 'Prämie',
    }
  })

  const niedrig = preis('call', {
    ...optionBasis,
    volatilitaetProzent: optionVolatilitaeten[0],
  })
  const hoch = preis('call', {
    ...optionBasis,
    volatilitaetProzent: optionVolatilitaeten[optionVolatilitaeten.length - 1],
  })

  return (
    <SaeulenDiagramm
      id="option-volatilitaet"
      saeulen={saeulen}
      einheit="Prämie in Euro"
      hoehe={280}
      beschreibung={
        `Dieselbe Kaufoption – Kurs und Basispreis ${formatNumber(optionBasis.basispreis, 0)}, ` +
        `${formatNumber(optionBasis.jahre * 12, 0)} Monate Restlaufzeit – bei vier erwarteten ` +
        `Schwankungen. Bei ${formatPercent(optionVolatilitaeten[0], 0)} kostet sie ` +
        `${formatCurrency(niedrig)}, bei ` +
        `${formatPercent(optionVolatilitaeten[optionVolatilitaeten.length - 1], 0)} das ` +
        `${formatNumber(hoch / niedrig, 1)}-Fache: ${formatCurrency(hoch)}. Am Kurs des Basiswerts hat ` +
        `sich dabei nichts geändert. Die erwartete Schwankung ist der einzige Preisbestandteil, den man ` +
        `nicht ablesen kann – Kurs, Basispreis, Laufzeit und Zins stehen fest. Deshalb ist der Kauf einer ` +
        `Option immer auch eine Meinung darüber, ob diese Erwartung zu hoch oder zu niedrig ist.`
      }
    />
  )
}
