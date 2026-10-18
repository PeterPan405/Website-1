import {
  deckblaetter,
  deckblattZumThema,
  meldungskachel,
  motivJpeg,
} from '@/lib/instagram-bild'
import { kachelKurs } from '@/lib/instagram-kurs'
import { bebildere, deckblattMotiv } from '@/lib/instagram-motive'
import { instagramHeute } from '@/lib/instagram-heute'

/**
 * Die Kacheln von „Top-News des Tages", als JPEG.
 *
 *     /instagram/1.jpg   Deckblatt – „Top-News des Tages" auf einem Foto
 *     /instagram/2.jpg   erste Meldung
 *     …
 *     /instagram/6.jpg   fünfte Meldung
 *
 * Genau sechs, wie in 54 von 54 Tagesbeiträgen im Kanal. Gestaltung und
 * Maße stehen in `lib/instagram-bild.ts`.
 *
 * ## Warum eine Route und kein Skript
 *
 * Route Handler werden bei `next build` statisch gerendert (nur `GET`, siehe
 * `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`). Die
 * Kacheln liegen danach als Dateien in `out/instagram/` und mit der
 * Übertragung auf dem Webspace – dort holt Meta sie ab.
 *
 * ## Und an Tagen ohne Beitrag?
 *
 * Dann entsteht nur das Deckblatt. Ein leeres `generateStaticParams` verträgt
 * der statische Export nicht, und ein Deckblatt allein schadet nicht: Der
 * Veröffentlichungslauf fragt zuerst `/instagram/stand.txt` und hört auf,
 * bevor er Kacheln zählt.
 */
export const dynamic = 'force-static'

export function generateStaticParams() {
  const stand = instagramHeute()
  const anzahl = stand?.status === 'tagesnews' ? 1 + stand.plan.kacheln.length : 1
  return Array.from({ length: anzahl }, (_, i) => ({ nr: `${i + 1}.jpg` }))
}

export async function GET(_anfrage: Request, ctx: { params: Promise<{ nr: string }> }) {
  const { nr } = await ctx.params
  const stelle = Number(nr.replace(/\.jpg$/, ''))
  const stand = instagramHeute()
  if (!stand) return new Response('Keine Ausgabe.', { status: 404 })

  /*
    So viele Kacheln, wie der Plan hat – seit dem 18.10.2026 sonntags und
    montags drei bis fünf (`kachelnErlaubt()`). Nur die gibt es als Datei;
    `instagram-beitrag.yml` zählt, bis eine fehlt.
  */
  const hoechstens = stand.status === 'tagesnews' ? 1 + stand.plan.kacheln.length : 1
  if (!Number.isInteger(stelle) || stelle < 1 || stelle > hoechstens) {
    return new Response(`Kachel ${nr} gibt es nicht.`, { status: 404 })
  }

  /* Das Deckblatt zum Thema der wichtigsten Meldung, wenn es eins gibt. */
  const plan = stand.status === 'tagesnews' ? stand.plan : null
  const thema = plan ? deckblattMotiv(plan.kacheln, deckblaetter()) : null

  let jpeg: Buffer
  if (stelle === 1) {
    // Das Deckblatt ist schon ein JPEG aus dem Kanal – unverändert ausliefern.
    jpeg = deckblattZumThema(stand.datum, thema?.quelle ?? null).jpeg
  } else {
    /*
      JPEG, nicht PNG: Meta nimmt für Beiträge nur JPEG. `ImageResponse`
      liefert PNG, `sharp` wandelt um – beim Bauen, nicht beim
      Veröffentlichen. Qualität 90, weil an Buchstabenkanten Artefakte
      auffallen.
    */
    const kachel = plan!.kacheln[stelle - 2]
    /*
      Foto und Kursverlauf (16.10.2026, „mehr Bilder, spannender"). Die
      Auswahl läuft über alle Kacheln, damit kein Motiv zweimal kommt – siehe
      `lib/instagram-motive.ts`.
    */
    const bild = bebildere(plan!.kacheln, thema?.id ?? null)[stelle - 2]
    const png = await meldungskachel(kachel.titel, kachel.text, {
      foto: bild.motiv ? motivJpeg(bild.motiv) : null,
      kurs: bild.kurs ? await kachelKurs(bild.kurs, kachel, stand.datum) : null,
    })
    const { default: sharp } = await import('sharp')
    jpeg = await sharp(png).jpeg({ quality: 90, mozjpeg: true }).toBuffer()
  }

  return new Response(new Uint8Array(jpeg), {
    headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=3600' },
  })
}
