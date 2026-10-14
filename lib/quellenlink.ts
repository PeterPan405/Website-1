/**
 * Ist eine Quellenangabe ein direkter Link – oder nur die Übersichtsseite?
 *
 * Geprüft vom Entwurfsriegel in `scripts/nachrichten-erzeugen.ts`. Test:
 * `tests/quellenlink.test.ts`.
 *
 * ## Der Anlass
 *
 * Das Briefing des Betreibers vom 14. Oktober 2026 verlangt die Quellen „mit
 * direkten Links zu den jeweiligen Artikeln oder Originalmeldungen". Am
 * selben Tag nachgezählt: **819 von 1.078** Quellenlinks der Website zeigten
 * auf eine Übersicht – 317-mal `wallstreet-online.de/nachrichten`, 241-mal
 * `finanzen.net/nachrichten/`, 161-mal `onvista.de/news/`. Wer dort
 * nachsehen wollte, fand die Meldung schon am nächsten Tag nicht mehr.
 *
 * Die Ursache lag nicht beim Agenten: Der Sammler warf jeden Link weg, bevor
 * die Quellendatei entstand (`scripts/quellentext.py`). Seit er sie behält,
 * ist ein direkter Link immer erreichbar – und diese Prüfung fair.
 */

import { nachrichtenquellen } from '../data/nachrichtenquellen.ts'

/** Ohne Schema-Unterschied, Großschreibung im Host und Schrägstrich am Ende. */
function normal(adresse: string): string {
  const u = new URL(adresse)
  return `${u.hostname.toLowerCase().replace(/^www\./, '')}${u.pathname.replace(/\/+$/, '')}${u.search}`
}

/*
  Jede Adresse aus der gepflegten Liste ist per Definition eine Übersicht:
  `data/nachrichtenquellen.ts` sagt selbst, dass dort „Rubrik- und
  Übersichtsseiten" stehen, keine Artikel. Damit fällt auch eine tiefe
  Übersicht wie `bundesbank.de/de/presse/pressenotizen` (drei Pfadteile)
  heraus, die an der Pfadlänge allein vorbeikäme.
*/
const UEBERSICHTEN = new Set(
  nachrichtenquellen.flatMap((r) =>
    r.quellen.map((q) => normal(q.adresse.replaceAll('{jahr}', '2026')))
  )
)

/** Gibt den Grund zurück, warum `adresse` kein direkter Link ist – oder nichts. */
export function keinDirekterLink(adresse: string): string | null {
  let u: URL
  try {
    u = new URL(adresse)
  } catch {
    return 'keine gültige Adresse'
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return 'keine Webadresse'
  if (UEBERSICHTEN.has(normal(adresse)))
    return 'eine Übersichtsseite aus der Quellenliste'
  if (u.pathname.split('/').filter(Boolean).length < 2)
    return 'eine Start- oder Rubrikseite'
  return null
}
