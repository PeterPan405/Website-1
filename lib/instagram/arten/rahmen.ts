/**
 * Der Rahmen der neuen Kartenarten (15.11.2026).
 *
 * Der Betreiber nach Wochen mit Chart, Kurve und Zahlenstrahl: „Überleg dir
 * mal neue Designs … statt Chart und Zahlenstrahlen“ – und dann: „Alle …
 * bauen und dann für zukünftige Themen benutzen … Das soll ja voll
 * automatisiert werden.“ Jede neue Art liegt in einer eigenen Datei in
 * diesem Ordner, meldet sich in `index.ts` an und zeichnet nur ihre Grafik;
 * Kopf, Titel, Unterzeile, Seitenzähler und Fußzeile kommen von hier.
 *
 * Der Stil folgt der Chartkarte, die der Betreiber abgenommen hat: Absender
 * klein links oben, Titel groß und links bündig, die Pointe in Navy, keine
 * große fette Zahl als Blickfang und keine Pillen (Betreiber, 14.11.2026:
 * „immer diese großen Zahlen in fett gedruckt … macht es sehr nach KI
 * aussehend“).
 *
 * Achtung, Kreis-Import: Diese Dateien holen ihre Werkzeuge aus
 * `instagram-zahlenkarte.ts`, und die holt das Register von hier. Deshalb
 * werden die Werkzeuge nur **in** Funktionen benutzt, nie auf oberster Ebene
 * einer Datei – dort wären sie beim ersten Laden noch nicht belegt.
 */
import type { ReactElement } from 'react'
import { createElement as h } from 'react'

import {
  STIL,
  STIL_RAND,
  ZK_BREITE,
  ZK_HOEHE,
  stilBlock,
  type KarteGemeinsam,
} from '../../instagram-zahlenkarte.ts'

export type Element = ReactElement

/** Eine neue Kartenart: wie viele Seiten, wie eine Seite aussieht, was die Prüfung beanstandet. */
export interface Art<K> {
  seiten(k: K): number
  seite(k: K, logo: string, nr: number): Element
  pruefe(k: K): string[]
}

/** Alles, was jede neue Karte zusätzlich zum Gemeinsamen trägt. */
export interface NeuGemeinsam extends KarteGemeinsam {
  /** Eine Zeile unter dem Titel: was die Grafik zeigt. */
  unterzeile: string
}

/** Oberkante der Grafik auf Seite 1 und auf den Folgeseiten. */
export const OBEN_ERSTE = 440
export const OBEN_FOLGE = 230
/** Unterkante der Grafik – darunter Satz und Fußzeile. */
/* Als Zahl, nicht aus ZK_HOEHE gerechnet: siehe „Kreis-Import“ oben. */
export const UNTEN = 1350 - 120

export function rahmen(
  k: NeuGemeinsam,
  logo: string,
  o: {
    seite: number
    seiten: number
    inhalt: Element[]
    /** Überschrift einer Folgeseite – klein, statt des großen Titels. */
    kopf?: string
    /** Ein Satz unten auf der Seite, der sie zuspitzt. */
    satz?: string
  }
): Element {
  const erste = o.seite === 1
  return h(
    'div',
    {
      style: {
        width: ZK_BREITE,
        height: ZK_HOEHE,
        display: 'flex',
        position: 'relative',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
      },
    },
    /* Signet und Wortmarke oben mittig, wie bei allen Karten im Hausstil
       (Betreiber 16.11.2026: „Logo war sonst immer oben in der Mitte“). */
    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: 48,
          left: 0,
          width: ZK_BREITE,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Montserrat',
        },
      },
      h('img', { src: logo, width: 44, height: 44 }),
      h(
        'div',
        { style: { fontWeight: 700, fontSize: 26, color: STIL.tinte, marginLeft: 12 } },
        'IM Invests'
      )
    ),
    ...(o.seiten > 1
      ? [
          h(
            'div',
            {
              style: {
                position: 'absolute',
                top: 58,
                right: STIL_RAND,
                display: 'flex',
                fontFamily: 'Montserrat',
                fontSize: 19,
                color: STIL.hellgrau,
              },
            },
            `${o.seite} / ${o.seiten}`
          ),
        ]
      : []),
    ...(erste
      ? [
          h(
            'div',
            {
              style: {
                position: 'absolute',
                top: 130,
                left: STIL_RAND,
                right: STIL_RAND,
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Montserrat',
                fontWeight: 800,
                /* Lange Titelzeilen kleiner, sonst bricht eine dritte Zeile in die Unterzeile. */
                fontSize: Math.max(...k.titel.map((t) => t.text.length)) > 20 ? 62 : 74,
                lineHeight: 1.08,
                letterSpacing: -2,
              },
            },
            ...k.titel.map((t) =>
              h(
                'div',
                { style: { display: 'flex', color: t.gruen ? STIL.navy : STIL.tinte } },
                t.text
              )
            )
          ),
          stilBlock(k.unterzeile, {
            top: 312,
            left: STIL_RAND,
            right: STIL_RAND,
            fontSize: 26,
            lineHeight: 1.4,
            color: STIL.grau,
          }),
        ]
      : o.kopf
        ? [
            stilBlock(o.kopf, {
              top: 130,
              left: STIL_RAND,
              right: STIL_RAND,
              fontSize: 48,
              fontWeight: 800,
              letterSpacing: -1,
              lineHeight: 1.15,
              color: STIL.tinte,
            }),
          ]
        : []),
    ...o.inhalt,
    ...(o.satz
      ? [
          stilBlock(o.satz, {
            top: ZK_HOEHE - 140,
            left: STIL_RAND,
            right: STIL_RAND,
            fontSize: 26,
            fontWeight: 700,
            lineHeight: 1.35,
            color: STIL.tinte,
          }),
        ]
      : []),
    ...(o.seite < o.seiten
      ? [
          stilBlock('Weiter  →', {
            top: ZK_HOEHE - 58,
            right: STIL_RAND,
            fontSize: 18,
            fontWeight: 700,
            color: STIL.grau,
          }),
        ]
      : []),
    stilBlock(k.fusszeile, {
      top: ZK_HOEHE - 56,
      left: STIL_RAND,
      right: o.seite < o.seiten ? 200 : STIL_RAND,
      fontSize: 15,
      color: STIL.hellgrau,
    })
  )
}

/** Prüfungen, die jede neue Art teilt. */
export function pruefeGemeinsam(k: NeuGemeinsam): string[] {
  const f: string[] = []
  if (k.titel.length > 2 || k.titel.some((t) => t.text.length > 24))
    f.push('Der Titel hat höchstens zwei Stücke zu je 24 Zeichen – eine Zeile je Stück.')
  if (k.unterzeile.length > 100)
    f.push(`Unterzeile hat ${k.unterzeile.length} Zeichen – höchstens 100.`)
  return f
}

/** „+4,2 %“, „−12,7 %“ – echtes Minus, deutsches Komma. */
export function prozent(v: number, stellen = 1): string {
  const t = Math.abs(v).toLocaleString('de-DE', {
    minimumFractionDigits: stellen,
    maximumFractionDigits: stellen,
  })
  return `${Number(Math.abs(v).toFixed(stellen)) === 0 ? '' : v > 0 ? '+' : '−'}${t} %`
}

/** Eine Zahl deutsch: 1.234,5 */
export function zahl(v: number, stellen = 0): string {
  return v.toLocaleString('de-DE', {
    minimumFractionDigits: stellen,
    maximumFractionDigits: stellen,
  })
}
