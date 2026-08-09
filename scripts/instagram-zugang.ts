/**
 * Prüft, ob die Verbindung zu Instagram steht – und ändert nichts.
 *
 * ## Warum das der erste Schritt ist
 *
 * Beim Podcast hat sich dieselbe Frage einmal zu spät gestellt. Aus dem Kopf
 * von `scripts/podcast-youtube.ts`:
 *
 *   „Sonst stellt sich erst am ersten echten Morgen heraus, ob Schlüssel und
 *   Token stimmen – und dann fehlt die Folge."
 *
 * Die Einrichtung bei Meta hat vier Stellen, an denen etwas schieflaufen
 * kann: Kontoart, Verknüpfung zur Facebook-Seite, Berechtigungen der App,
 * Gültigkeit des Tokens. Ein Fehler an jeder einzelnen sieht von außen gleich
 * aus – es passiert nichts. Dieser Lauf sagt, **welche** der vier klemmt.
 *
 * ## Was geprüft wird
 *
 * 1. Antwortet das Token überhaupt? (`/me`)
 * 2. Gehört die angegebene Kennung zu einem Instagram-Profikonto, und wie
 *    heißt es? Das ist die eigentliche Probe: Stimmt der Name mit dem
 *    erwarteten überein, ist die Verbindung nachweislich die richtige.
 * 3. Wie lange gilt das Token noch? Ein langlebiges Token hält 60 Tage.
 *    Läuft es ab, bleibt der Beitrag eines Morgens einfach aus – der stille
 *    Fehler, den dieses Projekt an allen Ecken abzuschaffen versucht.
 * 4. Liegt ein Pexels-Schlüssel für die Titelbilder bereit?
 *
 * ## Was **nicht** passiert
 *
 * Es wird nichts veröffentlicht, nichts gelöscht, nichts geändert. Der Lauf
 * liest ausschließlich.
 *
 * Aufruf: npm run instazugang
 */

/** Das Konto, zu dem die Verbindung führen soll. */
const ERWARTET = 'im_invests'

/** Die Fassung der Graph API. Eine feste Zahl, kein `latest`: Meta ändert
 *  das Verhalten zwischen Fassungen, und eine stillschweigend gewanderte
 *  Schnittstelle ist schlimmer als eine veraltete. */
const API = 'https://graph.facebook.com/v21.0'

const TOKEN = process.env.IG_ACCESS_TOKEN?.trim()
const USER_ID = process.env.IG_USER_ID?.trim()
const PEXELS = process.env.PEXELS_API_KEY?.trim()

function melde(text: string): void {
  console.log(`[instagram] ${text}`)
}

/** Ein Abruf, der nie wirft – der Aufrufer entscheidet, was ein Fehler ist. */
async function hole(pfad: string): Promise<{ status: number; daten: unknown }> {
  try {
    const antwort = await fetch(`${API}/${pfad}`)
    return { status: antwort.status, daten: await antwort.json() }
  } catch (fehler) {
    return { status: 0, daten: { fehler: String(fehler) } }
  }
}

/** Die Fehlermeldung aus einer Graph-Antwort, so weit sie brauchbar ist. */
function grund(daten: unknown): string {
  const fehler = (daten as { error?: { message?: string; type?: string } })?.error
  if (!fehler) return JSON.stringify(daten).slice(0, 200)
  return `${fehler.type ?? 'Fehler'}: ${fehler.message ?? '(ohne Meldung)'}`
}

if (!TOKEN || !USER_ID) {
  /*
    Kein Fehler, sondern ein Zustand – dieselbe Haltung wie bei ElevenLabs
    und Spotify. Wer den Lauf startet, bevor die Secrets hinterlegt sind,
    soll erfahren, was fehlt, und keinen roten Lauf bekommen.
  */
  melde('Noch keine Zugangsdaten hinterlegt.')
  melde('')
  melde('  IG_ACCESS_TOKEN   fehlt' + (TOKEN ? ' nicht' : ''))
  melde('  IG_USER_ID        fehlt' + (USER_ID ? ' nicht' : ''))
  melde('')
  melde('  Beide gehören nach Settings > Secrets and variables > Actions.')
  melde('  Der Weg dorthin steht in EINRICHTUNG.md unter „Instagram".')
  process.exit(0)
}

melde('Zugangsdaten sind hinterlegt. Prüfe die Verbindung …')

/* ------------------------------------------------------- 1. Das Token */

const ich = await hole(`me?fields=id,name&access_token=${encodeURIComponent(TOKEN)}`)
if (ich.status !== 200) {
  console.error(`::error::[instagram] Das Token wird abgelehnt (${ich.status}).`)
  console.error(`  ${grund(ich.daten)}`)
  console.error('')
  console.error('  Häufigste Ursachen:')
  console.error('   – Das Token ist abgelaufen. Kurzlebige gelten 1 Stunde,')
  console.error('     langlebige 60 Tage.')
  console.error('   – Es stammt von einer anderen App als der eingerichteten.')
  process.exit(1)
}
melde(`Token gültig, angemeldet als „${(ich.daten as { name?: string }).name ?? '?'}".`)

/* --------------------------------------------- 2. Das Instagram-Konto */

const konto = await hole(
  `${USER_ID}?fields=username,name,followers_count,media_count` +
    `&access_token=${encodeURIComponent(TOKEN)}`
)

if (konto.status !== 200) {
  console.error(
    `::error::[instagram] IG_USER_ID ${USER_ID} ist nicht abrufbar (${konto.status}).`
  )
  console.error(`  ${grund(konto.daten)}`)
  console.error('')
  console.error('  Das ist fast immer eine der drei:')
  console.error('   – Die Kennung ist die der Facebook-Seite statt die des')
  console.error('     Instagram-Kontos. Gesucht ist die „Instagram Business Account ID".')
  console.error('   – Das Instagram-Konto ist noch ein privates und kein Profi- oder')
  console.error('     Creator-Konto.')
  console.error('   – Der App fehlt instagram_basic.')
  process.exit(1)
}

const profil = konto.daten as {
  username?: string
  name?: string
  followers_count?: number
  media_count?: number
}

melde('')
melde('— Das verbundene Konto —')
melde(`  Benutzername    @${profil.username ?? '?'}`)
melde(`  Name            ${profil.name ?? '—'}`)
melde(`  Folgende        ${profil.followers_count ?? '—'}`)
melde(`  Beiträge        ${profil.media_count ?? '—'}`)
melde('')

if (profil.username !== ERWARTET) {
  console.error(
    `::error::[instagram] Verbunden ist @${profil.username}, erwartet war @${ERWARTET}.`
  )
  console.error('  Ein Beitrag ginge damit auf das falsche Konto.')
  process.exit(1)
}
melde(`✓ Das ist @${ERWARTET} – die Verbindung führt zum richtigen Konto.`)

/* ------------------------------------------------ 3. Wie lange noch? */

/*
  `debug_token` verlangt einen App-Token. Den haben wir hier nicht, also
  wird die Gültigkeit über die Fehlermeldung ermittelt – geht nicht. Statt
  zu raten, wird der Betreiber an das Datum erinnert, das er selbst kennt:
  den Tag, an dem er das Token erzeugt hat.

  Das ist ehrlicher als eine Zahl, die auf einer Annahme beruht. Der Wächter
  weiter unten in der Kette macht daraus einen roten Lauf, sobald das Token
  wirklich abgelehnt wird – und das ist der Zeitpunkt, der zählt.
*/
melde('')
melde('Ein langlebiges Token gilt 60 Tage ab Ausstellung.')
melde('Diese Probe kann das Ablaufdatum nicht auslesen – sie sagt nur, dass')
melde('es **heute** gilt. Wer es erneuert, startet diesen Lauf danach erneut.')

/* ----------------------------------------------- 4. Die Titelbilder */

melde('')
if (!PEXELS) {
  melde('Kein PEXELS_API_KEY – die Deckblätter bekämen kein Foto.')
  melde('  Der Schlüssel ist kostenlos unter pexels.com/api zu bekommen.')
} else {
  const pexels = await fetch(
    'https://api.pexels.com/v1/search?query=stock%20exchange&per_page=1',
    {
      headers: { Authorization: PEXELS },
    }
  )
    .then(async (antwort) => ({ status: antwort.status, daten: await antwort.json() }))
    .catch((fehler: unknown) => ({ status: 0, daten: { fehler: String(fehler) } }))

  if (pexels.status === 200) {
    const treffer = (pexels.daten as { photos?: { photographer?: string }[] }).photos?.[0]
    melde(
      `Pexels antwortet – Probeabruf lieferte ein Foto von ${treffer?.photographer ?? '?'}.`
    )
  } else {
    console.error(
      `::error::[instagram] Pexels lehnt den Schlüssel ab (${pexels.status}).`
    )
    process.exit(1)
  }
}

melde('')
melde('Die Verbindung steht. Veröffentlicht wurde nichts.')

/* Dieses Skript hat weder Import noch Export – ohne die folgende Zeile hält
   TypeScript es für ein Skript statt für ein Modul und verbietet `await` auf
   oberster Ebene. `node --experimental-strip-types` stört sich nicht daran;
   `npm run typecheck` schon. */
export {}
