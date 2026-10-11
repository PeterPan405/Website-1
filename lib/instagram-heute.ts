import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { editions } from '@/data/editions'
import { type Tagesstand, tagesstand } from '@/lib/instagram-plan'

/**
 * Der Instagram-Stand der jüngsten Ausgabe – für die drei Routen unter
 * `app/instagram/`.
 *
 * Gefragt wird die **jüngste Ausgabe**, nicht die Uhr: Die Kacheln entstehen
 * beim Bau, und der Bau zeigt, was die Website zeigt. Welcher Tag das ist,
 * steht in `/instagram/stand.txt`; der Veröffentlichungslauf vergleicht ihn
 * mit dem Stichtag, bevor er etwas tut.
 */
export function instagramHeute(): Tagesstand | null {
  const juengste = [...editions].sort((a, b) => b.date.localeCompare(a.date))[0]
  if (!juengste) return null
  const pfad = join(process.cwd(), 'data/instagram', `${juengste.date}.json`)
  return tagesstand(juengste.date, existsSync(pfad) ? readFileSync(pfad, 'utf8') : null)
}
