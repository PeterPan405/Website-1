/**
 * Einmalige Anmeldung bei YouTube – läuft auf dem eigenen Rechner.
 *
 * ## Was hier passiert
 *
 * Google vergibt Zugriffe über OAuth. Für Geräte ohne Browser gibt es den
 * Geräte-Fluss: Dieses Skript holt einen kurzen Code, man gibt ihn unter
 * google.com/device ein und bestätigt – danach druckt das Skript den
 * **Refresh-Token**. Der wandert als Secret ins Repository und erlaubt dem
 * Läufer, dauerhaft Videos hochzuladen, ohne je ein Passwort zu kennen.
 *
 * ## Vorher einmalig anlegen (fünf Minuten, console.cloud.google.com)
 *
 * 1. Projekt anlegen (Name egal), „YouTube Data API v3“ aktivieren.
 * 2. OAuth-Zustimmungsbildschirm: extern, nur die eigene E-Mail als Testnutzer.
 * 3. Anmeldedaten → OAuth-Client-ID → Typ **„Fernseher und Geräte mit
 *    eingeschränkter Eingabe“**. Client-ID und Client-Secret notieren.
 *
 * ## Aufruf
 *
 *     node scripts/youtube-anmelden.mjs CLIENT_ID CLIENT_SECRET
 *
 * Danach bei GitHub unter Settings → Secrets and variables → Actions:
 *     YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN
 */

const [clientId, clientSecret] = process.argv.slice(2)
if (!clientId || !clientSecret) {
  console.error('Aufruf: node scripts/youtube-anmelden.mjs CLIENT_ID CLIENT_SECRET')
  process.exit(1)
}

const SCOPE = 'https://www.googleapis.com/auth/youtube'

const geraet = await (
  await fetch('https://oauth2.googleapis.com/device/code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, scope: SCOPE }),
  })
).json()

if (!geraet.device_code) {
  console.error('Google hat den Geräte-Code verweigert:', JSON.stringify(geraet))
  process.exit(1)
}

console.log('\n1. Öffne im Browser:  ', geraet.verification_url)
console.log('2. Gib diesen Code ein:', geraet.user_code)
console.log('\nWarte auf die Bestätigung …')

const frist = Date.now() + geraet.expires_in * 1000
let wartezeit = (geraet.interval || 5) * 1000

while (Date.now() < frist) {
  await new Promise((weiter) => setTimeout(weiter, wartezeit))
  const antwort = await (
    await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        device_code: geraet.device_code,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
      }),
    })
  ).json()

  if (antwort.refresh_token) {
    console.log('\nAngemeldet. Bei GitHub als Secrets hinterlegen:\n')
    console.log('  YT_CLIENT_ID      =', clientId)
    console.log('  YT_CLIENT_SECRET  =', clientSecret)
    console.log('  YT_REFRESH_TOKEN  =', antwort.refresh_token)
    console.log('\nDen Token nirgendwo sonst ablegen – er ist der Schlüssel zum Kanal.')
    process.exit(0)
  }
  if (antwort.error === 'authorization_pending') continue
  if (antwort.error === 'slow_down') {
    wartezeit += 5000
    continue
  }
  console.error('Fehlgeschlagen:', JSON.stringify(antwort))
  process.exit(1)
}

console.error('Der Code ist abgelaufen – Skript einfach erneut starten.')
process.exit(1)
