/**
 * Tagesbilder: jeden Tag neue Fotos, keins zweimal – Anlass in
 * `lib/instagram-tagesbilder.ts`.
 *
 * Ausführen mit `npm test`.
 */
import { existsSync } from 'node:fs'

import { bebildere, MOTIVE, motiveVomVortag } from '@/lib/instagram-motive'
import {
  type Kandidat,
  leseRegister,
  SUCHE,
  suchenFuer,
  TAGESBILDER,
  taugt,
} from '@/lib/instagram-tagesbilder'

let failed = 0
function pruefe(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) console.log(`OK   ${was}`)
  else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/* Jedes Motiv hat Suchbegriffe – sonst sucht seine Kachel nach der Börse. */
for (const m of MOTIVE)
  pruefe(`Motiv ${m.id} hat Suchbegriffe`, (SUCHE[m.id]?.length ?? 0) > 0)

/* Was taugt – jede Bedingung einmal verletzt. */
const gut: Kandidat = {
  titel: 'File:Container ship Hamburg.jpg',
  breite: 3000,
  hoehe: 2000,
  lizenz: 'Public domain',
  einschraenkung: '',
}
const leer = new Set<string>()
pruefe('frei, quer, groß, neu: taugt', taugt(gut, leer))
pruefe('CC0 taugt', taugt({ ...gut, lizenz: 'CC0' }, leer))
pruefe('schon verwendet: taugt nicht', !taugt(gut, new Set([gut.titel])))
pruefe('CC BY-SA: taugt nicht', !taugt({ ...gut, lizenz: 'CC BY-SA 4.0' }, leer))
pruefe(
  'Persönlichkeitsrecht: taugt nicht',
  !taugt({ ...gut, einschraenkung: 'personality' }, leer)
)
pruefe('Hochformat: taugt nicht', !taugt({ ...gut, breite: 2000, hoehe: 3000 }, leer))
pruefe('zu klein: taugt nicht', !taugt({ ...gut, breite: 800, hoehe: 500 }, leer))
pruefe('keine Bilddatei: taugt nicht', !taugt({ ...gut, titel: 'File:Plan.pdf' }, leer))
pruefe(
  'Firmenname fehlt im Titel: taugt nicht',
  !taugt(gut, leer, 'Netflix') &&
    taugt({ ...gut, titel: 'File:Netflix HQ.jpg' }, leer, 'Netflix')
)

/* Die Suchen an den Kacheln vom 21.10.2026, an denen die Regel entstand. */
const japan = suchenFuer('Japans Exporte schwächeln', 'hafen')
pruefe(
  'Japan: das Land vor dem Hafen',
  japan[0]?.begriff === 'Japan container ship',
  JSON.stringify(japan[0])
)
const netflix = suchenFuer('Netflix-Aktie fällt', 'boerse')
pruefe(
  'Netflix: zuerst der Name, nur mit dem Namen im Titel',
  netflix[0]?.mussEnthalten === 'Netflix',
  JSON.stringify(netflix[0])
)
const google = suchenFuer('Google-Ausfall trifft Banken', 'smartphone')
pruefe(
  'Google: die Marke zählt wie ein Name',
  google[0]?.mussEnthalten === 'Google',
  JSON.stringify(google[0])
)
pruefe(
  'ohne Land und Firma: die Begriffe des Motivs',
  suchenFuer('Rekord bei Haushaltsvermögen', 'euro')[0]?.begriff === SUCHE.euro[0]
)

/* Das Register: keine Datei zweimal, jede liegt bereit. */
const register = leseRegister()
const titel = Object.values(register).flatMap((tag) => tag.map((b) => b.titel))
pruefe(
  `keine Commons-Datei zweimal (${titel.length})`,
  new Set(titel).size === titel.length
)
for (const [tag, bilder] of Object.entries(register))
  for (const b of bilder) {
    pruefe(
      `${tag}, Kachel ${b.stelle}: Datei liegt bereit`,
      existsSync(`${TAGESBILDER}/${b.datei}`)
    )
    pruefe(
      `${tag}, Kachel ${b.stelle}: frei`,
      /^(Public domain|CC0|PD|PDM)/i.test(b.lizenz),
      b.lizenz
    )
  }

/* Ohne Tagesbild: kein Motiv vom Vortag. */
const vortag = motiveVomVortag('2026-10-21')
pruefe(
  'am 21.10. gesperrt: Frankreich, Hafen, Euro vom 20.10.',
  ['frankreich', 'hafen', 'euro'].every((m) => vortag.includes(m)),
  JSON.stringify(vortag)
)
const ohneVortag = bebildere(
  [{ titel: 'Frankreich: Soldaten-Einsatz', text: 'Frankreichs Innenminister …' }],
  vortag
)
pruefe(
  '… und Frankreich bekommt dann nicht das Bild vom Vortag',
  ohneVortag[0].motiv !== 'frankreich'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
