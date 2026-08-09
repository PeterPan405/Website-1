/**
 * Löst den Alias `@/` auf, wenn ein Skript ohne Next.js läuft.
 *
 * ## Warum es das braucht
 *
 * `tsconfig.json` bildet `@/*` auf die Wurzel des Repositorys ab, und die
 * Module unter `data/` nutzen das durchgehend – 52 Dateien. Next.js kennt die
 * Abbildung, `node --experimental-strip-types` nicht: Ein Skript, das
 * `data/learn` lädt, scheitert an der ersten Zeile mit
 * `ERR_MODULE_NOT_FOUND: Cannot find package '@/data'`.
 *
 * Bisher hat sich jedes Skript darum herumgedrückt, indem es relativ
 * importierte (`../data/…`). Das geht, solange das geladene Modul selbst
 * keinen Alias verwendet – und genau daran endete der Weg, als die Lerndaten
 * gebraucht wurden: `data/learn/index.ts` holt seine 34 Themen über `@/`.
 *
 * ## Verwendung
 *
 *     node --experimental-strip-types --import ./scripts/alias-hook.mjs skript.ts
 */

import { register } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..')

register('./alias-aufloeser.mjs', import.meta.url, { data: { wurzel: WURZEL } })
