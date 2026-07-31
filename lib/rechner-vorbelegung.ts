/**
 * Einen Rechner mit Werten aus einem Lerntext vorbelegen.
 *
 * ## Wofür
 *
 * Weil eine Formel im Text und ein leerer Rechner zwei getrennte Dinge sind.
 * Wer im Zinseszins-Kapitel liest, was aus 5.000 Euro bei sechs Prozent über
 * fünfundzwanzig Jahre wird, und dann auf „Zinsrechner“ klickt, findet dort
 * die Voreinstellungen des Rechners – und muss die drei Zahlen abtippen, die
 * er gerade gelesen hat. Die meisten tun das nicht.
 *
 * Ein Verweis mit den Zahlen darin schließt die Lücke: Der Rechner öffnet mit
 * genau dem Beispiel aus dem Text, und wer daran weiterdreht, dreht an etwas,
 * das er verstanden hat.
 *
 * ## Warum die Raute und kein Abfrageparameter
 *
 * Dieselbe Entscheidung wie beim Globus, und aus demselben Grund: Diese Website
 * wird statisch ausgeliefert. `useSearchParams` verlangt in Next.js eine
 * Suspense-Grenze und macht die Seite zur Laufzeitsache; die Raute liest der
 * Browser ohne Zutun und sie überlebt jede Art von Hosting.
 *
 * Sie hat noch einen zweiten Vorteil, der hier wiegt: Eine Raute geht nicht an
 * den Server. Was jemand in einem Rechner ausprobiert, steht damit in keinem
 * Zugriffsprotokoll – und in einem Rentenrechner stehen Zahlen, die niemanden
 * etwas angehen.
 *
 * ## Warum jeder Wert begrenzt wird
 *
 * Weil die Adresse von außen kommt. `#jahre=1e9` würde eine Schleife über eine
 * Milliarde Jahre starten und den Browserstrang blockieren; `#kurs=abc` ergäbe
 * `NaN`, und `NaN` breitet sich durch jede Rechnung aus, bis irgendwo „–“
 * steht, ohne dass jemand sagen könnte, warum. Beides wird hier abgefangen,
 * statt in fünf Rechnern einzeln.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 */

export interface Zahlengrenzen {
  min: number
  max: number
  /** Auf ganze Zahlen runden – bei Jahren und Laufzeiten. */
  ganzzahl?: boolean
}

/**
 * Zerlegt die Raute in Schlüssel-Wert-Paare.
 *
 * Nimmt sie mit oder ohne führendes `#` entgegen. Unbekanntes wird nicht
 * beanstandet, sondern weitergereicht – die Rechner nehmen sich, was sie
 * kennen, und ignorieren den Rest. Eine Adresse, die einen Wert für ein Feld
 * mitbringt, das dieser Rechner nicht hat, ist kein Fehler, sondern ein
 * Verweis aus einer älteren Fassung.
 */
export function leseRaute(raute: string): Record<string, string> {
  const roh = raute.startsWith('#') ? raute.slice(1) : raute
  const werte: Record<string, string> = {}
  if (roh === '') return werte

  for (const paar of roh.split('&')) {
    const trenner = paar.indexOf('=')
    if (trenner <= 0) continue
    const schluessel = paar.slice(0, trenner)
    try {
      werte[decodeURIComponent(schluessel)] = decodeURIComponent(paar.slice(trenner + 1))
    } catch {
      /*
        Eine kaputte Prozentfolge wirft. Sie zu überspringen ist richtig: Der
        Rest der Adresse kann in Ordnung sein, und ein einzelnes verunglücktes
        Zeichen soll nicht die ganze Vorbelegung verwerfen.
      */
      continue
    }
  }
  return werte
}

/**
 * Eine Zahl aus der Adresse – die Vorgabe bei allem, was keine ist.
 *
 * Werte außerhalb der Grenzen werden **beschnitten**, nicht verworfen. Wer
 * `#jahre=99` schreibt und 50 bekommt, sieht seinen Wunsch gedeckelt; wer die
 * Voreinstellung zurückbekäme, sähe eine Zahl, die er nirgends genannt hat.
 */
export function leseZahl(
  roh: string | undefined,
  vorgabe: number,
  grenzen: Zahlengrenzen
): number {
  if (roh === undefined || roh.trim() === '') return vorgabe
  /*
    Komma als Dezimaltrennzeichen zulassen. Wer eine Adresse von Hand
    zusammensetzt, schreibt „5,5“ – und `Number('5,5')` ist `NaN`.
  */
  const zahl = Number(roh.trim().replace(',', '.'))
  if (!Number.isFinite(zahl)) return vorgabe
  const beschnitten = Math.min(grenzen.max, Math.max(grenzen.min, zahl))
  return grenzen.ganzzahl ? Math.round(beschnitten) : beschnitten
}

/** Eine Auswahl aus einer festen Liste – die Vorgabe bei allem anderen. */
export function leseAuswahl<T extends string>(
  roh: string | undefined,
  vorgabe: T,
  erlaubt: readonly T[]
): T {
  return erlaubt.includes(roh as T) ? (roh as T) : vorgabe
}

/**
 * Baut den Verweis, der einen Rechner vorbelegt.
 *
 * Beispiel: `rechnerlink('/rechner/zinsrechner', { start: 5000, zins: 6 })`
 * ergibt `/rechner/zinsrechner#start=5000&zins=6`.
 */
export function rechnerlink(
  pfad: string,
  werte: Record<string, string | number>
): string {
  const teile = Object.entries(werte)
    .filter(([, wert]) => wert !== '' && wert !== undefined && wert !== null)
    .map(
      ([schluessel, wert]) =>
        `${encodeURIComponent(schluessel)}=${encodeURIComponent(String(wert))}`
    )
  return teile.length === 0 ? pfad : `${pfad}#${teile.join('&')}`
}
