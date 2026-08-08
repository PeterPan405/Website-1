import { edition as edition20260725 } from './2026-07-25'
import { edition as edition20260727 } from './2026-07-27'
import { edition as edition20260728 } from './2026-07-28'
import { edition as edition20260729 } from './2026-07-29'
import { edition as edition20260730 } from './2026-07-30'
import { edition as edition20260731 } from './2026-07-31'
import { edition as edition20260801 } from './2026-08-01'
import { edition as edition20260802 } from './2026-08-02'
import { edition as edition20260803 } from './2026-08-03'
import { edition as edition20260804 } from './2026-08-04'
import { edition as edition20260805 } from './2026-08-05'
import type { DailyEdition } from './types'

export type { DailyEdition, EditionItem } from './types'
import { edition as edition20260806 } from './2026-08-06'
import { edition as edition20260807 } from './2026-08-07'
import { edition as edition20260808 } from './2026-08-08'

/**
 * Alle veröffentlichten Tagesausgaben.
 *
 * Bewusst eine ausgeschriebene Liste mit statischen Importen und kein Einlesen
 * des Ordners zur Laufzeit: Nur so kennt der Compiler jede Ausgabe, kann sie
 * prüfen und der Build sie vorrendern. Ein `readdir` würde beides verhindern und
 * beim statischen Export gar nicht funktionieren.
 *
 * Eine neue Ausgabe erfordert damit zwei Schritte – die Datei anlegen und sie
 * hier eintragen. Der Test unter `tests/editions.test.ts` prüft, dass keine
 * Ausgabe im Ordner liegt, die hier fehlt; ein vergessener Eintrag fällt also
 * auf, statt still zu verschwinden.
 */
export const editions: DailyEdition[] = [
  edition20260808,
  edition20260807,
  edition20260806,
  edition20260725,
  edition20260727,
  edition20260728,
  edition20260729,
  edition20260731,
  edition20260801,
  edition20260802,
  edition20260803,
  edition20260804,
  edition20260805,
  edition20260730,
]
