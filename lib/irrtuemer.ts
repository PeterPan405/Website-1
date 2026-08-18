import { compoundBalance, realRatePercent, recoveryGainPercent } from '@/lib/finance'
import { vergleiche } from '@/lib/kosten'
import { berechneSteuer } from '@/lib/kapitalertragsteuer'
import { mittlereRendite } from '@/lib/sequenzrisiko'

/**
 * Verbreitete Irrtümer – und die Rechnung, die sie richtigstellt.
 *
 * ## Warum ein Irrtum eine eigene Form braucht
 *
 * Ein Glossareintrag erklärt einen Begriff, ein Verwechslungspaar stellt zwei
 * nebeneinander. Beides setzt voraus, dass jemand **nachschlägt** – dass er
 * also ahnt, dass er etwas nicht weiß. Ein Irrtum ist das Gegenteil: Er fühlt
 * sich an wie Wissen. Wer glaubt, minus fünfzig Prozent seien mit plus fünfzig
 * wieder aufgeholt, sucht nicht nach „Erholung"; er hat die Frage bereits
 * beantwortet.
 *
 * Deshalb steht hier nicht die richtige Aussage, sondern **der Satz, wie er
 * fällt** – daran erkennt man sich wieder. Und darunter, in dieser Reihenfolge:
 * was daran richtig ist, was nicht, und die Rechnung.
 *
 * ## Kein Spott
 *
 * Fast jeder dieser Sätze ist eine **verkürzte Wahrheit**, keine Dummheit.
 * „Der Markt hat sich immer erholt" ist für einen breiten Index über lange
 * Zeiträume richtig; falsch wird er erst, wenn man ihn auf einen einzelnen
 * Wert oder einen einzelnen Markt anwendet. Wer die Verkürzung übernimmt, hat
 * keinen Denkfehler gemacht, sondern einen Satz gehört, dem sein
 * Geltungsbereich abhandengekommen ist. Genau der steht in `richtig`, und er
 * steht **vor** dem Einwand.
 *
 * ## Warum eine Rechnung und keine Behauptung
 *
 * Weil „das stimmt so nicht" ohne Beleg nur ein zweiter Satz ist, dem man
 * glauben soll. Jeder Irrtum trägt deshalb einen `beleg`, und der ist eines
 * von dreien:
 *
 * - **`rechnung`** – Zeilen mit Zahlen und ein Ergebnis. Das Ergebnis wird
 *   von `rechneNach()` aus denselben Funktionen erzeugt, mit denen die Rechner
 *   dieser Website rechnen. Es steht also nicht abgeschrieben da.
 * - **`daten`** – eine Zahl aus einem gepflegten Bestand dieses Repositoriums,
 *   mit der Quelle, die dort hinterlegt ist.
 * - **`regel`** – ein Gesetz oder eine Verordnung, mit Fundstelle.
 *
 * ## Der Wächter
 *
 * `tests/irrtuemer.test.ts` rechnet **jede** `rechnung` nach und vergleicht
 * das Ergebnis mit dem, was auf der Seite steht. Das ist der Punkt, an dem
 * diese Datei sich von einer Textsammlung unterscheidet: Wer eine Zahl in der
 * Prosa ändert und die Rechnung stehen lässt, bekommt einen roten Lauf.
 *
 * Damit der Wächter nicht stumpf wird, gibt es keinen stillen Ausweg. Ein
 * Irrtum ohne nachrechenbare Zahl braucht `probe: { art: 'keine', warum }` –
 * und `warum` ist ein Satz, der begründet, **weshalb** hier keine Zahl stehen
 * darf. Bei der Korrelation in der Krise ist das der eigentliche Inhalt: Eine
 * Zahl wäre die Behauptung, sie halte auch beim nächsten Mal.
 */

/** Die Ordnung der Seite – nach dem, worüber der Irrtum spricht. */
export type Gruppe = 'rendite' | 'risiko' | 'steuern' | 'markt' | 'zahlen' | 'zinsen'

export const GRUPPEN: { id: Gruppe; titel: string; lead: string }[] = [
  {
    id: 'rendite',
    titel: 'Rendite und Verlust',
    lead: 'Prozentrechnung ist nicht symmetrisch. Fast alles in dieser Gruppe folgt daraus.',
  },
  {
    id: 'risiko',
    titel: 'Risiko und Sicherheit',
    lead: '„Sicher" ist selten eine Eigenschaft der Anlage – meist eine Aussage über einen bestimmten Zeitraum.',
  },
  {
    id: 'steuern',
    titel: 'Steuern und Kosten',
    lead: 'Die Beträge sind klein, die Zeiträume lang. Das ist die gefährliche Kombination.',
  },
  {
    id: 'markt',
    titel: 'Markt und Zeitpunkt',
    lead: 'Sätze über den richtigen Moment – und was sie kosten, wenn man ihnen folgt.',
  },
  {
    id: 'zahlen',
    titel: 'Zahlen lesen',
    lead: 'Nicht falsch gerechnet, sondern die falsche Zahl gelesen.',
  },
  {
    id: 'zinsen',
    titel: 'Zinsen und Anleihen',
    lead: 'Der Teil, den fast alle für den langweiligen halten – und in dem die Vorzeichen überraschen.',
  },
]

/** Die Einheit einer Zeile – bestimmt allein die Darstellung. */
export type Einheit = 'prozent' | 'euro' | 'jahre' | 'faktor' | 'anzahl'

export interface Rechenzeile {
  was: string
  wert: number
  einheit: Einheit
  /** Steht diese Zeile für das Ergebnis? Genau eine je Rechnung. */
  ergebnis?: true
}

/**
 * Wie sich die Ergebniszeile aus den übrigen ergibt.
 *
 * Jede Art nennt genau eine Funktion aus dem Bestand dieser Website. Neue
 * Arten kommen dazu, wenn ein Irrtum eine andere Rechnung braucht – aber
 * **keine Art rechnet hier selbst**: Sonst stünde die Formel zweimal da, und
 * die zweite wäre die, die niemand pflegt.
 */
export type Probe =
  /** `recoveryGainPercent(verlust)` – Zeile 0 ist der Verlust in Prozent. */
  | { art: 'erholung' }
  /** `mittlereRendite([...])` über alle Zeilen vor der Ergebniszeile. */
  | { art: 'geometrisch' }
  /** `compoundBalance(kapital, satz, jahre)` – Zeilen 0..2 in dieser Folge. */
  | { art: 'zinseszins' }
  /** `realRatePercent(nominal, inflation)` – Zeilen 0 und 1. */
  | { art: 'realzins' }
  /** Kostenunterschied in Prozent des Endvermögens – siehe `kostenProbe`. */
  | { art: 'kosten'; jahre: number; sparrate: number; guenstig: number; teuer: number }
  /** Effektive Steuerlast in Prozent – siehe `steuerProbe`. */
  | { art: 'steuer'; ertrag: number; freibetrag: number }
  /** Reihe von Faktoren: Zeilen als Prozentänderungen, Ergebnis als Endstand. */
  | { art: 'verkettung'; start: number }
  /** Ein Verhältnis zweier Zeilen – Zeile 0 geteilt durch Zeile 1. */
  | { art: 'verhaeltnis' }
  /**
   * Keine nachrechenbare Zahl – und `warum` sagt, weshalb hier keine stehen
   * darf. Nicht „noch nicht gerechnet": ein Satz, der die Lücke begründet.
   */
  | { art: 'keine'; warum: string }

export interface Rechnung {
  titel: string
  zeilen: Rechenzeile[]
  probe: Probe
}

export interface Beleg {
  art: 'rechnung' | 'daten' | 'regel'
  rechnung?: Rechnung
  /** Der Belegtext bei `daten` und `regel` – bei `rechnung` die Einordnung. */
  text: string
  quelle?: { label: string; url?: string }
}

export interface Irrtum {
  slug: string
  gruppe: Gruppe
  /** Der Satz, wie er üblicherweise fällt. In Anführungszeichen auf der Seite. */
  satz: string
  /** Was daran richtig ist – steht vor dem Einwand, und zwar mit Absicht. */
  richtig: string
  /** Was nicht stimmt. */
  falsch: string
  beleg: Beleg
  /** Wo man weiterliest. */
  lernen?: { text: string; href: string }
  /** Glossareinträge, als Slugs. */
  glossar?: string[]
}

/** Die Ergebniszeile einer Rechnung – oder `undefined`, wenn keine da ist. */
export function ergebniszeile(rechnung: Rechnung): Rechenzeile | undefined {
  return rechnung.zeilen.find((zeile) => zeile.ergebnis)
}

/** Die Zeilen vor dem Ergebnis – die Eingaben der Probe. */
export function eingabezeilen(rechnung: Rechnung): Rechenzeile[] {
  return rechnung.zeilen.filter((zeile) => !zeile.ergebnis)
}

/**
 * Was die Rechnung ergeben muss – nachgerechnet, nicht abgeschrieben.
 *
 * Zurück kommt `null`, wenn die Probe `keine` ist oder die Zeilen nicht zur
 * Probe passen. Beides ist für den Test ein Unterschied: `keine` ist zulässig
 * und begründet, ein Formfehler ist es nicht. Deshalb prüft der Test die Form
 * getrennt und verlässt sich nicht darauf, dass `null` schon in Ordnung geht.
 */
export function rechneNach(rechnung: Rechnung): number | null {
  const eingaben = eingabezeilen(rechnung)
  const werte = eingaben.map((zeile) => zeile.wert)
  const probe = rechnung.probe

  switch (probe.art) {
    case 'erholung': {
      if (werte.length !== 1) return null
      return recoveryGainPercent(werte[0])
    }

    case 'geometrisch': {
      if (werte.length < 2) return null
      return mittlereRendite(werte)
    }

    case 'zinseszins': {
      if (werte.length !== 3) return null
      const [kapital, satz, jahre] = werte
      return compoundBalance(kapital, satz, jahre)
    }

    case 'realzins': {
      if (werte.length !== 2) return null
      return realRatePercent(werte[0], werte[1])
    }

    case 'kosten': {
      const ergebnis = vergleiche(
        {
          einmalanlage: 0,
          sparrate: probe.sparrate,
          jahre: probe.jahre,
          bruttorendite: werte[0] / 100,
        },
        probe.guenstig / 100,
        probe.teuer / 100
      )
      return ergebnis.anteil * 100
    }

    case 'steuer': {
      const ergebnis = berechneSteuer({
        ertrag: probe.ertrag,
        fondsart: 'aktienfonds',
        freibetrag: probe.freibetrag,
        kirchensteuersatz: 0,
      })
      return ergebnis.effektiverSatz * 100
    }

    case 'verkettung': {
      if (werte.length < 2) return null
      return werte.reduce(
        (stand, aenderung) => stand * (1 + aenderung / 100),
        probe.start
      )
    }

    case 'verhaeltnis': {
      if (werte.length !== 2 || werte[1] === 0) return null
      return werte[0] / werte[1]
    }

    case 'keine':
      return null
  }
}

/**
 * Wie genau die Probe treffen muss, je Einheit.
 *
 * Nicht eine Toleranz für alles: Bei Prozentangaben geht es um Zehntel, bei
 * Eurobeträgen über dreißig Jahre um ganze Euro. Eine gemeinsame Schranke
 * wäre entweder für die Prozente zu lasch oder für die Endwerte zu streng –
 * und eine zu lasche Schranke ist eine Absicherung, die nie anschlägt.
 */
export const GENAUIGKEIT: Record<Einheit, number> = {
  prozent: 0.05,
  euro: 1,
  jahre: 0.05,
  faktor: 0.005,
  anzahl: 0.5,
}

/** Alle Irrtümer einer Gruppe, in der Reihenfolge der Datei. */
export function nachGruppe(irrtuemer: readonly Irrtum[], gruppe: Gruppe): Irrtum[] {
  return irrtuemer.filter((irrtum) => irrtum.gruppe === gruppe)
}

/** Wie viele Irrtümer eine nachgerechnete Rechnung tragen. */
export function mitRechnung(irrtuemer: readonly Irrtum[]): number {
  return irrtuemer.filter(
    (irrtum) =>
      irrtum.beleg.rechnung?.probe.art !== 'keine' && irrtum.beleg.rechnung !== undefined
  ).length
}
