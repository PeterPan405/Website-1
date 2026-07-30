import { Callout } from '@/components/ui/Callout'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { cn } from '@/lib/cn'
import { formatNumber } from '@/lib/format'
import { ABGELTUNGSTEUER, SOLI, type Quellensteuerbefund } from '@/lib/quellensteuer'
import { ANRECHNUNG_HOECHSTSATZ, quellensteuerQuelle } from '@/data/quellensteuer'

/** Prozentangabe ohne überflüssige Nachkommastellen: 15 %, aber 15,315 %. */
function prozent(wert: number): string {
  const stellen = Number.isInteger(wert) ? 0 : (String(wert).split('.')[1] ?? '').length
  return `${formatNumber(wert, Math.min(stellen, 3))} %`
}

/** Ein Euro-Betrag je hundert Euro, immer mit zwei Stellen. */
function euro(wert: number): string {
  return `${formatNumber(wert, 2)} €`
}

/**
 * Was von einer Dividende dieses Unternehmens tatsächlich ankommt.
 *
 * ## Warum das eine eigene Tafel verdient
 *
 * Weil das Ergebnis überrascht – in beide Richtungen. Solange ein Land
 * höchstens fünfzehn Prozent einbehält, kostet die Auslandsdividende genauso
 * viel wie eine deutsche: Die Anrechnung gleicht den Einbehalt exakt aus, und
 * von hundert Euro bleiben so oder so 73,63. Wer deshalb einen Bogen um
 * ausländische Dividendenzahler macht, spart nichts.
 *
 * Oberhalb von fünfzehn Prozent dagegen kostet jeder weitere Prozentpunkt
 * bares Geld, denn angerechnet wird nur bis dorthin. Bei der Schweiz sind das
 * zwanzig von hundert Euro – zurückzuholen allein über einen Antrag im
 * Sitzland. Auf dem Kontoauszug steht nur der Nettobetrag; die Lücke sieht man
 * dort nicht.
 *
 * ## Warum keine Steuerberatung
 *
 * Die Rechnung unterstellt: Sparer-Pauschbetrag ausgeschöpft, keine
 * Kirchensteuer, Streubesitz einer natürlichen Person. Sie zeigt die
 * Größenordnung und wo Geld hängen bleibt – sie ersetzt keine Beratung, und
 * das steht auch auf der Seite.
 */
export function Quellensteuertafel({
  befund,
  land,
  className,
}: {
  befund: Quellensteuerbefund
  /** Der ausgeschriebene Ländername. */
  land: string
  className?: string
}) {
  const deutschVoll = ABGELTUNGSTEUER * (1 + SOLI / 100)
  const offen = befund.rueckforderbar > 0

  return (
    <section aria-labelledby="quellensteuer" className={cn(className)}>
      <h2 id="quellensteuer" className="text-fg text-2xl font-bold">
        Quellensteuer
      </h2>
      <p className="text-fg-muted mt-2 leading-relaxed">
        {befund.satz > 0 ? (
          <>
            Bevor eine Dividende überhaupt auf dem Konto ankommt, behält das Sitzland des
            Unternehmens Steuer ein – hier: {land}. Was danach in Deutschland noch anfällt
            und was davon anrechenbar ist, steht darunter.
          </>
        ) : (
          <>
            Das Sitzland – hier: {land} – erhebt auf Dividenden keine Quellensteuer. Es
            bleibt bei der deutschen Abgeltungsteuer, und damit bei genau demselben
            Ergebnis wie bei jedem anderen Land, das höchstens fünfzehn Prozent einbehält.
          </>
        )}
      </p>

      <StatGrid className="mt-6">
        <Stat
          label={`Einbehalt ${land}`}
          value={prozent(befund.satz)}
          hint={
            befund.dba < befund.satz
              ? `Das Abkommen mit Deutschland begrenzt ihn auf ${prozent(befund.dba)}`
              : 'Das entspricht bereits dem Abkommenssatz'
          }
        />
        <Stat
          label="In Deutschland anrechenbar"
          value={prozent(befund.anrechenbar)}
          hint={`Höchstens ${ANRECHNUNG_HOECHSTSATZ} Prozentpunkte, § 32d Abs. 5 EStG`}
        />
        <Stat
          label="Nur auf Antrag zurück"
          value={prozent(befund.rueckforderbar)}
          tone={offen ? 'negative' : 'neutral'}
          hint={
            offen
              ? 'Rückforderung beim Fiskus des Sitzlands – ein eigener Antrag'
              : 'Nichts offen: Einbehalt und Abkommenssatz stimmen überein'
          }
        />
        <Stat
          label="Von 100 € bleiben"
          value={euro(befund.nettoJeHundert)}
          tone={befund.nettoJeHundert >= 73 ? 'neutral' : 'negative'}
          hint={
            offen
              ? `Mit erfolgreicher Rückforderung wären es ${euro(befund.nettoJeHundertMitAntrag)}`
              : 'Ohne weiteres Zutun'
          }
        />
      </StatGrid>

      <div className="text-fg-muted mt-6 space-y-4 leading-relaxed">
        <p>
          Die Rechnung, Schritt für Schritt, an hundert Euro Bruttodividende: Das Sitzland
          behält <strong>{euro(befund.satz)}</strong> ein. Deutschland besteuert die
          vollen hundert Euro mit {ABGELTUNGSTEUER} Prozent Abgeltungsteuer plus{' '}
          {formatNumber(SOLI, 1)} Prozent Solidaritätszuschlag, also mit{' '}
          {euro(deutschVoll)} – und rechnet davon {euro(befund.anrechenbar)} ausländische
          Steuer an. Es bleiben {euro(Math.max(0, deutschVoll - befund.anrechenbar))}{' '}
          deutsche Steuer und damit <strong>{euro(befund.nettoJeHundert)}</strong> für
          dich.
        </p>
        {befund.hinweis && <p>{befund.hinweis}</p>}
      </div>

      {offen && (
        <Callout
          variant="warning"
          title={`${prozent(befund.rueckforderbar)} liegen ohne Antrag beim ausländischen Fiskus`}
          className="mt-6"
        >
          <p>
            Diese Prozentpunkte sind in Deutschland <strong>nicht</strong> anrechenbar –
            der Höchstsatz von {ANRECHNUNG_HOECHSTSATZ} Prozentpunkten ist bereits
            ausgeschöpft. Zurückzuholen sind sie nur über einen Erstattungsantrag im
            Sitzland, mit eigenen Formularen und oft einer Bearbeitungsgebühr.
          </p>
          <p>
            Ob sich das lohnt, ist eine Rechenfrage: Bei tausend Euro Dividende im Jahr
            geht es um {euro((befund.rueckforderbar / 100) * 1000)}, bei hundert Euro um{' '}
            {euro((befund.rueckforderbar / 100) * 100)}. Deshalb wird bei kleinen
            Positionen selten ein Antrag gestellt – und deshalb ist es sinnvoll, das vor
            dem Kauf zu wissen und nicht danach.
          </p>
        </Callout>
      )}

      <p className="text-fg-subtle mt-4 text-xs leading-relaxed">
        Angaben zur Orientierung, keine Steuerberatung. Unterstellt sind ein
        ausgeschöpfter Sparer-Pauschbetrag, keine Kirchensteuer und Streubesitz einer
        natürlichen Person. Verbindlich sind die Sätze der amtlichen Übersicht:{' '}
        <a
          href={quellensteuerQuelle.url}
          rel="noopener noreferrer nofollow"
          target="_blank"
          className="hover:text-fg underline underline-offset-2"
        >
          {quellensteuerQuelle.label}
        </a>
        . Sie ändern sich durch Gesetzgebung im Sitzland.
      </p>
    </section>
  )
}
