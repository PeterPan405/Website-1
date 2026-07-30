/**
 * Klopft die japanische Meldeplattform EDINET mit einem Schlüssel ab.
 *
 * ## Warum dieses Skript weniger tut als sein koreanisches Gegenstück
 *
 * Weil die beiden Schnittstellen verschieden gebaut sind, und der Unterschied
 * entscheidet über den Aufwand.
 *
 * DART liefert den fertigen Abschluss als JSON: eine Anfrage je Unternehmen,
 * Umsatz und Gewinn stehen als Felder darin. `scripts/dart-abrufen.ts` liest
 * sie und ist fertig.
 *
 * EDINET liefert **Dokumente**. Der Weg zu einer Umsatzzahl führt über: die
 * Liste eines Einreichungstages abrufen, darin den Jahresbericht des richtigen
 * Unternehmens finden, das zugehörige ZIP herunterladen, darin die
 * XBRL-Instanz suchen und aus ihr den Posten lesen – je Unternehmen, und
 * Jahresberichte werden über das ganze Jahr verteilt eingereicht. Das ist
 * machbar, aber es sind mehrere hundert Zeilen, die auf ein Format treffen,
 * das sich hier nicht ein einziges Mal ausprobieren lässt: Ohne Schlüssel
 * antwortet EDINET mit `401, invalid subscription key`.
 *
 * Ungeprüfter Code, der in den Kennzahlenbestand schreibt, ist die falsche
 * Wahl. Eine falsche Umsatzzahl fällt auf der Aktienseite nicht auf – sie
 * sieht aus wie eine Tatsache.
 *
 * ## Was dieses Skript deshalb tut
 *
 * Es prüft mit dem hinterlegten Schlüssel, ob die Schnittstelle antwortet, und
 * berichtet, was sie liefert: wie viele Dokumente an einem Stichtag
 * eingereicht wurden, wie viele davon Jahresberichte sind und ob unter ihnen
 * Unternehmen dieses Katalogs vorkommen. Damit ist die offene Frage
 * beantwortet, die seit der Asien-Sonde im Raum steht – nämlich ob sich der
 * Aufwand überhaupt lohnt –, und der zweite Schritt kann auf einer belegten
 * Grundlage geplant werden statt auf einer Vermutung.
 *
 * Geschrieben wird nichts. Dieses Skript verändert keine Datei.
 *
 * ## Der Schlüssel
 *
 * Kostenlos über die Registrierung bei EDINET. Er gehört in die
 * GitHub-Secrets als `EDINET_API_KEY` – nicht in eine Datei im Repository und
 * nicht in eine Chatnachricht. Workflow-Protokolle sind lesbar; dieses Skript
 * gibt den Schlüssel an keiner Stelle aus.
 *
 * Aufruf: `npm run edinet`
 */

const SCHLUESSEL = process.env.EDINET_API_KEY?.trim() || undefined
const LISTE_URL = 'https://api.edinet-fsa.go.jp/api/v2/documents.json'

/**
 * Der Formularcode des Jahresberichts (有価証券報告書).
 *
 * Er ist der einzige Bericht mit vollständigem Jahresabschluss. Quartals- und
 * Halbjahresberichte tragen eigene Codes; sie hier mitzuzählen ergäbe eine zu
 * hohe Trefferzahl und damit ein zu optimistisches Bild.
 */
const JAHRESBERICHT = '030000'

interface Dokument {
  docID?: string
  /** Wertpapierkennnummer, fünfstellig – die ersten vier sind das Börsenkürzel. */
  secCode?: string
  filerName?: string
  formCode?: string
  docDescription?: string
}

/**
 * Macht aus einer EDINET-Wertpapierkennnummer das Börsenkürzel.
 *
 * EDINET führt fünfstellige Nummern, die letzte Stelle ist eine Null:
 * Toyota steht als `72030`, an der Börse als `7203`. Ohne das Abschneiden
 * findet die Zuordnung kein einziges Unternehmen – und das sähe aus wie „diese
 * Quelle kennt unsere Titel nicht“ statt wie ein Formatfehler.
 */
export function zuBoersenkuerzel(secCode: string | undefined): string | null {
  if (!secCode || !/^\d{5}$/.test(secCode)) return null
  return `${secCode.slice(0, 4)}.T`
}

async function main(): Promise<void> {
  if (!SCHLUESSEL) {
    console.log(
      '[edinet] Kein EDINET_API_KEY hinterlegt – nichts zu tun.\n' +
        '         Der Schlüssel ist über die Registrierung bei EDINET kostenlos zu\n' +
        '         bekommen und gehört in die GitHub-Secrets, nicht ins Repository.'
    )
    return
  }

  const { marketDefinitions } = await import('../data/markets.ts')
  const japanisch = new Set(
    marketDefinitions
      .filter((eintrag) => eintrag.kind === 'stock' && eintrag.sitzland === '392')
      .map((eintrag) => eintrag.ticker)
  )
  console.log(`[edinet] ${japanisch.size} japanische Titel im Katalog.`)

  /*
    Fünf Stichtage statt einem. Jahresberichte japanischer Gesellschaften
    häufen sich Ende Juni – das Geschäftsjahr endet überwiegend im März, und
    die Frist läuft drei Monate. Ein einzelner Stichtag träfe womöglich einen
    Tag ohne Einreichungen und ließe die Quelle leer aussehen.
  */
  const stichtage = ['06-24', '06-25', '06-26', '06-27', '06-30'].map(
    (tag) => `${new Date().getUTCFullYear()}-${tag}`
  )

  let gesamt = 0
  let berichte = 0
  const bekannte: string[] = []

  for (const tag of stichtage) {
    const adresse = new URL(LISTE_URL)
    adresse.searchParams.set('date', tag)
    adresse.searchParams.set('type', '2')
    adresse.searchParams.set('Subscription-Key', SCHLUESSEL)

    // Nur der Statuscode ins Protokoll – die Adresse trägt den Schlüssel.
    const antwort = await fetch(adresse, {
      headers: { 'User-Agent': 'IM-Invests Datenabruf' },
    })
    if (!antwort.ok) {
      console.error(`[edinet] ${tag}: Status ${antwort.status}`)
      continue
    }

    const gelesen = (await antwort.json()) as { results?: Dokument[] }
    const dokumente = gelesen.results ?? []
    gesamt += dokumente.length

    for (const dokument of dokumente) {
      if (dokument.formCode !== JAHRESBERICHT) continue
      berichte += 1
      const kuerzel = zuBoersenkuerzel(dokument.secCode)
      if (kuerzel && japanisch.has(kuerzel)) {
        bekannte.push(`${kuerzel} (${dokument.filerName ?? '—'})`)
      }
    }

    console.log(`[edinet] ${tag}: ${dokumente.length} Dokumente.`)
    await new Promise((weiter) => setTimeout(weiter, 400))
  }

  console.log(
    `\n[edinet] Ergebnis über ${stichtage.length} Stichtage:\n` +
      `  Dokumente insgesamt: ${gesamt}\n` +
      `  davon Jahresberichte: ${berichte}\n` +
      `  davon aus diesem Katalog: ${bekannte.length}`
  )
  if (bekannte.length > 0) {
    console.log(`  ${bekannte.join(', ')}`)
    console.log(
      '\n[edinet] Die Zuordnung trägt. Der nächste Schritt wäre, je Dokument\n' +
        '         das ZIP zu laden und die XBRL-Instanz darin auszuwerten – erst\n' +
        '         dann entstehen Zahlen. Dieses Skript schreibt bewusst nichts.'
    )
  } else if (berichte > 0) {
    console.log(
      '\n[edinet] Jahresberichte gibt es, aber keiner gehört zu einem hier\n' +
        '         geführten Titel. Entweder liegen die Stichtage falsch, oder die\n' +
        '         Zuordnung über die Wertpapierkennnummer stimmt nicht.'
    )
  }
}

await main()
