/**
 * Gemeinsames Inhaltsmodell für Lerntexte und News-Artikel.
 *
 * Inhalte liegen als strukturierte Blöcke vor, nicht als HTML-Strings. Das hat
 * drei Vorteile: Die Überschriftenhierarchie lässt sich zentral erzwingen (für
 * SEO wichtig), es kann kein unerwünschtes Markup eingeschleust werden, und
 * derselbe Datensatz ließe sich später auch für andere Ausgabekanäle nutzen.
 */

import type { FigureId } from '@/data/figures'

export type ContentCalloutVariant = 'info' | 'tip' | 'warning'

export type ContentBlock =
  /**
   * Zwischenüberschrift. Auf Detailseiten ist das <h1> immer der Seitentitel,
   * daher beginnen Inhaltsüberschriften bei Ebene 2 – Ebenen dürfen nicht
   * übersprungen werden.
   */
  | { type: 'heading'; level: 2 | 3; text: string }
  /** Fließtext. `**fett**` wird beim Rendern in <strong> umgesetzt. */
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'callout'; variant: ContentCalloutVariant; title?: string; items: string[] }
  | { type: 'quote'; text: string; source?: string }
  | { type: 'table'; caption?: string; head: string[]; rows: string[][] }
  /** Formel mit Erläuterung – für Zins-, Inflations- und Rentenrechnungen. */
  | {
      type: 'formula'
      expression: string
      description: string
      /**
       * Ein Rechner, der mit **genau diesem Beispiel** öffnet.
       *
       * Optional, und das ist die Hauptaussage: Zu den meisten Formeln auf
       * dieser Website gibt es keinen Rechner – für MACD, True Range oder den
       * Herfindahl-Index wäre einer auch sinnlos. Wo es aber einen gibt, ist
       * der Weg vom gelesenen Beispiel zum leeren Eingabefeld genau die
       * Stelle, an der die meisten aufhören: Wer die drei Zahlen aus dem Text
       * abtippen müsste, tippt sie nicht ab.
       *
       * `werte` wird über `rechnerlink()` in die Raute geschrieben. Welche
       * Schlüssel ein Rechner kennt, steht bei ihm im `useVorbelegung`-Aufruf;
       * unbekannte werden dort stillschweigend übergangen.
       *
       * ## Nur verlinken, wo der Rechner rechnet, was die Formel sagt
       *
       * Das ist die eigentliche Regel, und sie ist beim Einbauen sofort
       * aufgefallen: An der Grundformel `Endkapital = Startkapital ×
       * (1 + Zinssatz)^Jahre` stand ein Verweis mit 10.000 € zu 5 Prozent über
       * 10 Jahre. Die Formel ergibt 16.289 €, der Zinsrechner zeigte 16.470 € –
       * er verzinst **monatlich**, nicht jährlich.
       *
       * Beide Zahlen sind richtig, und ein Leser, der sie nebeneinander sieht,
       * hält eine davon für falsch. Der Verweis steht deshalb nur noch an der
       * Sparplanformel, wo die monatliche Verzinsung genau das ist, was die
       * Formel beschreibt. Ein vorbelegter Rechner, der etwas anderes ausrechnet
       * als der Text darüber, ist schlechter als kein Verweis.
       */
      rechner?: {
        /** Pfad ohne Raute, z. B. `/rechner/zinsrechner`. */
        pfad: string
        /** Die Werte des Beispiels aus dem Text darüber. */
        werte: Record<string, string | number>
        /** Beschriftung des Verweises – sagt, was den Leser dort erwartet. */
        text: string
      }
    }
  /** Kompakte Faktenliste, z. B. „Risiko: hoch“. */
  | { type: 'keyfacts'; items: { label: string; value: string }[] }
  /**
   * Erklärgrafik aus `data/figures.ts`.
   *
   * Hier steht nur die Kennung, nicht die Zeichnung: Die Inhaltsdaten dürfen
   * keine Komponenten kennen. Ohne `caption` gilt die Unterschrift aus dem
   * Verzeichnis – die passende Formulierung gehört zur Grafik, nicht zur
   * Stelle, an der sie eingesetzt wird.
   */
  | { type: 'figure'; figure: FigureId; caption?: string }

/** Erzeugt aus einem Überschriftentext eine stabile Sprungmarke. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replaceAll('ä', 'ae')
    .replaceAll('ö', 'oe')
    .replaceAll('ü', 'ue')
    .replaceAll('ß', 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
