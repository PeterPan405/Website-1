/**
 * Gerüst für die Seite „Unternehmensphilosophie“.
 *
 * Der Text wird redaktionell verfasst. Diese Datei enthält deshalb nur die
 * Struktur: Überschriften plus je einen Hinweis, was in den Abschnitt gehört.
 *
 * ── So wird die Seite fertiggestellt ────────────────────────────────────────
 *  1. Unter dem jeweiligen Abschnitt `paragraphs` ergänzen, z. B.
 *     paragraphs: ['Erster Absatz …', 'Zweiter Absatz …'],
 *     Sobald `paragraphs` gefüllt ist, ersetzt der Text den Hinweis.
 *  2. Ist alles geschrieben: `PHILOSOPHY_PUBLISHED` auf `true` setzen.
 *
 * Solange die Seite nicht veröffentlicht ist, wird sie bewusst
 *  - nicht in die sitemap.xml aufgenommen und
 *  - mit `noindex` ausgeliefert.
 * Eine fast leere Seite im Index schadet der Sichtbarkeit der ganzen Domain,
 * weil Suchmaschinen sie als „thin content“ bewerten. Erreichbar bleibt sie über
 * die Fußzeile trotzdem – zum Korrekturlesen.
 */

/** Auf `true` setzen, sobald der Text vollständig verfasst ist. */
export const PHILOSOPHY_PUBLISHED = false

export interface PhilosophySection {
  /** Wird als <h2> ausgegeben. Frei anpassbar. */
  heading: string
  /** Arbeitshinweis. Erscheint nur, solange `paragraphs` leer ist. */
  hint: string
  /** Der fertige Text, ein Eintrag je Absatz. */
  paragraphs?: string[]
}

export const philosophySections: PhilosophySection[] = [
  {
    heading: 'Warum wir das machen',
    hint: 'Der Anlass: Welche Lücke soll IM Invests schließen? Was hat dich dazu gebracht, Finanzwissen zu vermitteln? Ein konkreter Auslöser wirkt hier stärker als eine allgemeine Mission.',
  },
  {
    heading: 'Woran wir glauben',
    hint: 'Die inhaltlichen Grundüberzeugungen zur Geldanlage – etwa zu Streuung, Kosten, Anlagehorizont oder dem Umgang mit Prognosen. Wichtig: Überzeugungen, die auch unbequem sein dürfen, machen eine Philosophie glaubwürdig.',
  },
  {
    heading: 'Wie wir arbeiten',
    hint: 'Die redaktionellen Grundsätze: Wie entstehen Inhalte, wie wird geprüft, wie geht IM Invests mit Fehlern und Korrekturen um? Auch die Frage, warum in drei Lernstufen aufgebaut wird, passt hierher.',
  },
  {
    heading: 'Was wir nicht tun',
    hint: 'Die Abgrenzung – oft der überzeugendste Abschnitt. Zum Beispiel: keine Produktempfehlungen, keine Renditeversprechen, keine Einzelfallberatung, keine Panikmache. Was ausgeschlossen wird, sagt mehr aus als jedes Versprechen.',
  },
  {
    heading: 'Wie wir uns finanzieren',
    hint: 'Bei Finanzinhalten der entscheidende Vertrauensfaktor: Woher kommt das Geld? Gibt es Provisionen, Werbung, Affiliate-Links, ein Abo? Wenn Interessenkonflikte bestehen, gehören sie offen benannt – wenn keine bestehen, ist genau das ein Argument.',
  },
]
