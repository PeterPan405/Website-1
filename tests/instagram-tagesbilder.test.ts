/**
 * Tagesbilder: jeden Tag neue Fotos, keins zweimal – Anlass in
 * `lib/instagram-tagesbilder.ts`.
 *
 * Ausführen mit `npm test`.
 */
import { existsSync } from 'node:fs'

import { marketDefinitions } from '@/data/markets'
import { bebildere, MOTIVE, motiveVomVortag } from '@/lib/instagram-motive'
import {
  type Kandidat,
  leseRegister,
  SUCHE,
  suchenFuer,
  TAGESBILDER,
  taugt,
  bildnachweis,
  MARKENBILD,
  tagesbild,
  tageskurs,
  titelAusSeite,
  verwendeteTitel,
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
pruefe('CC BY-SA mit Nennung: taugt', taugt({ ...gut, lizenz: 'CC BY-SA 4.0' }, leer))
pruefe('CC BY: taugt', taugt({ ...gut, lizenz: 'CC BY 2.0' }, leer))
pruefe(
  'nicht kommerziell: taugt nicht',
  !taugt({ ...gut, lizenz: 'CC BY-NC-SA 2.0' }, leer)
)
pruefe('keine Bearbeitung: taugt nicht', !taugt({ ...gut, lizenz: 'CC BY-ND 4.0' }, leer))
pruefe('GFDL allein: taugt nicht', !taugt({ ...gut, lizenz: 'GFDL' }, leer))
const nachweis = bildnachweis('2099-01-01', {
  '2099-01-01': [
    {
      stelle: 2,
      datei: 'a.jpg',
      titel: 'File:A.jpg',
      seite: '',
      lizenz: 'CC0',
      urheber: 'X',
      suche: '',
    },
    {
      stelle: 3,
      datei: 'b.jpg',
      titel: 'File:B.jpg',
      seite: '',
      lizenz: 'CC BY-SA 4.0',
      urheber: 'Anna Muster',
      suche: '',
    },
  ],
})
pruefe(
  'Nennung nur für CC BY/BY-SA, mit Urheber und Lizenz',
  nachweis.includes('Seite 3: Anna Muster, CC BY-SA 4.0') &&
    !nachweis.includes('Seite 2'),
  nachweis
)
pruefe('ohne Nennungspflicht keine Zeile', bildnachweis('2099-01-02', {}) === '')
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

/* Der erste Lauf vom 21.10.2026 – vier von fünf Treffern waren keine Fotos zum Thema. */
for (const falsch of [
  'File:Guilmin map of Paris, France, Monuments - Geographicus - Paris-Guilmin.jpg',
  'File:Tittar på Netflix 2015–2019.jpg',
  'File:Outstanding Students for the World visiting the Googleplex, Tabloid Diplomasi 50 2012, p13.jpg',
])
  pruefe(
    `kein Foto zum Thema: ${falsch.slice(5, 50)}…`,
    !taugt({ ...gut, titel: falsch }, leer)
  )
pruefe(
  'Eisvogel für „Japan container ship": kein Stichwort im Titel',
  !taugt(
    { ...gut, titel: 'File:Common kingfisher in Japan, January 2019.jpg' },
    leer,
    undefined,
    ['container', 'ship']
  )
)
pruefe(
  'dasselbe Foto unbeschnitten: verwendet',
  !taugt({ ...gut, titel: 'File:Euro coins and banknotes.jpg' }, verwendeteTitel({}))
)
pruefe(
  'Handschlag mit Geldscheinen: sieht aus wie Bestechung',
  !taugt(
    {
      ...gut,
      titel:
        'File:10 - hands shaking with euro bank notes inside handshake - public domain photo image 01.JPG',
    },
    leer
  )
)
pruefe(
  'Ferienwohnzimmer für Netflix (21.10.): taugt nicht',
  !taugt(
    {
      ...gut,
      titel:
        'File:This room has a flat screen TV with Roku and a DVD player. The couch can convert to a bed.jpg',
    },
    leer
  )
)
pruefe(
  'PNG taugt nicht – Fotos sind JPEG',
  !taugt({ ...gut, titel: 'File:Hafen.png' }, leer)
)
pruefe(
  'die festen Motive zählen als verwendet',
  verwendeteTitel({}).has('File:Euro coins and banknotes (cropped).jpg')
)
pruefe(
  'Fundstelle → Titel',
  titelAusSeite(
    'https://commons.wikimedia.org/wiki/File:Palais_Bourbon,_Paris_7e,_NW_View_140402_1.jpg'
  ) === 'File:Palais Bourbon, Paris 7e, NW View 140402 1.jpg'
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
  'Netflix: zuerst das Logo, nur mit dem Namen im Titel',
  netflix[0]?.begriff === 'Netflix logo' && netflix[0]?.mussEnthalten === 'Netflix',
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

/* Der 22.10.2026 – Wasserbüffel für UK-Inflation, Laborgerät für Qiagen. */
pruefe(
  '„piggy bank" findet kein Flussufer: jedes Wort muss im Titel stehen',
  !taugt(
    { ...gut, titel: 'File:Don Puay river bank landscape at sunset.jpg' },
    leer,
    undefined,
    ['piggy', 'bank']
  )
)
const uk = suchenFuer(
  'UK-Inflation auf 3,5 %',
  'euro',
  'Eine Zinserhöhung der Bank of England gilt nun als nahezu sicher.'
)
pruefe(
  'UK-Inflation: zuerst der Notenbankchef am Pult, nicht die Fassade',
  uk[0]?.begriff === 'press conference deepcat:"Andrew Bailey (banker)"' &&
    uk[0]?.person === true,
  JSON.stringify(uk[0])
)
pruefe(
  '… danach die Bank of England, nur ausgezeichnete Fotos',
  uk.find((s) => !s.person)?.begriff === 'Bank of England' &&
    uk.filter((s) => !s.person).every((s) => s.nurAusgezeichnet)
)
pruefe(
  'Fed im Text: Warsh',
  suchenFuer('Fed senkt Zins', 'fed')[0]?.begriff.endsWith('deepcat:"Kevin Warsh"')
)
pruefe(
  'EZB: Lagarde',
  suchenFuer('EZB hält Zins', 'ezb')[0]?.begriff.endsWith('deepcat:"Christine Lagarde"')
)
pruefe(
  'nie über den Namen allein – der Baseballspieler Andrew Bailey (22.10.)',
  uk.filter((s) => s.person).every((s) => s.begriff.includes('deepcat:'))
)
pruefe(
  'ohne Geldpolitik kein Notenbankchef',
  !suchenFuer('Frankreich: Rendite 5 %', 'frankreich').some((s) => s.person)
)
const warsh: Kandidat = {
  ...gut,
  titel:
    "File:Chairman Warsh answers reporters' questions at the FOMC press conference on June 17, 2026 (2).jpg",
}
pruefe(
  'Pressekonferenz: beim Menschen im Amt das Bild …',
  taugt(warsh, leer, 'Chairman Warsh', undefined, true)
)
pruefe('… bei einer Sache ein Ausschluss', !taugt(warsh, leer))
pruefe(
  'Persönlichkeitsrecht hält einen Amtsträger nicht auf, anderes schon',
  taugt({ ...warsh, einschraenkung: 'personality' }, leer, 'Warsh', undefined, true) &&
    !taugt(
      { ...warsh, einschraenkung: 'personality|trademarked' },
      leer,
      'Warsh',
      undefined,
      true
    )
)
const qiagen = suchenFuer('EQT übernimmt Qiagen', 'boerse')
pruefe(
  'Qiagen: nie der bloße Name, nur Logo/Schild/Sitz/Gebäude',
  qiagen.filter((s) => s.mussEnthalten).every((s) => s.marke && s.begriff !== 'Qiagen')
)
pruefe(
  'Laborgerät ist kein Markenbild',
  !MARKENBILD.test('File:Rotor-Gene Q thermocycle of Qiagen.jpg')
)
pruefe(
  'Schriftzug am Gebäude ist eins',
  MARKENBILD.test('File:Qiagen headquarters Hilden.jpg')
)

/* Ein Kursverlauf statt eines Fotos (24.10.2026, Munich Re). */
const mitKurs = {
  '2099-01-01': [
    {
      stelle: 4,
      datei: '',
      titel: 'Kurs: munich-re',
      seite: '',
      lizenz: 'Kursgrafik',
      urheber: '',
      suche: '',
      kurs: 'munich-re',
    },
  ],
}
pruefe(
  'Kursverlauf statt Foto: kein Bild, aber das Symbol',
  tagesbild('2099-01-01', 4, mitKurs) === null &&
    tageskurs('2099-01-01', 4, mitKurs) === 'munich-re'
)
pruefe(
  '… und er zählt nicht als verwendete Datei',
  !verwendeteTitel(mitKurs).has('Kurs: munich-re')
)
pruefe('… und braucht keine Nennung', bildnachweis('2099-01-01', mitKurs) === '')

/* Das Register: keine Datei zweimal, jede liegt bereit. */
const register = leseRegister()
const titel = Object.values(register).flatMap((tag) =>
  tag.filter((b) => !b.kurs).map((b) => b.titel)
)
pruefe(
  `keine Commons-Datei zweimal (${titel.length})`,
  new Set(titel).size === titel.length
)
for (const [tag, bilder] of Object.entries(register))
  for (const b of bilder) {
    if (b.kurs) {
      pruefe(
        `${tag}, Kachel ${b.stelle}: Kursverlauf ${b.kurs} steht im Kursbestand`,
        marketDefinitions.some((m) => m.symbol === b.kurs)
      )
      continue
    }
    pruefe(
      `${tag}, Kachel ${b.stelle}: Datei liegt bereit`,
      existsSync(`${TAGESBILDER}/${b.datei}`)
    )
    pruefe(
      `${tag}, Kachel ${b.stelle}: frei`,
      /^(Public domain|CC0|PD|PDM|CC BY(-SA)? \d)/i.test(b.lizenz) ||
        /* Ein Foto, das der Betreiber selbst geschickt hat (24.10.2026, Amex). */
        b.lizenz === 'vom Betreiber gestellt',
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
