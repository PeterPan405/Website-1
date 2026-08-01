/**
 * Der 404-Sammler des Kurslaufs.
 *
 * ## Das Problem, das er löst
 *
 * Ein einzelnes 404 im Protokoll eines Laufs, der 42-mal am Tag läuft, ist
 * unsichtbar. So blieben sechs umbenannte Yahoo-Kürzel (FISV → FI,
 * BK → BNY, …) monatelang unbemerkt: Jeder Lauf schrieb brav „antwortete mit
 * 404“ ins Protokoll, niemand las es, und die Titel froren still auf ihrem
 * letzten Stand ein. Aufgefallen ist es durch Zufall.
 *
 * Der Sammler macht aus dem Rauschen ein Signal: Er führt Buch, **an wie
 * vielen Kalendertagen** ein Symbol schon mit 404 antwortet, und meldet ab
 * drei Tagen gebündelt als Warnung am Lauf. Ein 404 heilt nicht von selbst –
 * anders als 429 oder eine Zeitüberschreitung, die deshalb ausdrücklich
 * nicht zählen und einen bestehenden Zähler auch nicht löschen.
 *
 * ## Warum Tage statt Läufe
 *
 * Der Halbstundenlauf würde einen Läufe-Zähler 42-mal am Tag erhöhen – und
 * jede Erhöhung wäre eine geänderte Datei, ein Commit, ein Anstoß der
 * Bereitstellung. Ein Tageszähler ändert die Datei höchstens einmal am Tag
 * je betroffenem Symbol; an Tagen ohne neue Ausfälle bleibt sie unberührt.
 *
 * Die Logik ist rein und getestet; der Kurslauf liefert nur die
 * Beobachtungen und schreibt das Ergebnis.
 */

/** Ein Symbol, das mit 404 antwortet: seit wann, zuletzt, an wie vielen Tagen. */
export interface Ausfalleintrag {
  seit: string
  zuletzt: string
  tage: number
}

/** Was ein Lauf über ein Symbol gelernt hat. */
export type Beobachtung = 'ok' | '404' | 'stoerung'

/** Ab so vielen Kalendertagen mit 404 wird gebündelt gewarnt. */
export const MELDESCHWELLE_TAGE = 3

export function schreibeAusfaelleFort(
  bisher: Readonly<Record<string, Ausfalleintrag>>,
  beobachtungen: ReadonlyMap<string, Beobachtung>,
  heute: string
): Record<string, Ausfalleintrag> {
  const neu: Record<string, Ausfalleintrag> = {}

  for (const [symbol, eintrag] of Object.entries(bisher)) {
    const beobachtung = beobachtungen.get(symbol)
    // 'ok' tilgt den Eintrag: Der Titel liefert wieder. Eine Störung oder ein
    // in diesem Lauf nicht abgefragtes Symbol (Wochenendlauf, NUR_ARTEN)
    // lässt den Stand unverändert – beides sagt nichts über das 404 aus.
    if (beobachtung === 'ok') continue
    neu[symbol] = eintrag
  }

  for (const [symbol, beobachtung] of beobachtungen) {
    if (beobachtung !== '404') continue
    const alt = neu[symbol]
    if (alt) {
      // Am selben Tag schon gezählt – nichts ändern, sonst schriebe der
      // Halbstundenlauf die Datei doch wieder 42-mal.
      if (alt.zuletzt !== heute) {
        neu[symbol] = { seit: alt.seit, zuletzt: heute, tage: alt.tage + 1 }
      }
    } else {
      neu[symbol] = { seit: heute, zuletzt: heute, tage: 1 }
    }
  }

  return neu
}

/** Die Symbole, die lange genug ausfallen, um gemeldet zu werden – hartnäckigste zuerst. */
export function auffaelligeAusfaelle(
  stand: Readonly<Record<string, Ausfalleintrag>>
): { symbol: string; eintrag: Ausfalleintrag }[] {
  return Object.entries(stand)
    .filter(([, eintrag]) => eintrag.tage >= MELDESCHWELLE_TAGE)
    .map(([symbol, eintrag]) => ({ symbol, eintrag }))
    .sort((a, b) => b.eintrag.tage - a.eintrag.tage || a.symbol.localeCompare(b.symbol))
}
