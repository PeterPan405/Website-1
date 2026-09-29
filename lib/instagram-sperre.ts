/**
 * Der Riegel gegen den Lauf, der die Lage jedes Mal verschlimmert.
 *
 * ## Der Anlass
 *
 * `scripts/instagram-veroeffentlichen.ts` sagt seit dem 5. September 2026 bei
 * `400: Queue is full` genau das Richtige:
 *
 *     Nicht noch einmal anstoßen, bevor das erledigt ist: Jeder Anstoß legt
 *     einen weiteren Eintrag in dieselbe volle Warteschlange.
 *
 * Am 20. September 2026 lief er trotzdem fünfmal – 00:58, 04:52, 07:55, 08:55
 * und 09:42 –, jedes Mal mit derselben Antwort, und jedes Mal legte er einen
 * weiteren Eintrag in dieselbe volle Warteschlange. Der Satz stand im
 * Protokoll und band niemanden, weil er an einen Menschen gerichtet war, der
 * nachts um eins nicht liest.
 *
 * **Ein Satz im Protokoll ist keine Regel** – dieselbe Lehre wie „Eine Regel
 * im Kommentar ist keine Regel", nur eine Ebene weiter draußen. Wo der Ablauf
 * von selbst weiterläuft, muss ihn etwas anhalten, das kein Mensch sein muss.
 *
 * ## Warum genau diese eine Sorte Fehler
 *
 * Nicht jeder Fehlschlag darf den nächsten Versuch verbieten. Ein
 * misslungener Upload, ein Aussetzer beim Dienst, eine Zeitüberschreitung:
 * Die trägt der nächste Lauf nach, und das ist die Regel des Hauses („Ein
 * roter Lauf ist ein Vorrat").
 *
 * Die volle Warteschlange ist die Ausnahme, weil der nächste Versuch nicht
 * folgenlos ist, sondern **schadet**. Deshalb sperrt nur sie, und sie sperrt
 * nur den laufenden Tag: Die Abhilfe sind zwei Klicks im Browser, und ist sie
 * getan, soll der Ablauf am nächsten Morgen ohne Zutun weiterlaufen. Eine
 * Sperre, die ein Mensch aufheben muss, wäre eine zweite Baustelle.
 *
 * ## Warum das hier steht und nicht im Workflow
 *
 * Damit es prüfbar ist. Die Entscheidung braucht keinen Netzzugang und keinen
 * Dienst – sie braucht eine Marke und ein Datum. Das Holen und Schreiben der
 * Marke bleibt im Workflow, dieselbe Trennung wie bei `lib/tageswecker.ts`
 * und `lib/pruefvergleich.ts`.
 */

/** Was auf dem Zweig `instagram-sperre` steht, wenn dort etwas steht. */
export interface Sperre {
  /** Der Tag, an dem die Warteschlange volllief – `JJJJ-MM-TT`. */
  tag: string
  /** Die Antwort des Dienstes, für das Protokoll des nächsten Laufs. */
  grund: string
}

/** Die erste Zeile ist der Tag, der Rest die Begründung. */
const TAG = /^(\d{4}-\d{2}-\d{2})\b/

/**
 * Liest die Marke.
 *
 * Gibt `null` zurück, wenn dort nichts Brauchbares steht – auch bei Unsinn.
 * Eine unlesbare Marke darf den Beitrag **nicht** aufhalten: Sie wäre sonst
 * ein Weg, den Ablauf versehentlich stillzulegen, und ein stillgelegter
 * Ablauf sieht aus wie ein ruhiger.
 */
export function sperreLesen(text: string | null | undefined): Sperre | null {
  if (!text) return null
  const zeilen = text.split('\n')
  const treffer = TAG.exec(zeilen[0].trim())
  if (!treffer) return null
  return { tag: treffer[1], grund: zeilen.slice(1).join('\n').trim() }
}

/** So sieht die Marke aus, die ein gesperrter Lauf hinterlässt. */
export function sperreSchreiben(tag: string, grund: string): string {
  return `${tag}\n${grund.trim()}\n`
}

/**
 * Darf heute noch einmal versucht werden?
 *
 * Gesperrt ist **nur** der Tag, an dem die Warteschlange volllief. Ein
 * späterer Tag läuft wieder an, ohne dass jemand etwas zurücksetzt; eine
 * Marke aus der Zukunft – falsch gestellte Uhr, von Hand geschrieben – sperrt
 * nichts, weil sie sonst nie abliefe.
 */
export function gesperrt(sperre: Sperre | null, heute: string): boolean {
  return sperre !== null && sperre.tag === heute
}

/** Der Satz, den ein übersprungener Lauf ins Protokoll schreibt. */
export function sperrhinweis(sperre: Sperre): string[] {
  return [
    `Heute (${sperre.tag}) lief die Warteschlange des Dienstes bereits voll.`,
    'Dieser Lauf schickt deshalb nichts – ein weiterer Eintrag in eine volle',
    'Warteschlange macht die Sache schlechter, nicht besser.',
    '',
    'Zu tun, im Browser bei Make: Szenario öffnen, Warteschlange leeren,',
    'dann einschalten. Danach läuft es am nächsten Morgen von selbst weiter;',
    'wer nicht warten will, stößt diesen Lauf von Hand an.',
    ...(sperre.grund ? ['', `Der Dienst antwortete: ${sperre.grund}`] : []),
  ]
}
