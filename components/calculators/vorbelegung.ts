'use client'

import { useEffect } from 'react'

import { leseRaute } from '@/lib/rechner-vorbelegung'

/**
 * Werte aus der Raute in einen Rechner übernehmen.
 *
 * ## Warum in einem Effekt und nicht beim ersten Rendern
 *
 * Weil die Seite statisch gebaut wird. Beim Bauen gibt es keine Raute; der
 * Server rendert die Voreinstellungen. Läse der Browser die Raute schon im
 * ersten Rendern, stünden dort andere Zahlen als im ausgelieferten HTML, und
 * React beanstandet das zu Recht als Abweichung.
 *
 * Der Ablauf ist deshalb: Voreinstellungen anzeigen, danach die Adresse lesen
 * und übernehmen. Sichtbar ist das nicht – der Effekt läuft vor dem ersten
 * Anstrich, den ein Auge wahrnimmt.
 *
 * ## Warum auch auf `hashchange` gehört wird
 *
 * Weil zwei Verweise auf denselben Rechner mit verschiedenen Zahlen die Seite
 * **nicht** neu laden – der Browser springt nur zur neuen Raute. Ohne diesen
 * Zuhörer bliebe der Rechner beim ersten Beispiel stehen, und der zweite
 * Verweis wirkte kaputt.
 */
export function useVorbelegung(anwenden: (werte: Record<string, string>) => void) {
  useEffect(() => {
    const uebernehmen = () => {
      const raute = window.location.hash
      if (raute === '' || raute === '#') return
      const werte = leseRaute(raute)
      if (Object.keys(werte).length === 0) return
      anwenden(werte)
    }

    uebernehmen()
    window.addEventListener('hashchange', uebernehmen)
    return () => window.removeEventListener('hashchange', uebernehmen)
    /*
      `anwenden` bewusst nicht in der Liste: Die Rechner geben eine Funktion
      mit, die bei jedem Rendern neu entsteht. Stünde sie hier, liefe der
      Effekt bei jeder Eingabe erneut und setzte die eben getippte Zahl auf den
      Wert aus der Adresse zurück – ein Feld, in das man nicht schreiben kann.
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
