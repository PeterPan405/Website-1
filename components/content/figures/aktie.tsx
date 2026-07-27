import { Beschriftung, FigureSvg } from '@/components/content/figures/Rahmen'
import { formatCurrency } from '@/lib/format'

/**
 * Die Grafiken zum Lernthema Aktie.
 *
 * Anders als bei den Zinsgrafiken stehen die Zahlen hier im Code: Es sind
 * Anschauungsbeispiele – 50 Euro Kurs, 2 Euro Dividende, 20 Cent Spanne –, die
 * genau so auch im Text daneben stehen. Berechnen ließe sich daran nichts;
 * gemeinsam gehalten werden sie mit dem Text über die Konstanten unten.
 */

const markenfarbe = 'var(--c-brand)'
const rasterfarbe = 'var(--c-border)'

// -------------------------------------------------- Was eine Aktie ist

const felderJeReihe = 10
const eigeneFelder = 5

export function AktieAnteil() {
  const kante = 20
  const luecke = 5
  const links = 24
  const oben = 54
  const gitterbreite = felderJeReihe * kante + (felderJeReihe - 1) * luecke

  const felder = Array.from({ length: felderJeReihe * felderJeReihe }, (_, index) => ({
    index,
    x: links + (index % felderJeReihe) * (kante + luecke),
    y: oben + Math.floor(index / felderJeReihe) * (kante + luecke),
    eigen: index < eigeneFelder,
  }))

  const textLinks = links + gitterbreite + 44

  return (
    <FigureSvg id="aktie-anteil" viewBox="0 0 640 330">
      <Beschriftung x={links} y={32} ton="stark" gewicht="kraeftig" groesse={14}>
        Das ganze Unternehmen
      </Beschriftung>

      {felder.map((feld) => (
        <rect
          key={feld.index}
          x={feld.x}
          y={feld.y}
          width={kante}
          height={kante}
          rx={3}
          fill={feld.eigen ? markenfarbe : rasterfarbe}
        />
      ))}

      <Beschriftung x={links} y={oben + gitterbreite + 24} ton="leise" groesse={12}>
        100 Felder – jedes Feld ein Prozent
      </Beschriftung>

      <g>
        <rect x={textLinks} y={112} width={16} height={16} rx={3} fill={markenfarbe} />
        <Beschriftung
          x={textLinks + 24}
          y={125}
          ton="stark"
          gewicht="kraeftig"
          groesse={14}
        >
          Dein Anteil: {eigeneFelder} Prozent
        </Beschriftung>
      </g>
      {[
        'Damit gehören dir fünf Prozent',
        'der Fabriken, der Marken, der',
        'Patente, der Schulden – und der',
        'künftigen Gewinne.',
      ].map((zeile, index) => (
        <Beschriftung key={zeile} x={textLinks} y={158 + index * 22} ton="gedaempft">
          {zeile}
        </Beschriftung>
      ))}
    </FigureSvg>
  )
}

// --------------------------------------------- Kursabschlag am Ausschüttungstag

const kursVorher = 50
const dividende = 2
const kursNachher = kursVorher - dividende

export function AktieDividendenabschlag() {
  /*
    Bewusst eine Preisachse und keine Balken.

    Zwei Euro sind vier Prozent von fünfzig. In einem Balkendiagramm wäre der
    Dividendenanteil ein sieben Pixel hoher Streifen – sichtbar wäre die
    wichtigste Bewegung der Grafik dann gerade nicht. Auf einer Achse von 47 bis
    51 Euro ist derselbe Betrag ein deutlicher Sprung.
  */
  const achseVon = 47
  const achseBis = 51
  const oben = 42
  const unten = 212
  const y = (preis: number) =>
    unten - ((preis - achseVon) / (achseBis - achseVon)) * (unten - oben)

  const achseX = 92
  const linienEnde = 372

  return (
    <FigureSvg id="aktie-dividendenabschlag" viewBox="0 0 640 268">
      <line
        x1={achseX}
        y1={oben - 6}
        x2={achseX}
        y2={unten + 6}
        stroke={rasterfarbe}
        strokeWidth={1}
      />
      {[47, 48, 49, 50, 51].map((preis) => (
        <g key={preis}>
          <line
            x1={achseX - 5}
            y1={y(preis)}
            x2={achseX}
            y2={y(preis)}
            stroke={rasterfarbe}
            strokeWidth={1}
          />
          <Beschriftung x={achseX - 12} y={y(preis) + 4} anchor="end" ton="leise">
            {formatCurrency(preis, 0)}
          </Beschriftung>
        </g>
      ))}

      <line
        x1={achseX}
        y1={y(kursVorher)}
        x2={linienEnde}
        y2={y(kursVorher)}
        stroke={markenfarbe}
        strokeWidth={2.5}
      />
      <Beschriftung
        x={linienEnde + 10}
        y={y(kursVorher) + 5}
        ton="stark"
        gewicht="kraeftig"
      >
        Kurs vorher {formatCurrency(kursVorher)}
      </Beschriftung>

      <line
        x1={achseX}
        y1={y(kursNachher)}
        x2={linienEnde}
        y2={y(kursNachher)}
        stroke={markenfarbe}
        strokeWidth={2.5}
      />
      <Beschriftung
        x={linienEnde + 10}
        y={y(kursNachher) + 5}
        ton="stark"
        gewicht="kraeftig"
      >
        Kurs danach {formatCurrency(kursNachher)}
      </Beschriftung>

      {/* Der Sprung zwischen den beiden Kursen – und wohin das Geld geht. */}
      <line
        x1={196}
        y1={y(kursVorher)}
        x2={196}
        y2={y(kursNachher) - 8}
        stroke="var(--c-danger)"
        strokeWidth={2}
      />
      <path d={`M196 ${y(kursNachher)} l-5 -9 h10 Z`} fill="var(--c-danger)" />
      <Beschriftung
        x={206}
        y={(y(kursVorher) + y(kursNachher)) / 2 + 4}
        ton="gefahr"
        gewicht="kraeftig"
      >
        −{formatCurrency(dividende)}
      </Beschriftung>

      <g>
        <rect
          x={achseX}
          y={228}
          width={276}
          height={30}
          rx={6}
          fill="var(--c-accent-soft)"
        />
        <Beschriftung x={achseX + 14} y={248} ton="akzent" gewicht="kraeftig">
          + {formatCurrency(dividende)} auf deinem Konto
        </Beschriftung>
      </g>
      <Beschriftung x={achseX + 292} y={248} ton="gedaempft">
        zusammen unverändert {formatCurrency(kursVorher)}
      </Beschriftung>
    </FigureSvg>
  )
}

// ----------------------------------------------------- Geldkurs und Briefkurs

const geldkurs = 49.9
const briefkurs = 50.1

export function AktieSpread() {
  const achseVon = 49.7
  const achseBis = 50.3
  const links = 70
  const rechts = 590
  const achseY = 128
  const x = (preis: number) =>
    links + ((preis - achseVon) / (achseBis - achseVon)) * (rechts - links)

  const spanne = briefkurs - geldkurs

  return (
    <FigureSvg id="aktie-spread" viewBox="0 0 640 210">
      <Beschriftung
        x={(x(geldkurs) + x(briefkurs)) / 2}
        y={44}
        anchor="middle"
        ton="stark"
        gewicht="kraeftig"
        groesse={14}
      >
        Spread {formatCurrency(spanne)}
      </Beschriftung>
      {/* Klammer über der Spanne: Sie gehört zu beiden Kursen, nicht zu einem. */}
      <path
        d={`M${x(geldkurs)} ${64} v-8 H${x(briefkurs)} v8`}
        fill="none"
        stroke="var(--c-fg-subtle)"
        strokeWidth={1}
      />

      <Beschriftung x={x(geldkurs)} y={92} anchor="middle" ton="gedaempft">
        Geldkurs {formatCurrency(geldkurs)}
      </Beschriftung>
      <Beschriftung x={x(briefkurs)} y={92} anchor="middle" ton="gedaempft">
        Briefkurs {formatCurrency(briefkurs)}
      </Beschriftung>
      <Beschriftung x={x(geldkurs)} y={108} anchor="middle" ton="leise" groesse={12}>
        du verkaufst
      </Beschriftung>
      <Beschriftung x={x(briefkurs)} y={108} anchor="middle" ton="leise" groesse={12}>
        du kaufst
      </Beschriftung>

      <rect
        x={x(geldkurs)}
        y={achseY - 10}
        width={x(briefkurs) - x(geldkurs)}
        height={20}
        rx={3}
        fill="var(--c-brand-soft)"
      />
      <line
        x1={links}
        y1={achseY}
        x2={rechts}
        y2={achseY}
        stroke={rasterfarbe}
        strokeWidth={1}
      />
      {[geldkurs, briefkurs].map((preis) => (
        <line
          key={preis}
          x1={x(preis)}
          y1={achseY - 14}
          x2={x(preis)}
          y2={achseY + 14}
          stroke={markenfarbe}
          strokeWidth={2.5}
        />
      ))}

      {[49.7, 49.8, 49.9, 50.0, 50.1, 50.2, 50.3].map((preis) => (
        <Beschriftung
          key={preis}
          x={x(preis)}
          y={achseY + 32}
          anchor="middle"
          ton="leise"
          groesse={12}
        >
          {formatCurrency(preis)}
        </Beschriftung>
      ))}

      <Beschriftung x={6} y={196} ton="gedaempft">
        Wer sofort nach dem Kauf wieder verkauft, ist um diese Spanne im Minus – noch vor
        jeder Ordergebühr.
      </Beschriftung>
    </FigureSvg>
  )
}
