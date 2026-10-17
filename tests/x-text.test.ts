/**
 * X (Twitter): Texte und Anmeldung.
 *
 * Ausführen mit `npm test`. Anlass und Form in `lib/x-text.ts` und
 * `lib/x-oauth.ts`; eingerichtet wird das Konto nach `werkzeuge/x-einrichten.md`.
 */
import { readdirSync, readFileSync } from 'node:fs'

import { zahlenkarten } from '@/data/instagram-zahlenkarten'
import { pruefeInstagramPlan, type InstagramPlan } from '@/lib/instagram-plan'
import { kodiere, oauthKopf } from '@/lib/x-oauth'
import { X_HINWEIS, X_MAX, xLaenge, xTagesnews, xZahlenkarte } from '@/lib/x-text'

let failed = 0
function pruefe(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) console.log(`OK   ${was}`)
  else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/*
  Die Signatur, nachgerechnet am Beispiel aus der X-Dokumentation
  („Creating a signature", developer.x.com) – Schlüssel, Nonce, Zeit und
  Ergebnis von dort. Diese Umgebung erreicht X nicht; ohne diesen Test
  zeigte sich ein Fehler erst beim ersten echten Lauf als 401.
*/
const kopf = oauthKopf(
  'POST',
  'https://api.twitter.com/1.1/statuses/update.json?include_entities=true',
  {
    key: 'xvz1evFS4wEEPTGEFPHBog',
    secret: 'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw',
    token: '370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb',
    tokenSecret: 'LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE',
  },
  { status: 'Hello Ladies + Gentlemen, a signed OAuth request!' },
  'kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg',
  1318622958
)
pruefe(
  'OAuth: Signatur wie im Beispiel der X-Dokumentation',
  kopf.includes(`oauth_signature="${kodiere('hCtSmYh+iHYCEqBWrE7C7hYmtUk=')}"`),
  kopf
)
pruefe('Kodierung nach RFC 3986', kodiere("a b!*'()") === 'a%20b%21%2A%27%28%29')

pruefe('ein Emoji zählt doppelt', xLaenge('📈a') === 3)
pruefe('ein Umlaut einfach', xLaenge('Öl') === 2)

/* Jeder Plan und jede Karte im Bestand passt in einen Post. */
const ohneLink = (t: string) => !/https?:|www\.|iminvests\.de|\.de\b/.test(t)
for (const datei of readdirSync('data/instagram').filter((d) => d.endsWith('.json'))) {
  const plan = JSON.parse(
    readFileSync(`data/instagram/${datei}`, 'utf8')
  ) as InstagramPlan
  if (pruefeInstagramPlan(plan).length > 0) continue
  const datum = datei.slice(0, 10)
  const x = xTagesnews(datum, plan)
  pruefe(
    `Tagesnews ${datum}: ${xLaenge(x.haupt)} Zeichen, höchstens ${X_MAX}`,
    xLaenge(x.haupt) <= X_MAX && xLaenge(x.antwort) <= X_MAX
  )
  pruefe(
    `Tagesnews ${datum}: KI-Hinweis, kein Link`,
    x.haupt.includes(X_HINWEIS) && ohneLink(x.haupt) && ohneLink(x.antwort)
  )
  pruefe(
    `Tagesnews ${datum}: alle fünf Überschriften, vier plus zwei Bilder`,
    plan.kacheln.every((k) => x.haupt.includes(k.titel)) &&
      x.bilder.haupt.length === 4 &&
      x.bilder.antwort.length === 2
  )
}
for (const k of zahlenkarten) {
  const t = xZahlenkarte(k)
  pruefe(
    `Zahlenkarte ${k.datum}: ${xLaenge(t)} Zeichen, höchstens ${X_MAX}`,
    xLaenge(t) <= X_MAX,
    t
  )
  pruefe(
    `Zahlenkarte ${k.datum}: Überschrift, Quelle, KI-Hinweis, kein Link`,
    t.startsWith(k.titel[0].text) &&
      t.includes(k.fusszeile) &&
      t.includes(X_HINWEIS) &&
      ohneLink(t),
    t
  )
}

/* Die Kürzung muss greifen: ein Satz, der nicht passt, fällt weg. */
const lang = {
  ...zahlenkarten[0],
  text: `${'Sehr langer Satz '.repeat(20)}ohne Ende.\nQuellen: Beispiel`,
}
const gekuerzt = xZahlenkarte(lang)
pruefe(
  'ein zu langer erster Satz fällt weg, Pflichtteile bleiben',
  xLaenge(gekuerzt) <= X_MAX &&
    !gekuerzt.includes('Sehr langer') &&
    gekuerzt.includes(X_HINWEIS),
  gekuerzt
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
