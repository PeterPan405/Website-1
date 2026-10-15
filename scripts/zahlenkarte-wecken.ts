/**
 * Fragt für den Dauerlauf, ob die Zahlenkarte jetzt hinaus soll.
 *
 * Ausgabe für die Schleife in `kurse-dauerlauf.yml`:
 *
 *     ANSTOSS=1|0
 *     GRUND=…
 *
 * Die Entscheidung trifft `lib/zahlenkarten-wecker.ts`. Gefragt wird die
 * Website von **jetzt** – sie trägt Karte und Freigabe aus demselben Bau wie
 * das Bild, das Meta holen wird. Antwortet sie nicht, wird nicht angestoßen;
 * in zehn Minuten fragt die Schleife wieder.
 */
import {
  berlinJetzt,
  leseZahlenkarteText,
  sollZahlenkarteAnstossen,
} from '../lib/zahlenkarten-wecker.ts'

const BASIS = (process.env.NEXT_PUBLIC_SITE_URL || 'https://iminvests.de').replace(
  /\/+$/,
  ''
)
const { tag, minute } = berlinJetzt(new Date())

let text = ''
try {
  const antwort = await fetch(`${BASIS}/instagram/zahlenkarte.txt?t=${Date.now()}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  })
  if (antwort.ok) text = await antwort.text()
} catch {
  // bleibt leer – dann zeigt die Website „keine Karte von heute"
}

const { datum, freigabe } = leseZahlenkarteText(text)
const e = sollZahlenkarteAnstossen({
  tag,
  minute,
  datum,
  freigabe,
  angestossenAm: (process.env.ZK_ANGESTOSSEN_AM ?? '').trim(),
})
console.log(`ANSTOSS=${e.anstossen ? 1 : 0}`)
console.log(`GRUND=${text ? e.grund : 'zahlenkarte.txt nicht lesbar'}`)
