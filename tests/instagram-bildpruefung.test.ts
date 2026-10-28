/**
 * Die Prüfung vor dem Hochladen – Anlass in `lib/instagram-bildpruefung.ts`.
 *
 * Am echten Material vom 26.10.2026: Audi-Werk, Verdi-Demonstration,
 * Ifo-Logo, als Kacheln gebaut wie für den Beitrag. Jede Prüfung bekommt
 * den Fall vorgelegt, den sie beanstanden **muss**.
 *
 * Ausführen mit `npm test`.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { meldungskachel } from '@/lib/instagram-bild'
import {
  abgelehnteStellen,
  abstand,
  fingerabdruck,
  GLEICH_HOECHSTENS,
  gerechneterBefund,
  liesFrueher,
  sichtBefund,
} from '@/lib/instagram-bildpruefung'
import { TAGESBILDER } from '@/lib/instagram-tagesbilder'

let failed = 0
function pruefe(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) console.log(`OK   ${was}`)
  else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

const foto = (datei: string) => readFileSync(join(TAGESBILDER, datei))
const werk = foto('2026-10-26-3.jpg')
const verdi = foto('2026-10-26-6.jpg')
const ifo = foto('2026-10-26-5-7255f725.jpg')

const kachel = async (stelle: number, titel: string, bild: Buffer | null) =>
  fingerabdruck(
    stelle,
    await meldungskachel(titel, 'Ein Satz zur Meldung.', { foto: bild })
  )

const richtig = [
  await kachel(3, 'Audi: 4 Mrd. für Georgia', werk),
  await kachel(4, 'Banken: Verdi-Warnstreik', verdi),
  await kachel(5, 'Ifo-Index heute', ifo),
]
pruefe(
  'drei verschiedene Bilder: kein Befund',
  gerechneterBefund('2026-10-26', richtig, []).length === 0,
  gerechneterBefund('2026-10-26', richtig, []).join('; ')
)
const paare = [
  abstand(richtig[0].abdruck, richtig[1].abdruck),
  abstand(richtig[0].abdruck, richtig[2].abdruck),
  abstand(richtig[1].abdruck, richtig[2].abdruck),
]
pruefe(
  `verschiedene Bilder liegen weit über der Grenze (${paare.join(', ')} > ${GLEICH_HOECHSTENS})`,
  Math.min(...paare) > GLEICH_HOECHSTENS * 2
)

/* Der Fall vom 26.10.: Die Ifo-Kachel zeigt das Werk – mit anderem Titel. */
const falsch = [richtig[0], richtig[1], await kachel(5, 'Ifo-Index heute', werk)]
pruefe(
  'dasselbe Bild unter anderer Überschrift fällt auf',
  gerechneterBefund('2026-10-26', falsch, []).some((f) => f.includes('3 und 5'))
)

/* Eine Kachel ohne Bild. */
const ohne = [richtig[0], await kachel(4, 'Banken: Verdi-Warnstreik', null)]
pruefe(
  'eine Kachel ohne Bild fällt auf',
  gerechneterBefund('2026-10-26', ohne, []).some((f) => f.includes('kein Bild'))
)

/* Das Bild eines früheren Beitrags – und eins außerhalb des Fensters. */
const gedaechtnis = liesFrueher(
  `2026-10-24 3 ${richtig[0].abdruck}\nkaputte Zeile\n2026-09-01 4 ${richtig[1].abdruck}\n`
)
pruefe('das Gedächtnis liest nur gültige Zeilen', gedaechtnis.length === 2)
const wieder = gerechneterBefund('2026-10-26', richtig, gedaechtnis)
pruefe(
  'ein Bild vom 24.10. fällt auf, eins vom 1.9. nicht',
  wieder.length === 1 && wieder[0].includes('2026-10-24'),
  wieder.join('; ')
)
pruefe(
  'das Deckblatt zählt nicht mit',
  gerechneterBefund('2026-10-26', [{ ...richtig[0], stelle: 1 }, richtig[0]], [])
    .length === 0
)

/* Die Sichtprüfung. */
const urteil = (kacheln: unknown) => JSON.stringify({ kacheln })
pruefe(
  'alle passend: kein Befund',
  sichtBefund(
    urteil([
      { stelle: 2, passt: true, grund: '' },
      { stelle: 3, passt: true, grund: '' },
    ]),
    [2, 3]
  ).fehler.length === 0
)
const nein = sichtBefund(
  urteil([
    { stelle: 2, passt: true, grund: '' },
    { stelle: 3, passt: false, grund: 'Wasserbüffel statt Bank of England' },
  ]),
  [2, 3]
)
pruefe(
  'ein „passt nicht" hält an, mit Grund',
  !nein.ausgefallen && nein.fehler.length === 1 && nein.fehler[0].includes('Wasserbüffel')
)
pruefe('kein Befund: ausgefallen', sichtBefund(null, [2]).ausgefallen)
pruefe('kaputtes JSON: ausgefallen', sichtBefund('{kacheln:', [2]).ausgefallen)
pruefe(
  'eine ausgelassene Kachel: ausgefallen, nicht „in Ordnung"',
  sichtBefund(urteil([{ stelle: 2, passt: true }]), [2, 3]).ausgefallen
)

// Selbstreparatur: aus den Befunden die Stellen, die neu gesucht werden.
{
  const stellen = abgelehnteStellen([
    'Kachel 3 hat kein Bild',
    'Kachel 4 und 6 zeigen dasselbe Bild',
    'Kachel 5 zeigt das Bild vom 2026-10-27 (Kachel 2) noch einmal',
    'Kachel 3: Kühltürme passen nicht zum Gaspreis',
    'Sichtprüfung ausgefallen',
  ])
  pruefe(
    'abgelehnteStellen: spätere bei Doppel, erste bei Wiederholung, ohne Doppel',
    stellen.join(',') === '3,5,6',
    stellen.join(',')
  )
  pruefe('abgelehnteStellen: ohne Befund nichts', abgelehnteStellen([]).length === 0)
}

if (failed) {
  console.log(`\n${failed} Prüfung(en) fehlgeschlagen.`)
  process.exit(1)
}
console.log('\nAlle Prüfungen bestanden.')
