/**
 * Aktien, deren hier geführte Notierung ein Hinterlegungsschein ist.
 *
 * Bewusst ohne Importe, damit `tests/` die Liste direkt laden kann – sie wird
 * an zwei Stellen gebraucht, und zwei Listen mit demselben Zweck laufen
 * auseinander.
 *
 * ## Warum diese Werte ausgenommen sind
 *
 * Ein American Depositary Receipt ist nicht die Aktie selbst, sondern ein
 * Zertifikat darauf – und das Bezugsverhältnis ist nicht immer eins zu eins.
 * Ein Papier von Taiwan Semiconductor verbrieft fünf Stammaktien, eines von
 * Alibaba acht. Die Aktienzahl aus der Pflichtmeldung zählt aber Stammaktien.
 *
 * Wer beides ungeprüft verrechnet, bekommt eine Marktkapitalisierung, die um
 * genau diesen Faktor danebenliegt – bei Taiwan Semiconductor also das
 * Fünffache. Das sähe aus wie eine Tatsache und wäre grob falsch.
 *
 * Betroffen ist nur die **US-Notierung**. Wo dieselbe Gesellschaft hier auch
 * mit ihrer Heimatnotierung steht, wird dort ganz normal gerechnet: `2303.TW`
 * ist die Stammaktie in Taipeh, und zu der passt die Stammaktienzahl.
 */
export const HINTERLEGUNGSSCHEINE: ReadonlySet<string> = new Set([
  'BABA', // Alibaba – ein Papier verbrieft acht Stammaktien
  'TSM', // Taiwan Semiconductor – fünf
  'UMC', // United Microelectronics – fünf
  'RYAAY', // Ryanair – fünf
  'ASML', // ASML – eins, aber Bilanz nach IFRS
  'SAP', // SAP – eins, Bilanz nach IFRS
  'NVO', // Novo Nordisk – eins, Bilanz nach IFRS
  'ARM', // Arm Holdings – eins, Bilanz nach IFRS
])
