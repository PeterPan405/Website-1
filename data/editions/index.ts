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
import { edition as edition20260809 } from './2026-08-09'
import { edition as edition20260810 } from './2026-08-10'
import { edition as edition20260811 } from './2026-08-11'
import { edition as edition20260812 } from './2026-08-12'
import { edition as edition20260813 } from './2026-08-13'
import { edition as edition20260814 } from './2026-08-14'
import { edition as edition20260815 } from './2026-08-15'
import { edition as edition20260816 } from './2026-08-16'
import { edition as edition20260817 } from './2026-08-17'
import { edition as edition20260818 } from './2026-08-18'
import { edition as edition20260819 } from './2026-08-19'
import { edition as edition20260820 } from './2026-08-20'
import { edition as edition20260821 } from './2026-08-21'
import { edition as edition20260822 } from './2026-08-22'
import { edition as edition20260823 } from './2026-08-23'
import { edition as edition20260824 } from './2026-08-24'
import { edition as edition20260825 } from './2026-08-25'
import { edition as edition20260827 } from './2026-08-27'
import { edition as edition20260826 } from './2026-08-26'
import { edition as edition20260828 } from './2026-08-28'
import { edition as edition20260829 } from './2026-08-29'
import { edition as edition20260830 } from './2026-08-30'
import { edition as edition20260831 } from './2026-08-31'
import { edition as edition20260901 } from './2026-09-01'

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
  edition20260901,
  edition20260831,
  edition20260830,
  edition20260829,
  edition20260828,
  edition20260827,
  edition20260826,
  edition20260825,
  edition20260824,
  edition20260823,
  edition20260822,
  edition20260821,
  edition20260820,
  edition20260819,
  edition20260818,
  edition20260817,
  edition20260816,
  edition20260815,
  edition20260814,
  edition20260813,
  edition20260812,
  edition20260811,
  edition20260810,
  edition20260809,
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
