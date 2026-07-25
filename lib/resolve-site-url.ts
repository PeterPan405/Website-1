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
 * Fallback für lokale Entwicklung und Vorschauen.
 *
 * Bewusst die reservierte `.example`-TLD: So kann selbst bei einem Fehler
 * niemals versehentlich eine fremde, echte Domain als canonical-URL im HTML
 * landen.
 */
export const FALLBACK_SITE_URL = 'https://www.im-invests.example'

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
