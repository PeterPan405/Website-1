'use client'

import { Icon } from '@/components/ui/Icon'

/**
 * Öffnet den Suchdialog der Kopfzeile von einer beliebigen Stelle aus.
 *
 * Gebaut für die 404-Seite: Wer dort landet, hat meist etwas Bestimmtes
 * gesucht – eine veraltete Adresse, ein vertippter Pfad. Die naheliegendste
 * Weiterführung ist die Suche, nicht die Startseite. Der Dialog gehört
 * weiterhin allein der Kopfzeile; dieser Knopf schickt nur das Ereignis, auf
 * das sie lauscht.
 */
export function SucheOeffnenKnopf() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('fk-suche-oeffnen'))}
      className="fk-btn-secondary"
    >
      <Icon name="search" className="size-4" />
      Suche öffnen
    </button>
  )
}
