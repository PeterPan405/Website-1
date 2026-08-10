/**
 * Macht aus Inhaltsblöcken vorlesbare Abschnitte.
 *
 * ## Warum aus den Blöcken und nicht aus der Seite
 *
 * Man könnte den gerenderten Text aus dem HTML kratzen. Dann läse die Stimme
 * alles vor, was zufällig im `<article>` steht – Schaltflächen, die Zeile
 * „7 Min. Lesezeit“, die Blätternavigation. Die Blöcke sind dieselbe Quelle,
 * aus der die Seite entsteht, und sie wissen, was sie sind: Eine Formel aus
 * Zeichen wie „σ = √(…)“ ist gesprochen wertlos, ihre Erläuterung nicht.
 * Eine Grafik ist unsichtbar für die Stimme – aber ihre Vorlesefassung aus
 * `data/figures.ts` existiert ja gerade für diesen Fall.
 *
 * ## Warum Abschnitte statt eines Textes
 *
 * Browser brechen lange Vorleseaufträge ab – Chrome verstummt bei manchen
 * Stimmen nach einigen Sätzen, ohne Fehler. Kurze Aufträge, die nacheinander
 * gestartet werden, haben das Problem nicht und geben nebenbei den Fortschritt
 * her: „Abschnitt 12 von 40“.
 *
 * Die Typimporte entfernt das Type-Stripping. Der einzige Laufzeitimport geht
 * relativ auf `sprechfassung.ts` – ein Modul ohne eigene Datenimporte, das
 * `tests/` damit mitlädt, ohne dass ein Alias aufgelöst werden muss.
 */

import type { ContentBlock } from '@/data/content'
import { ordnungszahlenSprechbar } from './sprechfassung.ts'

/** Was die Vorlesefassung über eine Grafik wissen muss. */
export interface Vorlesegrafik {
  title: string
  caption: string
  description?: string
}

/** Die deutschen Ordnungswörter für nummerierte Listen. */
const ORDNUNG = [
  'Erstens',
  'Zweitens',
  'Drittens',
  'Viertens',
  'Fünftens',
  'Sechstens',
  'Siebtens',
  'Achtens',
  'Neuntens',
  'Zehntens',
]

/**
 * Entfernt Auszeichnungen, die nur fürs Auge sind, und beugt Ordnungszahlen.
 *
 * „Am 9. August“ liest ein Mensch als „am neunten August“ – die Endung steht
 * nicht da, er ergänzt sie beim Lesen. Eine Stimme tut das nicht; sie sagt
 * „am neunte August“. Deshalb steht sie hier schon im Text.
 *
 * Weiter geht die Umschrift bewusst nicht: Anders als in der Podcastfolge
 * bleiben Zahlen hier Zahlen. Eine Lernseite zeigt „26.364,45“ auch, und ein
 * Text, der Ziffern in Wörter tauscht, wäre für das Auge unbrauchbar.
 */
function nurText(text: string): string {
  return ordnungszahlenSprechbar(text.replaceAll('**', '')).replace(/\s+/g, ' ').trim()
}

/** Sorgt dafür, dass die Stimme am Ende absetzt. */
function alsSatz(text: string): string {
  const glatt = nurText(text)
  if (glatt === '') return ''
  return /[.!?:]$/.test(glatt) ? glatt : `${glatt}.`
}

/**
 * Zerlegt Inhaltsblöcke in vorlesbare Abschnitte.
 *
 * Jeder Abschnitt ist kurz genug für einen einzelnen Vorleseauftrag. Leere
 * Abschnitte entstehen nicht – wer das Ergebnis zählt, zählt Gesprochenes.
 */
export function vorleseAbschnitte(
  bloecke: readonly ContentBlock[],
  grafiken: Record<string, Vorlesegrafik> = {}
): string[] {
  const abschnitte: string[] = []
  const sag = (text: string) => {
    if (text.trim() !== '') abschnitte.push(text)
  }

  for (const block of bloecke) {
    switch (block.type) {
      case 'heading':
        sag(alsSatz(block.text))
        break

      case 'paragraph':
        sag(alsSatz(block.text))
        break

      case 'list':
        block.items.forEach((eintrag, stelle) => {
          const vorwort = block.ordered && ORDNUNG[stelle] ? `${ORDNUNG[stelle]}: ` : ''
          sag(vorwort + alsSatz(eintrag))
        })
        break

      case 'callout':
        if (block.title) sag(alsSatz(block.title))
        for (const eintrag of block.items) sag(alsSatz(eintrag))
        break

      case 'quote':
        sag(
          `Zitat: ${alsSatz(block.text)}${block.source ? ` – ${nurText(block.source)}.` : ''}`
        )
        break

      case 'table': {
        /*
          Eine Tabelle wird zeilenweise gelesen, jede Zelle mit ihrer
          Spaltenüberschrift davor. Nur die Zellen hintereinander („15, 25,
          50“) kann niemand zuordnen, der die Spalten nicht sieht.
        */
        if (block.caption) sag(alsSatz(`Tabelle: ${block.caption}`))
        for (const zeile of block.rows) {
          const teile = zeile.map((zelle, spalte) => {
            const kopf = nurText(block.head[spalte] ?? '')
            return kopf === '' ? nurText(zelle) : `${kopf}: ${nurText(zelle)}`
          })
          sag(`${teile.join('. ')}.`)
        }
        break
      }

      case 'formula':
        /*
          Die Formel selbst wird nicht gesprochen. „K G V gleich Kurs geteilt
          durch“ trüge noch, aber „Sigma gleich Wurzel aus Klammer auf“ ist
          Geräusch. Die Erläuterung daneben sagt, was die Formel tut – sie ist
          die Vorlesefassung.
        */
        sag(`Es folgt eine Formel. ${alsSatz(block.description)}`)
        break

      case 'keyfacts':
        for (const fakt of block.items) {
          sag(`${nurText(fakt.label)}: ${alsSatz(fakt.value)}`)
        }
        break

      case 'figure': {
        const grafik = grafiken[block.figure]
        if (!grafik) break
        const beschreibung = grafik.description ?? block.caption ?? grafik.caption
        sag(`Grafik: ${alsSatz(grafik.title)} ${alsSatz(beschreibung)}`)
        break
      }
    }
  }

  return abschnitte
}

/* ---------------------------------------------------------- Stimmwahl */

/** Das, was die Web-Speech-Schnittstelle über eine Stimme verrät. */
export interface Stimmprofil {
  name: string
  lang: string
  voiceURI: string
  localService: boolean
}

/**
 * Männliche Vornamen der gängigen Systemstimmen.
 *
 * Die Schnittstelle kennt kein Geschlecht – es steckt nur im Namen. Die Liste
 * deckt Windows und Edge (Conrad, Stefan, Killian, Bernd, Florian, Jonas),
 * Apple (Markus, Martin, Viktor, Yannick) und einige Android-Kennungen ab.
 * Eine unbekannte Männerstimme fällt durch – dann greift die nächste Stufe,
 * nicht Stille.
 */
const MAENNERNAMEN = [
  'conrad',
  'stefan',
  'killian',
  'bernd',
  'christoph',
  'klaus',
  'markus',
  'martin',
  'viktor',
  'florian',
  'jonas',
  'hans',
  'ralf',
  'yannick',
  'andreas',
  'paul',
  'georg',
  'michael',
  'werner',
  'daniel',
  'felix',
  /* Apples sprachübergreifende Stimmen – die männlichen darunter. */
  'eddy',
  'reed',
  'rocko',
  'grandpa',
  /* Weitere deutsche Männernamen gängiger Sprachpakete. */
  'erik',
  'sven',
  'lars',
  'kai',
  'uwe',
  'wolfgang',
  'juergen',
  'jürgen',
  'dieter',
  'holger',
  'ingo',
  'rainer',
  'thomas',
  'torsten',
  'ulrich',
  'volker',
  'sebastian',
  'tobias',
  'matthias',
  'johannes',
]

/**
 * Kennzeichen der natürlich klingenden Stimmen.
 *
 * Die Systeme führen zwei Generationen nebeneinander: die alten Formant- und
 * Bausteinstimmen, die hörbar synthetisch sind, und die neuronalen, die wie
 * ein Mensch klingen. Auch das steht nirgends als Feld – nur im Namen:
 * Edge nennt sie „Online (Natural)“, Apple „Enhanced“ oder „Premium“,
 * Googles Netzstimmen heißen schlicht „Google …“.
 */
const NATUERLICH_KENNZEICHEN = [
  'natural',
  'neural',
  'premium',
  'enhanced',
  'erweitert',
  'google',
  'siri',
]

/** Ob Name oder Kennung nach einer neuronalen, natürlichen Stimme klingen. */
export function klingtNatuerlich(stimme: Stimmprofil): boolean {
  const kennung = `${stimme.name} ${stimme.voiceURI}`.toLowerCase()
  return NATUERLICH_KENNZEICHEN.some((wort) => kennung.includes(wort))
}

/**
 * Ob Name oder Kennung nach einer Männerstimme klingen.
 *
 * Die Namen werden als ganze Wörter verglichen, nicht als Teilzeichenkette.
 * Der Unterschied ist keine Feinheit: „Martina“, „Daniela“, „Michaela“ und
 * „Paula“ enthalten Männernamen als Teilwort – als Teilzeichenkette geprüft
 * hielte die Automatik ausgerechnet diese Frauenstimmen für männlich und
 * wählte sie mit Vorrang. So war es bis Juli 2026, und auf Geräten mit einer
 * solchen Stimme kam die gewünschte Männerstimme deshalb nie an.
 */
export function klingtMaennlich(stimme: Stimmprofil): boolean {
  const kennung = `${stimme.name} ${stimme.voiceURI}`.toLowerCase()
  /* „female“ enthält „male“ – die Reihenfolge der Prüfungen trägt die Logik. */
  if (kennung.includes('female')) return false
  if (kennung.includes('male')) return true
  const woerter = kennung.split(/[^a-zäöüß]+/)
  return MAENNERNAMEN.some((name) => woerter.includes(name))
}

/**
 * Die Voreinstellung „automatisch“: männlich zuerst, dabei natürlich vor lokal.
 *
 * Diese Rangfolge ist zweimal umgebaut worden, und beide Gründe gehören
 * festgehalten. Zuerst gewann die lokale Stimme (datensparsam) – aber die
 * lokalen sind die alten, hörbar synthetischen. Dann gewann die natürliche –
 * aber auf Geräten ohne natürliche Männerstimme hieß das eine Frauenstimme,
 * und gewünscht ist eine männliche. Jetzt gilt: erst das Geschlecht, dann
 * der Klang, dann die Datensparsamkeit. Die Kennzeichnung „(online)“ in der
 * Auswahl bleibt; wer anders gewichtet, wählt von Hand.
 *
 * `null` heißt: keine deutsche Stimme vorhanden; der Browser nimmt dann
 * seine Standardstimme mit deutscher Sprachangabe.
 */
export function bevorzugteStimme<T extends Stimmprofil>(stimmen: readonly T[]): T | null {
  const deutsche = stimmen.filter((stimme) => stimme.lang.toLowerCase().startsWith('de'))
  return (
    deutsche.find((stimme) => klingtNatuerlich(stimme) && klingtMaennlich(stimme)) ??
    deutsche.find((stimme) => stimme.localService && klingtMaennlich(stimme)) ??
    deutsche.find((stimme) => klingtMaennlich(stimme)) ??
    deutsche.find((stimme) => klingtNatuerlich(stimme)) ??
    deutsche.find((stimme) => stimme.localService) ??
    deutsche[0] ??
    null
  )
}

/**
 * Die Tonlage einer als männlich erkannten Stimme.
 *
 * Unter der Mitte, aber nicht weit darunter: Gewünscht ist eine tiefe Stimme,
 * und `pitch` erreicht sie nicht durch Übertreibung. Die Sprachausgabe
 * verschiebt beim Absenken den ganzen Spektralverlauf mit – unter etwa 0,75
 * klingt eine Männerstimme nicht tiefer, sondern verlangsamt und blechern.
 * Der Klang einer wirklich tiefen Stimme steckt in der Stimme selbst, nicht
 * in diesem Regler.
 */
export const TONLAGE_MAENNLICH = 0.8

/**
 * Die Tonlage, wenn keine Männerstimme zu finden war.
 *
 * Dann muss der Regler die Arbeit allein machen und geht deutlich weiter
 * herunter. Das Ergebnis ist hörbar künstlich – aber näher an dem, was
 * gewünscht ist, als eine unveränderte Frauenstimme.
 */
export const TONLAGE_ERSATZ = 0.7

/** Die Tonlage für eine Stimme; `null` heißt: keine Stimme zugeordnet. */
export function tonlageFuer(stimme: Stimmprofil | null): number {
  return stimme && klingtMaennlich(stimme) ? TONLAGE_MAENNLICH : TONLAGE_ERSATZ
}

export interface Stimmgruppen<T> {
  /** Was nach einer Männerstimme klingt – die erste ist die beste Wahl. */
  maennlich: T[]
  /** Alles Übrige, in derselben Ordnung. */
  weitere: T[]
}

/**
 * Teilt die Stimmen für die Auswahlliste in zwei Gruppen.
 *
 * ## Warum überhaupt gruppieren
 *
 * Die Automatik nimmt die beste Männerstimme, die sie findet. Erkennt sie eine
 * nicht – die Namensliste kann nicht vollständig sein –, muss von Hand gewählt
 * werden, und dann steht man vor einer Liste aus „Microsoft Katja“, „Hedda“,
 * „Stefan“, „Google Deutsch“ und rät. Die Gruppe „Männlich“ nimmt das Raten aus
 * dem häufigsten Fall heraus, ohne die anderen Stimmen zu verstecken.
 *
 * Innerhalb der Gruppen stehen die natürlich klingenden vorn: Wer die Stimme
 * von Hand wechselt, sucht fast immer eine, die weniger nach Ansage klingt.
 */
export function gruppiereStimmen<T extends Stimmprofil>(
  stimmen: readonly T[]
): Stimmgruppen<T> {
  const deutsche = stimmen.filter((stimme) => stimme.lang.toLowerCase().startsWith('de'))
  /* Kein Gerät ohne deutsche Stimme aussperren – dann eben alle. */
  const auswahl = deutsche.length > 0 ? deutsche : stimmen

  const sortiert = auswahl
    .slice()
    .sort((a, b) => Number(klingtNatuerlich(b)) - Number(klingtNatuerlich(a)))

  return {
    maennlich: sortiert.filter((stimme) => klingtMaennlich(stimme)),
    weitere: sortiert.filter((stimme) => !klingtMaennlich(stimme)),
  }
}
