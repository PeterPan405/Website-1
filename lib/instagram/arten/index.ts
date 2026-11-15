/**
 * Das Register der neuen Kartenarten (15.11.2026). Eine neue Art meldet
 * sich hier an – mit ihrem Typ in `NeueKarte` und ihrem Werkzeugsatz in
 * `NEUE_ARTEN`. `instagram-zahlenkarte.ts` fragt hier zuerst, bevor sie ihre
 * eigenen, älteren Arten durchgeht.
 *
 * Welche Art an welchem Tag dran ist, entscheidet nicht diese Datei, sondern
 * die tägliche Routine – Regel: nie die Form des Vortags (`form()`), und
 * über eine Woche möglichst viele verschiedene (`INSTAGRAM.md`, „Die
 * Kartenarten“).
 */
import { ampel, type Ampelkarte } from './ampel.ts'
import { geldfluss, type Geldflusskarte } from './geldfluss.ts'
import { kalender, type Kalenderkarte } from './kalender.ts'
import { kerzen, type Kerzenkarte } from './kerzen.ts'
import { kreise, type Kreiskarte } from './kreise.ts'
import { kurszettel, type Kurszettelkarte } from './kurszettel.ts'
import { netz, type Netzkarte } from './netz.ts'
import { punktraster, type Punktrasterkarte } from './punktraster.ts'
import type { Art } from './rahmen.ts'
import { rangwechsel, type Rangwechselkarte } from './rangwechsel.ts'
import { streuung, type Streuungkarte } from './streuung.ts'
import { tacho, type Tachokarte } from './tacho.ts'
import { wasserfall, type Wasserfallkarte } from './wasserfall.ts'

export type NeueKarte =
  | Kurszettelkarte
  | Punktrasterkarte
  | Kalenderkarte
  | Tachokarte
  | Wasserfallkarte
  | Geldflusskarte
  | Kreiskarte
  | Ampelkarte
  | Rangwechselkarte
  | Kerzenkarte
  | Streuungkarte
  | Netzkarte

export const NEUE_ARTEN: {
  [A in NeueKarte['art']]: Art<Extract<NeueKarte, { art: A }>>
} = {
  kurszettel,
  punktraster,
  kalender,
  tacho,
  wasserfall,
  geldfluss,
  kreise,
  ampel,
  rangwechsel,
  kerzen,
  streuung,
  netz,
}

export function istNeueKarte(k: { art?: string }): k is NeueKarte {
  return k.art !== undefined && k.art in NEUE_ARTEN
}

export function neueArt(k: NeueKarte): Art<NeueKarte> {
  return NEUE_ARTEN[k.art] as Art<NeueKarte>
}
