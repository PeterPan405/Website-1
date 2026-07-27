/**
 * Eine Zeile in einer Kennzahlentafel: Name, Zahl, Erklärung.
 *
 * Die Erklärung steht daneben, nicht darunter und nicht in einem
 * aufklappbaren Feld. Eine Zahl wie „Kurs-Gewinn-Verhältnis 34“ ist für
 * jemanden, der gerade anfängt, ohne den Satz daneben wertlos – und wer den
 * Satz erst aufklappen muss, liest ihn nicht.
 *
 * Auf schmalen Bildschirmen rutscht die Erklärung unter die Zahl, weil zwei
 * Spalten dort nur noch Wortfetzen wären.
 */
export function Kennzahlzeile({
  label,
  wert,
  erklaerung,
}: {
  label: string
  wert: string
  erklaerung: string
}) {
  return (
    <div className="border-border grid gap-1 border-t pt-4 first:border-0 first:pt-0 sm:grid-cols-[14rem_1fr] sm:gap-4">
      <div>
        <dt className="text-fg-subtle text-xs">{label}</dt>
        <dd className="text-fg mt-0.5 text-lg font-bold tabular-nums">{wert}</dd>
      </div>
      <p className="text-fg-muted text-sm leading-relaxed sm:self-center">{erklaerung}</p>
    </div>
  )
}
