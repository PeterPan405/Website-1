/**
 * Schneidet die Fotomotive für die Instagram-Kacheln aus den Deckblättern.
 *
 *     node --experimental-strip-types --import ./scripts/alias-hook.mjs scripts/instagram-motive.ts
 *
 * Welche Motive es gibt und aus welchem Deckblatt jedes stammt, steht in
 * `MOTIVE` (`lib/instagram-motive.ts`). Geschnitten wird unterhalb der
 * eingebrannten Überschrift – ab 30 % der Bildhöhe –, auf 1010 × 560 Pixel,
 * mit dem Ausschnitt, den `sharp` für den auffälligsten hält. Das Ergebnis
 * liegt in `lib/instagram/motive/<id>.jpg` und wird eingecheckt: Der Bau
 * soll nicht bei jedem Lauf neu schneiden.
 */
import sharp from 'sharp'

import { MOTIVE } from '@/lib/instagram-motive'

export const MOTIV_BREITE = 1010
export const MOTIV_HOEHE = 560

for (const motiv of MOTIVE) {
  const pfad = `lib/instagram/titelbilder/${motiv.quelle}`
  const { width = 0, height = 0 } = await sharp(pfad).metadata()
  const oben = Math.round(height * 0.3)
  await sharp(pfad)
    .extract({ left: 0, top: oben, width, height: height - oben })
    .resize(MOTIV_BREITE, MOTIV_HOEHE, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(`lib/instagram/motive/${motiv.id}.jpg`)
  console.log(`${motiv.id}.jpg ← ${motiv.quelle}`)
}
