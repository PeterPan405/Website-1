/**
 * Ermittelt die Basis-URL der Website aus der Umgebungsvariablen.
 *
 * Eigenes Modul ohne Importe, damit sich die Regeln unter `tests/` direkt prüfen
 * lassen. Der Anlass war ein Fehler, den erst der Server-Build sichtbar gemacht
 * hat: Ist eine GitHub-Variable nicht gesetzt, übergibt der Workflow sie als
 * **leeren String** statt sie wegzulassen. Ein leerer String ist weder `null`
 * noch `undefined`, weshalb `??` nicht greift – die Basis-URL wurde zu `''` und
 * `new URL('')` brach den Build mit einer schwer deutbaren Meldung ab.
 *
 * Deshalb gilt hier: Leer oder nur Leerzeichen zählt als „nicht gesetzt“.
 */

/**
 * Basis-URL, wenn keine Umgebungsvariable gesetzt ist.
 *
 * Das ist die echte Domain der Website und nicht mehr ein Platzhalter mit
 * reservierter `.example`-TLD. Die Umstellung hat einen konkreten Grund:
 *
 * Der Platzhalter sollte verhindern, dass versehentlich eine *fremde* Domain
 * als canonical-URL ausgeliefert wird. Für die eigene Domain leistet er das
 * nicht – er sorgte im Gegenteil dafür, dass die Website live mit Adressen
 * unter `im-invests.example` ausgeliefert wurde, sobald die Variable in der
 * Build-Umgebung fehlte. Das ist zweimal an einem Tag passiert: einmal, weil
 * sie nie gesetzt war, und einmal, weil sie beim Neuanlegen der Website beim
 * Hoster verlorenging.
 *
 * Der Fehler ist besonders tückisch, weil er im Browser unsichtbar ist. Die
 * Seite sieht fehlerfrei aus, während jedes canonical-Tag, die Sitemap,
 * robots.txt und alle Open-Graph-Angaben auf eine Domain zeigen, die es nicht
 * gibt.
 *
 * Ein Projekt mit genau einer Domain gewinnt durch diese Indirektion nichts.
 * Steht der richtige Wert hier, ist er immer richtig – auch in einer
 * Build-Umgebung, die niemand konfiguriert hat.
 *
 * `NEXT_PUBLIC_SITE_URL` überschreibt ihn weiterhin, etwa für eine
 * Vorschau-Umgebung unter anderer Adresse.
 */
export const FALLBACK_SITE_URL = 'https://iminvests.de'

export function resolveSiteUrl(raw: string | undefined): string {
  const candidate = raw?.trim()
  const value = candidate ? candidate : FALLBACK_SITE_URL

  // Ohne Schema wäre der Wert keine absolute URL – und genau das braucht die
  // Metadata-API von Next.js. Lieber hier mit klarer Ansage abbrechen als
  // später mit „Invalid URL“ irgendwo im Build.
  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL ist keine gültige URL: „${value}“. ` +
        'Erwartet wird eine absolute Adresse mit Schema, z. B. https://www.im-invests.de'
    )
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL muss http oder https verwenden, nicht „${parsed.protocol}“.`
    )
  }

  // Ohne abschließenden Schrägstrich, weil die Pfade in `absoluteUrl()` mit
  // einem beginnen – sonst entstünden doppelte Schrägstriche in jeder URL.
  return value.replace(/\/+$/, '')
}
