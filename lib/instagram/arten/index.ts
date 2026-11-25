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
import { abstuerze, type Absturzkarte } from './abstuerze.ts'
import { ampel, type Ampelkarte } from './ampel.ts'
import { balkenliste, type Balkenlistenkarte } from './balkenliste.ts'
import { damalsheute, type Damalsheutekarte } from './damalsheute.ts'
import { deckblatt, type Deckblattkarte } from './deckblatt.ts'
import { DOSSIER_ARTEN, dossier, type Dossierkarte } from './dossier.ts'
import { erholung, type Erholungkarte } from './erholung.ts'
import { geldfluss, type Geldflusskarte } from './geldfluss.ts'
import { jahreskacheln, type Jahreskachelkarte } from './jahreskacheln.ts'
import { kalender, type Kalenderkarte } from './kalender.ts'
import { kerzen, type Kerzenkarte } from './kerzen.ts'
import { kreise, type Kreiskarte } from './kreise.ts'
import { kuchen, type Kuchenkarte } from './kuchen.ts'
import { kurszettel, type Kurszettelkarte } from './kurszettel.ts'
import { laenderkarte, type Laenderkartenkarte } from './laenderkarte.ts'
import { linie, type Linienkarte } from './linie.ts'
import { marktkarte, type Marktkartenkarte } from './marktkarte.ts'
import { netz, type Netzkarte } from './netz.ts'
import { punktraster, type Punktrasterkarte } from './punktraster.ts'
import type { Art } from './rahmen.ts'
import { rangwechsel, type Rangwechselkarte } from './rangwechsel.ts'
import { schere, type Scherenkarte } from './schere.ts'
import { schaetzfrage, type Schaetzfragekarte } from './schaetzfrage.ts'
import { stammbaum, type Stammbaumkarte } from './stammbaum.ts'
import { stapel, type Stapelkarte } from './stapel.ts'
import { streuung, type Streuungkarte } from './streuung.ts'
import { tacho, type Tachokarte } from './tacho.ts'
import { wasserfall, type Wasserfallkarte } from './wasserfall.ts'
import { weltuhr, type Weltuhrkarte } from './weltuhr.ts'
import { zeitkapsel, type Zeitkapselkarte } from './zeitkapsel.ts'
import { zyklus, type Zykluskarte } from './zyklus.ts'

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
  | Marktkartenkarte
  | Laenderkartenkarte
  | Weltuhrkarte
  | Schaetzfragekarte
  | Damalsheutekarte
  | Stapelkarte
  | Stammbaumkarte
  | Zeitkapselkarte
  | Zykluskarte
  | Linienkarte
  | Absturzkarte
  | Dossierkarte
  | Erholungkarte
  | Deckblattkarte
  | Kuchenkarte
  | Scherenkarte
  | Balkenlistenkarte
  | Jahreskachelkarte

export const NEUE_ARTEN: {
  [A in NeueKarte['art']]: Art<Extract<NeueKarte, { art: A }>>
} = {
  kurszettel,
  kuchen,
  schere,
  balkenliste,
  jahreskacheln,
  deckblatt,
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
  marktkarte,
  laenderkarte,
  weltuhr,
  schaetzfrage,
  damalsheute,
  stapel,
  stammbaum,
  zeitkapsel,
  zyklus,
  linie,
  abstuerze,
  dossier,
  erholung,
}

Object.assign(DOSSIER_ARTEN, NEUE_ARTEN)

export function istNeueKarte(k: { art?: string }): k is NeueKarte {
  return k.art !== undefined && k.art in NEUE_ARTEN
}

export function neueArt(k: NeueKarte): Art<NeueKarte> {
  return NEUE_ARTEN[k.art] as Art<NeueKarte>
}
