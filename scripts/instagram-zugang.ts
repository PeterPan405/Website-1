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
 * 3. Welche Art Token steht da? Ein Seitentoken läuft nicht ab, ein
 *    Nutzertoken nach 60 Tagen – und dann bleibt der Beitrag eines Morgens
 *    einfach aus, der stille Fehler, den dieses Projekt überall abschafft.
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
  console.error('     langlebige Nutzertoken 60 Tage. Ein Seitentoken läuft')
  console.error('     nicht ab – dann liegt es nicht am Ablauf.')
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
  `debug_token` verlangt einen App-Token; den haben wir hier nicht, das
  Ablaufdatum ist also nicht auszulesen. Die **Art** des Tokens aber schon,
  und die entscheidet die ganze Frage:

  - Ein **Seitentoken** aus einem langlebigen Nutzertoken läuft nicht ab.
    Gemessen am 11.10.2026: `debug_token` meldete dafür `expires_at: 0`.
  - Ein **Nutzertoken** ist nach 60 Tagen tot, und der Beitrag bleibt eines
    Morgens aus – der stille Fehler, den dieses Projekt überall abschafft.

  Gefragt wird nicht nach der Art, sondern nach einem **Feld, das es nur bei
  einer Seite gibt**: `category`. Hinter einem Seitentoken steht ein
  Page-Knoten und antwortet damit; hinter einem Nutzertoken ein User-Knoten,
  und Meta lehnt das Feld ab.

  Gemessen am 11.10.2026, beide Token derselben App:

      me?fields=category   Seitentoken  200, „News & media website"
      me?fields=category   Nutzertoken  400

  `metadata=1` wäre der naheliegende Weg gewesen – `metadata.type` nennt
  „page" oder „user". In v21.0 kommt das Feld aber nicht mehr zurück, weder
  allein noch neben `fields`; gemessen am selben Tag, alle drei Schreibweisen
  ohne `metadata` in der Antwort. Deshalb der Umweg über `category`.

  **Eigener Aufruf, nicht an den von oben angehängt.** Bei einem Nutzertoken
  ist diese Abfrage ein Fehler – angehängt machte sie aus einer gelungenen
  Probe einen roten Lauf, der behauptet, das Token werde abgelehnt. So kostet
  sie im schlechtesten Fall eine Zeile.
*/
const seitenprobe = await hole(
  `me?fields=category&access_token=${encodeURIComponent(TOKEN)}`
)

melde('')
if (seitenprobe.status === 200) {
  melde('Das ist ein Seitentoken – es läuft nicht ab. Kein Termin nötig.')
  melde('Neu muss es nur, wenn das Passwort geändert oder die Verbindung in')
  melde('den Business-Integrationen gelöst wird (EINRICHTUNG.md 3.10).')
} else {
  console.warn(
    '::warning::[instagram] In IG_ACCESS_TOKEN steht kein Seitentoken.'
  )
  melde('Ein Nutzertoken gilt 60 Tage ab Ausstellung, dann bleibt der Beitrag')
  melde('eines Morgens aus. Das Seitentoken aus EINRICHTUNG.md 3.5 a läuft')
  melde('nicht ab – eintragen, und die Frage ist für immer erledigt.')
  melde(`(Meta antwortete auf die Seitenprobe mit ${seitenprobe.status}.)`)
}

/* ----------------------------------------------- 4. Die Titelbilder

   Nachrangig, und das steht hier ausdrücklich: Die Kacheln, die heute
   hinausgehen, entstehen in `lib/instagram-bild.tsx` – satori setzt den Text,
   resvg rastert ihn, **ohne Foto und ohne Netz**. Pexels ist für den Beitrag
   des Tages nicht nötig.

   Deshalb ist dieser Abschnitt seit dem 16. August 2026 nicht mehr rot.
   Vorher brach die Zugangsprobe bei einem abgelehnten Pexels-Schlüssel ab –
   also an einer Stelle, die mit dem Veröffentlichen nichts zu tun hat, und
   hätte jemanden, der wissen will „steht die Instagram-Verbindung?", mit
   einem roten Lauf über etwas Drittes stehen lassen. Ein Fehlschlag muss
   die Frage beantworten, die gestellt wurde.
*/

melde('')
if (!PEXELS) {
  melde('Kein PEXELS_API_KEY – für den Beitrag des Tages wird keiner gebraucht.')
  melde('  Die Kacheln entstehen aus Text, ohne Foto. Der Schlüssel ist nur')
  melde('  dann nötig, wenn die Deckblätter später Fotos bekommen sollen.')
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
      `::warning::[instagram] Pexels lehnt den Schlüssel ab (${pexels.status}).` +
        ' Der Beitrag des Tages ist davon nicht betroffen.'
    )
  }
}

melde('')
melde('Die Verbindung steht. Veröffentlicht wurde nichts.')

/* Dieses Skript hat weder Import noch Export – ohne die folgende Zeile hält
   TypeScript es für ein Skript statt für ein Modul und verbietet `await` auf
   oberster Ebene. `node --experimental-strip-types` stört sich nicht daran;
   `npm run typecheck` schon. */
export {}
