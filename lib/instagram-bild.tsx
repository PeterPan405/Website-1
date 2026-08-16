import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'

import type { DailyEdition, EditionItem } from '@/data/editions/types'

/**
 * Die Kachel, die täglich zu Instagram geht.
 *
 * ## Warum dieselbe Technik wie die Vorschaubilder
 *
 * `lib/og-vorlage.tsx` setzt seit Juli Bilder über `next/og` – Satori setzt
 * den Text, resvg rastert ihn. Das läuft **ohne Netz**: keine geladene
 * Schrift, kein Bild von außerhalb, das Logo kommt von der Platte. Genau das
 * braucht auch dieses Bild, und ein zweiter Werkzeugkasten für dieselbe
 * Aufgabe wäre eine zweite Stelle zum Pflegen.
 *
 * ## Warum 1080 × 1350 und nicht quadratisch
 *
 * Das ist das hochkante Format (4:5), das Instagram im Feed am größten
 * darstellt. Ein quadratisches Bild verschenkt rund ein Fünftel der
 * Bildschirmfläche, und auf einem Telefon entscheidet die Fläche darüber, ob
 * eine Schlagzeile im Vorbeiscrollen lesbar ist.
 *
 * ## Warum nur drei Schlagzeilen
 *
 * Weil vier nicht mehr lesbar sind. Bei 1080 Pixeln Breite und einer
 * Schriftgröße, die auf einem Telefon trägt, passen drei Meldungen mit je zwei
 * bis drei Zeilen. Wer fünf unterbringt, hat fünf Zeilen, die niemand liest –
 * und die vierte und fünfte Meldung stehen ohnehin in der Bildunterschrift.
 */

const logo = readFileSync(join(process.cwd(), 'public/logo.svg'), 'utf8')
const logoDatenUrl = `data:image/svg+xml;base64,${Buffer.from(logo).toString('base64')}`

/**
 * Kantenlänge des Logos auf der Titelkachel, in Pixeln.
 *
 * Eine Zahl, keine zwei: `public/logo.svg` ist quadratisch (`viewBox="0 0 200
 * 200"`), und zwei getrennte Werte sind genau die Gelegenheit, sie
 * auseinanderlaufen zu lassen – so ist die Verzerrung entstanden.
 */
export const LOGO_KANTE = 132

/** Instagram zeigt Hochkantbilder bis 4:5 in voller Höhe. */
export const IG_BREITE = 1080
export const IG_HOEHE = 1350

/**
 * Die vier Logofarben, in der Reihenfolge des Streifens.
 *
 * Dieselben Werte wie `--c-logo-*` in `app/globals.css`. Sie stehen hier
 * ausgeschrieben, weil das Bild ohne Stylesheet gesetzt wird; wer sie dort
 * ändert, ändert sie hier mit.
 */
const NAVY = '#17296f'
const GRAU = '#6e6e6e'
const GRUEN = '#205437'
const ROT = '#8b2225'

/** Höchstens so viele Meldungen aufs Bild. Begründung oben. */
export const SCHLAGZEILEN_AUFS_BILD = 3

/**
 * Kürzt eine Schlagzeile auf eine Länge, die im Bild noch trägt.
 *
 * Geschnitten wird an einer Wortgrenze, nicht mitten im Wort, und die
 * Auslassung wird angezeigt. Eine abgeschnittene Schlagzeile ohne Zeichen
 * dafür liest sich wie eine vollständige und behauptet damit etwas anderes,
 * als die Meldung sagt.
 */
export function aufsBild(zeile: string, grenze = 95): string {
  const sauber = zeile.trim()
  if (sauber.length <= grenze) return sauber
  const schnitt = sauber.slice(0, grenze)
  const letzteLuecke = schnitt.lastIndexOf(' ')
  return `${(letzteLuecke > grenze * 0.6 ? schnitt.slice(0, letzteLuecke) : schnitt).trimEnd()} …`
}

/** `2026-08-09` → `9. August 2026`. Ohne `new Date`, siehe `tagVon()`. */
export function datumLang(iso: string): string {
  const monate = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ]
  const [jahr, monat, tag] = iso.split('-')
  const name = monate[Number(monat) - 1]
  if (!jahr || !name || !tag) return iso
  return `${Number(tag)}. ${name} ${jahr}`
}

/** Die Meldungen, die aufs Bild kommen – oberste zuerst. */
export function bildmeldungen(edition: DailyEdition): EditionItem[] {
  return edition.top.slice(0, SCHLAGZEILEN_AUFS_BILD)
}

/**
 * Setzt die Kachel und gibt sie als PNG zurück.
 *
 * PNG, nicht JPEG: `ImageResponse` liefert PNG, und Instagram nimmt beides.
 * Eine Umwandlung nach JPEG wäre ein weiterer Schritt, der schiefgehen kann,
 * für eine Datei von rund hundert Kilobyte.
 */
export async function instagramBild(edition: DailyEdition): Promise<Buffer> {
  const meldungen = bildmeldungen(edition)
  const streifen = [NAVY, GRAU, GRUEN, ROT]

  const antwort = new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: '72px 72px 0 72px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Kopf: Logo und Datum auf einer Linie. */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/*
          Quadratisch, weil das Signet quadratisch ist.

          Hier stand `width={340} height={110}` – ein Verhältnis von 3,09 für
          eine Datei, deren `viewBox` `0 0 200 200` lautet, also 1,00. Das
          Logo wurde damit auf ein Drittel seiner Höhe gequetscht: der Ring
          zur Ellipse, der Schriftzug „IMI" unlesbar breit.

          Aufgefallen ist es am 16. August 2026, als die Kacheln **zum ersten
          Mal überhaupt** gerastert wurden. Der Code lag seit dem 13. August im
          Repository, von keiner Stelle importiert – geschrieben, gemergt und
          nie ausgeführt. Ein Bild, das niemand erzeugt, sieht auch niemand an.

          `tests/instagram-bild.test.ts` vergleicht die Maße jetzt gegen die
          `viewBox` der Datei.
        */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoDatenUrl} width={LOGO_KANTE} height={LOGO_KANTE} alt="" />
        <div style={{ display: 'flex', fontSize: 34, color: GRAU, letterSpacing: 1 }}>
          {datumLang(edition.date)}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          marginTop: 56,
          fontSize: 44,
          fontWeight: 700,
          color: NAVY,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        Die Meldungen des Tages
      </div>

      {/* Die Schlagzeilen. Jede mit ihrem eigenen Farbstrich links – das
            ist der Akzent aus dem Logo, aufgeteilt statt als Balken. */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: 48,
          flexGrow: 1,
        }}
      >
        {meldungen.map((meldung, nummer) => (
          <div key={nummer} style={{ display: 'flex', marginBottom: 44 }}>
            <div
              style={{
                display: 'flex',
                width: 10,
                backgroundColor: streifen[nummer % streifen.length],
                marginRight: 32,
                borderRadius: 5,
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: 26,
                  color: streifen[nummer % streifen.length],
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                {meldung.category}
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 50,
                  lineHeight: 1.22,
                  color: '#0f172a',
                  fontWeight: 600,
                }}
              >
                {aufsBild(meldung.headline)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fuß: Adresse über dem vierfarbigen Streifen. */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingBottom: 34,
        }}
      >
        <div style={{ display: 'flex', fontSize: 40, fontWeight: 700, color: NAVY }}>
          iminvests.de
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: GRAU }}>
          Keine Anlageberatung
        </div>
      </div>
      <div style={{ display: 'flex', height: 18, marginLeft: -72, marginRight: -72 }}>
        {streifen.map((farbe) => (
          <div
            key={farbe}
            style={{ display: 'flex', flexGrow: 1, backgroundColor: farbe }}
          />
        ))}
      </div>
    </div>,
    { width: IG_BREITE, height: IG_HOEHE }
  )

  return Buffer.from(await antwort.arrayBuffer())
}

/**
 * Eine Folgekachel des Karussells – eine Meldung, ausführlich.
 *
 * ## Warum das Karussell und nicht ein Bild
 *
 * Die Titelkachel nennt drei Schlagzeilen und sonst nichts. Das reicht, um im
 * Vorbeiscrollen aufzufallen, und nicht, um etwas zu lernen – und Letzteres
 * ist der Zweck dieser Website. Jede Folgekachel nimmt deshalb **eine**
 * Meldung und stellt daneben, was der Leser damit anfängt: `whyItMatters`,
 * derselbe Satz, der auf der Nachrichtenseite die Rubrik trägt.
 *
 * ## Warum die Nummer aufs Bild gehört
 *
 * Weil ein Karussell von außen nicht zeigt, wie viele Kacheln folgen. „2 von
 * 4" ist die Einladung weiterzuwischen; ohne sie hört der Leser nach der
 * ersten auf.
 */
export async function instagramMeldungsbild(
  meldung: EditionItem,
  nummer: number,
  gesamt: number
): Promise<Buffer> {
  const streifen = [NAVY, GRAU, GRUEN, ROT]
  const farbe = streifen[(nummer - 1) % streifen.length]

  const antwort = new ImageResponse(
    <div
      style={{
        width: IG_BREITE,
        height: IG_HOEHE,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: '72px 72px 0',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Kopf: Rubrik links, Zählung rechts. */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            color: farbe,
            letterSpacing: 3,
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          {meldung.category}
        </div>
        <div style={{ display: 'flex', fontSize: 28, color: GRAU }}>
          {nummer} von {gesamt}
        </div>
      </div>

      {/* Der Farbstrich als Trenner – dasselbe Motiv wie auf der Titelkachel. */}
      <div
        style={{
          display: 'flex',
          height: 8,
          width: 160,
          backgroundColor: farbe,
          borderRadius: 4,
          marginTop: 28,
        }}
      />

      {/* Die Schlagzeile. Grosszügiger als auf der Titelkachel: Hier steht
            nur diese eine, also darf sie den Platz haben. */}
      <div
        style={{
          display: 'flex',
          fontSize: 68,
          lineHeight: 1.18,
          color: '#0f172a',
          fontWeight: 700,
          marginTop: 44,
        }}
      >
        {aufsBild(meldung.headline, 120)}
      </div>

      {/* Was der Leser damit anfängt. Der eigentliche Grund für die Kachel. */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: 48,
          flexGrow: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            color: GRAU,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          Was daraus folgt
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 38,
            lineHeight: 1.42,
            color: '#334155',
          }}
        >
          {aufsBild(meldung.whyItMatters, 300)}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingBottom: 34,
        }}
      >
        <div style={{ display: 'flex', fontSize: 40, fontWeight: 700, color: NAVY }}>
          iminvests.de
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: GRAU }}>
          Keine Anlageberatung
        </div>
      </div>
      <div style={{ display: 'flex', height: 18, marginLeft: -72, marginRight: -72 }}>
        {streifen.map((f) => (
          <div key={f} style={{ display: 'flex', flexGrow: 1, backgroundColor: f }} />
        ))}
      </div>
    </div>,
    { width: IG_BREITE, height: IG_HOEHE }
  )

  return Buffer.from(await antwort.arrayBuffer())
}

/**
 * Das ganze Karussell: Titelkachel, dann je eine Kachel pro Meldung.
 *
 * Instagram nimmt bis zu zehn Bilder je Beitrag. Die Grenze ist hier nicht
 * die Zahl, sondern die Geduld: Nach der Titelkachel und drei Meldungen ist
 * gesagt, was zu sagen ist – der Rest steht auf der Website, und genau
 * dorthin soll der Beitrag führen.
 */
export async function instagramKarussell(edition: DailyEdition): Promise<Buffer[]> {
  const meldungen = bildmeldungen(edition)
  const bilder = [await instagramBild(edition)]
  for (const [i, meldung] of meldungen.entries()) {
    bilder.push(await instagramMeldungsbild(meldung, i + 1, meldungen.length))
  }
  return bilder
}
