import type { Lernpfad } from '@/data/learn/pfade'

/**
 * Prüft die Lernpfade beim Bauen.
 *
 * ## Warum das abbricht statt zu warnen
 *
 * Ein Pfad besteht ausschließlich aus Verweisen. Er hat keinen eigenen Inhalt,
 * der fehlen könnte – er kann nur auf etwas zeigen, das es nicht gibt. Ein
 * Tippfehler im Themenslug erzeugt keinen Fehler beim Bauen, sondern eine Seite
 * mit einem Link, der ins Leere führt, und das fällt beim Ansehen nicht auf:
 * Der Schritt sieht aus wie alle anderen.
 *
 * Dieselbe Stelle betrifft die Stufen. `etf/profi` gibt es, `etf/experte`
 * nicht – beides sieht in der Datei gleich aus.
 *
 * ## Was sonst noch geprüft wird
 *
 * Doppelte Schritte innerhalb eines Pfades. Sie entstehen beim Umsortieren und
 * sind für sich harmlos, machen den Pfad aber unglaubwürdig: Wer zweimal
 * dieselbe Seite geschickt bekommt, hört auf, der Reihenfolge zu vertrauen.
 *
 * Und die Länge. Ein Pfad mit drei Schritten ist keine Führung, sondern eine
 * Linkliste; einer mit zwanzig ist der Lernbereich mit anderer Überschrift.
 */

/** Ein Pfad unter dieser Zahl an Schritten ist keine Führung mehr. */
const SCHRITTE_MIN = 5

/** Darüber ist es keine Auswahl mehr, sondern wieder die Gesamtliste. */
const SCHRITTE_MAX = 16

/** Zielkorridor für die Meta-Description, damit sie nicht abgeschnitten wird. */
const BESCHREIBUNG_MIN = 70
const BESCHREIBUNG_MAX = 160

/** Ab dieser Länge schneidet die Suchmaschine den Titel ab. */
const TITEL_MAX = 60

export interface Bekannt {
  /** Alle vorhandenen Themenslugs. */
  themen: Set<string>
  /** Alle gültigen Stufenkennungen. */
  stufen: Set<string>
  /** Alle vorhandenen Rechnerslugs. */
  rechner: Set<string>
}

export function validiereLernpfade(pfade: Lernpfad[], bekannt: Bekannt): void {
  const fehler: string[] = []
  const slugs = new Set<string>()

  for (const pfad of pfade) {
    const wo = `Lernpfad ${pfad.slug}`

    if (slugs.has(pfad.slug)) fehler.push(`${wo}: Slug kommt zweimal vor`)
    slugs.add(pfad.slug)

    if (!/^[a-z0-9-]+$/.test(pfad.slug)) {
      fehler.push(
        `${wo}: Slug enthält Zeichen außer Kleinbuchstaben, Ziffern und Bindestrich`
      )
    }

    if (pfad.metaTitle.length > TITEL_MAX) {
      fehler.push(
        `${wo}: metaTitle ist ${pfad.metaTitle.length} Zeichen lang, erlaubt sind ${TITEL_MAX}`
      )
    }
    if (
      pfad.metaDescription.length < BESCHREIBUNG_MIN ||
      pfad.metaDescription.length > BESCHREIBUNG_MAX
    ) {
      fehler.push(
        `${wo}: metaDescription ist ${pfad.metaDescription.length} Zeichen lang, erlaubt sind ${BESCHREIBUNG_MIN} bis ${BESCHREIBUNG_MAX}`
      )
    }

    for (const [feld, wert] of Object.entries({
      titel: pfad.titel,
      headline: pfad.headline,
      kurz: pfad.kurz,
      lead: pfad.lead,
      fuerWen: pfad.fuerWen,
      ergebnis: pfad.ergebnis,
    })) {
      if (wert.trim().length === 0) fehler.push(`${wo}: ${feld} ist leer`)
    }

    if (pfad.schritte.length < SCHRITTE_MIN || pfad.schritte.length > SCHRITTE_MAX) {
      fehler.push(
        `${wo}: hat ${pfad.schritte.length} Schritte, erlaubt sind ${SCHRITTE_MIN} bis ${SCHRITTE_MAX}`
      )
    }

    const gesehen = new Set<string>()
    pfad.schritte.forEach((schritt, index) => {
      const stelle = `${wo}, Schritt ${index + 1}`

      if (schritt.warum.trim().length === 0) {
        fehler.push(
          `${stelle}: ohne Begründung – genau die unterscheidet einen Pfad von einer Liste`
        )
      }

      const kennung =
        schritt.art === 'stufe'
          ? `stufe:${schritt.thema}/${schritt.stufe}`
          : `rechner:${schritt.rechner}`

      if (gesehen.has(kennung))
        fehler.push(`${stelle}: ${kennung} steht schon weiter oben`)
      gesehen.add(kennung)

      if (schritt.art === 'stufe') {
        if (!bekannt.themen.has(schritt.thema)) {
          fehler.push(`${stelle}: Thema „${schritt.thema}“ gibt es nicht`)
        }
        if (!bekannt.stufen.has(schritt.stufe)) {
          fehler.push(`${stelle}: Stufe „${schritt.stufe}“ gibt es nicht`)
        }
      } else if (!bekannt.rechner.has(schritt.rechner)) {
        fehler.push(`${stelle}: Rechner „${schritt.rechner}“ gibt es nicht`)
      }
    })
  }

  if (fehler.length > 0) {
    throw new Error(`Lernpfade fehlerhaft:\n– ${fehler.join('\n– ')}`)
  }
}
