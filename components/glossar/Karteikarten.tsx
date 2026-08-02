'use client'

import { useState } from 'react'
import Link from 'next/link'

import {
  setzeKarteikartenZurueck,
  speichereGlossarKarte,
  useGlossarKarten,
} from '@/components/glossar/karteikarten-speicher'
import { beantworte, neueKarte, runde, stand, type Karte } from '@/lib/wiederholung'

/** Was die Karte zeigt – Vorder- und Rückseite eines Glossarbegriffs. */
export interface Karteibegriff {
  slug: string
  begriff: string
  kurz: string
}

/**
 * Das Glossar als Karteikasten.
 *
 * ## Warum Selbsteinschätzung statt Multiple-Choice
 *
 * Die Quiz-Wiederholung prüft mit Antwortmöglichkeiten – bei 126 Begriffen
 * mit je einem Erklärsatz gäbe es dafür nur künstliche Falschantworten.
 * Eine Karteikarte funktioniert wie ihr Vorbild aus Papier: Begriff lesen,
 * Antwort im Kopf formulieren, umdrehen, ehrlich einordnen. Das Ehrlichsein
 * lässt sich nicht erzwingen – muss es auch nicht, es gibt nichts zu
 * gewinnen außer dem eigenen Wortschatz.
 *
 * Die Abstände rechnet dieselbe Leitner-Logik wie bei den Quizfragen
 * (`lib/wiederholung.ts`): Gewusst rückt ein Fach weiter, nicht gewusst
 * zurück an den Anfang. Der Bestand liegt getrennt vom Quiz-Speicher.
 */
const RUNDENLAENGE = 12

export function Karteikarten({ begriffe }: { begriffe: Karteibegriff[] }) {
  const karten = useGlossarKarten()
  const [heute] = useState(() => new Date().toISOString().slice(0, 10))
  const [sitzung, setzeSitzung] = useState<Karteibegriff[] | null>(null)
  const [position, setzePosition] = useState(0)
  const [umgedreht, setzeUmgedreht] = useState(false)
  const [ergebnis, setzeErgebnis] = useState({ gewusst: 0, gesamt: 0 })

  const lage = stand(karten, heute)
  const jeSlug = new Map(begriffe.map((eintrag) => [`glossar:${eintrag.slug}`, eintrag]))

  function starten() {
    const auswahl = runde(
      karten,
      begriffe.map((eintrag) => `glossar:${eintrag.slug}`),
      heute,
      RUNDENLAENGE
    )
    const reihe = [
      ...auswahl.wiederholung.map((karte) => jeSlug.get(karte.id)),
      ...auswahl.neu.map((id) => jeSlug.get(id)),
    ].filter((eintrag): eintrag is Karteibegriff => Boolean(eintrag))
    setzeSitzung(reihe)
    setzePosition(0)
    setzeUmgedreht(false)
    setzeErgebnis({ gewusst: 0, gesamt: 0 })
  }

  function einordnen(gewusst: boolean) {
    if (!sitzung) return
    const eintrag = sitzung[position]
    const id = `glossar:${eintrag.slug}`
    const vorhanden = karten.find((karte: Karte) => karte.id === id)
    speichereGlossarKarte(beantworte(vorhanden ?? neueKarte(id, heute), gewusst, heute))
    setzeErgebnis((bisher) => ({
      gewusst: bisher.gewusst + (gewusst ? 1 : 0),
      gesamt: bisher.gesamt + 1,
    }))
    setzeUmgedreht(false)
    setzePosition((bisher) => bisher + 1)
  }

  // ------------------------------------------------------------ Runde läuft
  if (sitzung && position < sitzung.length) {
    const eintrag = sitzung[position]
    return (
      <div className="fk-card mx-auto max-w-xl p-6 sm:p-8">
        <p className="text-fg-subtle text-xs font-medium">
          Karte {position + 1} von {sitzung.length}
        </p>

        <p className="text-fg mt-6 text-center text-2xl font-bold">{eintrag.begriff}</p>

        {umgedreht ? (
          <>
            <p className="text-fg-muted mt-4 text-center leading-relaxed">
              {eintrag.kurz}
            </p>
            <p className="mt-2 text-center">
              <Link
                href={`/glossar#${eintrag.slug}`}
                className="text-learn text-sm underline underline-offset-2"
              >
                Im Glossar nachlesen
              </Link>
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => einordnen(false)}
                className="fk-btn-secondary justify-center"
              >
                Nicht gewusst
              </button>
              <button
                type="button"
                onClick={() => einordnen(true)}
                className="fk-btn-primary justify-center"
              >
                Gewusst
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-fg-subtle mt-4 text-center text-sm">
              Erkläre den Begriff in einem Satz – dann umdrehen und vergleichen.
            </p>
            <button
              type="button"
              onClick={() => setzeUmgedreht(true)}
              className="fk-btn-primary mx-auto mt-8 flex justify-center"
            >
              Umdrehen
            </button>
          </>
        )}
      </div>
    )
  }

  // ------------------------------------------------------------ Runde fertig
  if (sitzung) {
    return (
      <div className="fk-card mx-auto max-w-xl p-6 text-center sm:p-8">
        <h2 className="text-fg text-xl font-bold">Runde beendet</h2>
        <p className="text-fg-muted mt-3 leading-relaxed">
          {ergebnis.gewusst} von {ergebnis.gesamt} gewusst. Was nicht saß, kommt morgen
          wieder; was saß, in wachsenden Abständen.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={starten} className="fk-btn-primary">
            Nächste Runde
          </button>
          <Link href="/glossar" className="fk-btn-secondary">
            Zum Glossar
          </Link>
        </div>
      </div>
    )
  }

  // ------------------------------------------------------------ Startansicht
  return (
    <div className="fk-card mx-auto max-w-xl p-6 sm:p-8">
      <h2 className="text-fg text-xl font-bold">Dein Karteikasten</h2>
      <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="bg-surface-muted rounded-xl p-3">
          <dt className="text-fg-subtle text-xs">Begonnen</dt>
          <dd className="text-fg mt-1 text-lg font-bold">
            {lage.begonnen} / {begriffe.length}
          </dd>
        </div>
        <div className="bg-surface-muted rounded-xl p-3">
          <dt className="text-fg-subtle text-xs">Heute fällig</dt>
          <dd className="text-fg mt-1 text-lg font-bold">{lage.faellig}</dd>
        </div>
        <div className="bg-surface-muted rounded-xl p-3">
          <dt className="text-fg-subtle text-xs">Gefestigt</dt>
          <dd className="text-fg mt-1 text-lg font-bold">{lage.gefestigt}</dd>
        </div>
      </dl>
      <p className="text-fg-muted mt-4 text-sm leading-relaxed">
        Eine Runde sind bis zu {RUNDENLAENGE} Karten: erst die fälligen, dann neue
        Begriffe in Glossar-Reihenfolge. Der Stand bleibt in diesem Browser.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={starten} className="fk-btn-primary">
          {lage.faellig > 0
            ? `${Math.min(lage.faellig, RUNDENLAENGE)} Karten wiederholen`
            : 'Runde starten'}
        </button>
        {lage.begonnen > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Den ganzen Karteikasten-Stand löschen?')) {
                setzeKarteikartenZurueck()
              }
            }}
            className="fk-btn-ghost text-sm"
          >
            Von vorn beginnen
          </button>
        )}
      </div>
    </div>
  )
}
