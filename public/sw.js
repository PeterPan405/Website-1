/**
 * Der Dienstarbeiter: Offline-Lesen für den Lernbereich – und nur für ihn.
 *
 * ## Der Zuschnitt ist der Punkt
 *
 * Kurse, Nachrichten und Rechnerdaten fasst dieser Arbeiter nicht an. Eine
 * offline gezeigte Kursseite wäre eine Seite mit alten Zahlen, die aussehen
 * wie aktuelle – genau der Fehler, gegen den die halbe Website gebaut ist.
 * Lerninhalte dagegen veralten in Tagen nicht: Zinseszins bleibt Zinseszins,
 * auch im Funkloch.
 *
 * ## Die Strategie: Netz zuerst, Speicher nur als Rückfall
 *
 * Wer online ist, bekommt immer den Stand vom Server; erst wenn das Netz
 * fehlt, kommt die zuletzt gesehene Fassung aus dem Speicher. Damit gibt es
 * keinen Weg, auf dem ein Besucher mit Netz eine alte Seite sieht – die
 * Zwischenspeicher-Falle vom 31. Juli 2026 (CDN lieferte alten Stand) kann
 * dieser Arbeiter nicht nachbauen.
 *
 * Die Bausteine unter /_next/static/ tragen eine Prüfsumme im Namen und
 * sind damit unveränderlich – für sie ist Speicher-zuerst richtig und
 * schnell.
 *
 * ## Kein Vorab-Laden
 *
 * Gespeichert wird nur, was jemand besucht hat. Alles vorzuladen hieße,
 * jedem Besucher hunderte Seiten aufs Gerät zu schreiben, die er nie
 * ansieht.
 */

const DOKUMENTE = 'fk-lernen-dokumente-v1'
const BAUSTEINE = 'fk-bausteine-v1'
const HOECHSTENS_DOKUMENTE = 300

/** Nur diese Bereiche werden offline vorgehalten. */
const OFFLINE_BEREICHE = [/^\/lernen(\/|$)/, /^\/akademie(\/|$)/, /^\/glossar(\/|$)/]

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (ereignis) => {
  ereignis.waitUntil(
    (async () => {
      const bekannt = new Set([DOKUMENTE, BAUSTEINE])
      for (const name of await caches.keys()) {
        if (name.startsWith('fk-') && !bekannt.has(name)) await caches.delete(name)
      }
      await self.clients.claim()
    })()
  )
})

/** Die ältesten Einträge entfernen, wenn der Speicher zu groß wird. */
async function stutzen(name, hoechstens) {
  const speicher = await caches.open(name)
  const schluessel = await speicher.keys()
  // `keys()` liefert in Einfügereihenfolge – vorn steht das Älteste.
  for (const anfrage of schluessel.slice(
    0,
    Math.max(0, schluessel.length - hoechstens)
  )) {
    await speicher.delete(anfrage)
  }
}

async function netzZuerst(anfrage) {
  const speicher = await caches.open(DOKUMENTE)
  try {
    const antwort = await fetch(anfrage)
    if (antwort.ok) {
      await speicher.put(anfrage, antwort.clone())
      stutzen(DOKUMENTE, HOECHSTENS_DOKUMENTE)
    }
    return antwort
  } catch {
    const gespeichert = await speicher.match(anfrage)
    if (gespeichert) return gespeichert
    return new Response(
      `<!doctype html><html lang="de"><meta charset="utf-8">` +
        `<meta name="viewport" content="width=device-width, initial-scale=1">` +
        `<title>Offline</title>` +
        `<body style="font-family:system-ui,sans-serif;max-width:36rem;margin:15vh auto;padding:0 1.5rem;line-height:1.6">` +
        `<h1 style="font-size:1.5rem">Gerade offline</h1>` +
        `<p>Diese Seite wurde auf diesem Gerät noch nicht besucht und liegt deshalb ` +
        `nicht gespeichert vor. Bereits gelesene Lernseiten funktionieren auch ohne Netz.</p>` +
        `<p><a href="javascript:location.reload()">Erneut versuchen</a></p></body></html>`,
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  }
}

async function speicherZuerst(anfrage) {
  const speicher = await caches.open(BAUSTEINE)
  const gespeichert = await speicher.match(anfrage)
  if (gespeichert) return gespeichert
  const antwort = await fetch(anfrage)
  if (antwort.ok) await speicher.put(anfrage, antwort.clone())
  return antwort
}

self.addEventListener('fetch', (ereignis) => {
  const anfrage = ereignis.request
  if (anfrage.method !== 'GET') return

  const url = new URL(anfrage.url)
  if (url.origin !== self.location.origin) return

  // Seitenaufrufe: nur die Offline-Bereiche, Netz zuerst.
  if (anfrage.mode === 'navigate') {
    if (OFFLINE_BEREICHE.some((bereich) => bereich.test(url.pathname))) {
      ereignis.respondWith(netzZuerst(anfrage))
    }
    return
  }

  // Unveränderliche Bausteine: Speicher zuerst. Alles andere (Kursdaten,
  // Suchindex, Bilder außerhalb von _next) bleibt unangefasst.
  if (url.pathname.startsWith('/_next/static/')) {
    ereignis.respondWith(speicherZuerst(anfrage))
  }
})
