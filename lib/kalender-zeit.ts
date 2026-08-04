import type { Termin } from '@/data/kalender/typen'

/**
 * Die zeitliche Einordnung eines Termins – ohne jeden Datenimport.
 *
 * Eigenes Modul, weil die Client-Komponente diese Funktionen braucht und
 * `lib/kalender.ts` den vollständigen Terminbestand samt Quartals- und
 * Dividendenterminen lädt. Der gehört nicht in das Bündel für den Browser.
 */

/** Ein Termin, soweit für die zeitliche Einordnung nötig. */
type Zeitraum = Pick<Termin, 'datum' | 'bis'>

/**
 * Drei Zustände, nicht zwei.
 *
 * ## Warum das nötig wurde
 *
 * Am 1. August 2026 stand der Kalender auf dem Telefon mit der Überschrift
 * „Juli 2026“ und darunter „um den 30. Jul.“ – zwei Tage alt und als kommender
 * Termin ausgewiesen. Das sah nach einem stehengebliebenen Kalender aus, war
 * aber keiner: Drei Unternehmen hatten dort einen **Zeitraum** vom 30. Juli bis
 * zum 5. August, weil geschätzte Meldetermine damals als Fenster aus erwartetem
 * Tag plus Streuung ausgewiesen wurden. Der Zeitraum lief noch, nur sein Anfang
 * lag hinter uns.
 *
 * Die geschätzten Meldetermine tragen seit dem 4. August 2026 keinen Zeitraum
 * mehr – sie stehen auf ihrem erwarteten Tag, die Streuung steht als Satz
 * daneben (siehe `lib/quartalstermine.ts`). Diese Unterscheidung bleibt
 * trotzdem nötig: Notenbanksitzungen und Verfallswochen in
 * `data/kalender/termine.ts` sind **echte** Zeiträume über mehrere Tage, und
 * für die gilt jedes Wort hier unverändert.
 *
 * Die Ansicht kannte bis dahin nur „kommend“ und „vorbei“ und sortierte alles
 * nach dem Anfangstag. Ein laufender Zeitraum fiel damit in den Vormonat und
 * erschien dort ganz oben – an der auffälligsten Stelle der Seite.
 *
 * Diese Funktionen trennen deshalb sauber:
 *
 * - **kommend** – der Anfang liegt in der Zukunft.
 * - **laufend** – der Anfang ist vorbei, das Ende noch nicht.
 * - **vorbei** – auch das Ende ist vorbei.
 *
 * `heute` kommt in allen dreien von außen und ist im Server `null`. Das ist
 * kein Schönheitsfehler, sondern der Grund, warum die Seite statisch sein darf:
 * Der Server liefert die vollständige Liste, das Datum steuert erst der
 * Browser bei.
 */
export function laeuftNoch(termin: Zeitraum, heute: string | null): boolean {
  if (!heute || !termin.bis) return false
  return termin.datum < heute && termin.bis >= heute
}

/** Vorbei ist ein Termin erst, wenn auch das Ende seines Zeitraums vorbei ist. */
export function istVorbei(termin: Zeitraum, heute: string | null): boolean {
  if (!heute) return false
  return (termin.bis ?? termin.datum) < heute
}

/**
 * Unter welcher Monatsüberschrift ein Termin heute steht.
 *
 * Ein laufender Zeitraum gehört in den laufenden Monat – sonst steht der
 * Kalender im August auf „Juli“. Alles andere behält seinen Anfangsmonat, auch
 * wenn es weit in den nächsten hineinreicht: Ein Termin, der erst beginnt, ist
 * dort richtig aufgehoben, wo man ihn sucht.
 */
export function anzeigemonat(termin: Zeitraum, heute: string | null): string {
  if (heute && laeuftNoch(termin, heute)) return heute.slice(0, 7)
  return termin.datum.slice(0, 7)
}
