'use client'

import { useState } from 'react'

import { Icon } from '@/components/ui/Icon'
import { bandDateiname, bandDokument, meldungszahl, type Band } from '@/lib/ausgabenband'
import { erzeugePdf } from '@/lib/pdf'
import { erstelltAm } from '@/lib/rechtshinweis'
import { siteConfig } from '@/lib/site'

/**
 * Ein Band zum Herunterladen.
 *
 * ## Warum erst beim Klick gebaut wird
 *
 * Ein Jahresband ist ein paar hundert Kilobyte, und ihn bei jedem Seitenaufruf
 * zu erzeugen hieße, ihn für die neunundneunzig Besucher mitzurechnen, die ihn
 * nicht herunterladen. Beim Klick sind es Millisekunden.
 *
 * ## Warum die Ausgaben mitgeliefert werden und nicht nachgeladen
 *
 * Weil die Website statisch ausgeliefert wird – es gibt keinen Server, den man
 * fragen könnte. Die Ausgaben kommen also ohnehin mit der Seite; hier stehen
 * sie in derselben Fassung, aus der auch das Archiv gebaut wird. Zwei Quellen
 * für denselben Text gäbe es nicht.
 */
export function Bandknopf({ band }: { band: Band }) {
  const [laeuft, setLaeuft] = useState(false)

  function laden() {
    setLaeuft(true)
    try {
      const bytes = erzeugePdf(
        bandDokument(band, erstelltAm(new Date()), siteConfig.name)
      )
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' })
      const adresse = URL.createObjectURL(blob)
      const verweis = document.createElement('a')
      verweis.href = adresse
      verweis.download = bandDateiname(band)
      verweis.rel = 'noopener'
      document.body.append(verweis)
      verweis.click()
      verweis.remove()
      /*
        Nicht sofort freigeben: Der Klick stößt den Download nur an, der Browser
        liest die Adresse erst danach. Dieselbe Falle wie beim Ergebnisblatt der
        Rechner – dort hat sie schon einmal zugeschlagen.
      */
      window.setTimeout(() => URL.revokeObjectURL(adresse), 60_000)
    } finally {
      setLaeuft(false)
    }
  }

  return (
    <button
      type="button"
      onClick={laden}
      disabled={laeuft}
      className="border-border hover:border-brand hover:bg-surface flex w-full items-center justify-between gap-4 rounded-lg border p-4 text-left transition"
    >
      <span>
        <span className="text-fg block font-semibold">{band.label}</span>
        <span className="text-fg-muted mt-0.5 block text-sm">
          {band.ausgaben.length} {band.ausgaben.length === 1 ? 'Ausgabe' : 'Ausgaben'},{' '}
          {meldungszahl(band)} Meldungen
          {band.art === 'jahr' ? ' – der ganze Jahrgang' : ''}
        </span>
      </span>
      <Icon
        name="download"
        className="text-fg-subtle size-5 shrink-0"
        aria-hidden="true"
      />
    </button>
  )
}
