import Link from 'next/link'

import { Icon } from '@/components/ui/Icon'
import { Logo } from '@/components/ui/Logo'
import { footerNav } from '@/lib/navigation'
import { siteConfig } from '@/lib/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-border bg-surface mt-24 border-t">
      <div className="fk-container py-14">
        {/*
          Vier Spalten: zwei für die Logo-Spalte, je eine für die beiden
          Link-Gruppen. Bei fünf Spalten – dem Stand mit drei Gruppen – bliebe
          rechts eine leere Spalte stehen.
        */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            {/*
              In der Fußzeile größer als in der Kopfzeile: Hier ist Platz, und
              erst in dieser Größe sind die vier Figuren und der Schriftzug im
              Ring wirklich zu erkennen. Bei 40 Pixeln verschwimmt das Zeichen
              zu einem Ring.
            */}
            <Logo size="large" />
            <p className="text-fg-muted mt-4 max-w-sm text-sm leading-relaxed">
              {siteConfig.description}
            </p>

            {/*
              Die Profile öffnen fremde Seiten, deshalb in einem neuen Tab. Dazu
              gehört `rel="noreferrer"`: Ohne das erfährt die Zielseite über den
              Referrer, von welcher Unterseite aus jemand geklickt hat.

              Das Icon allein ist keine Beschriftung – der Name steht deshalb als
              `sr-only` daneben und wird von Screenreadern vorgelesen.
            */}
            <nav aria-labelledby="footer-social" className="mt-6">
              <h2 id="footer-social" className="sr-only">
                IM Invests auf anderen Plattformen
              </h2>
              <ul className="flex items-center gap-3">
                {siteConfig.socialLinks.map((profil) => (
                  <li key={profil.href}>
                    <a
                      href={profil.href}
                      target="_blank"
                      rel="noreferrer"
                      className="border-border text-fg-muted hover:border-brand hover:text-brand inline-flex size-10 items-center justify-center rounded-full border transition"
                    >
                      <Icon name={profil.icon} className="size-5" />
                      <span className="sr-only">{profil.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/*
              Der Bewertungslink steht als Text, nicht als Symbol.

              Bei YouTube und Instagram genügt das Zeichen – es ist bekannt und
              bedeutet nur eines. Ein Google-Symbol beantwortet die Frage nicht,
              worauf es führt: auf die Suche? auf die Karte? auf ein Formular?
              Hier führt es auf ein Formular, und das gehört dazugeschrieben.
            */}
            <p className="mt-6 text-sm">
              <a
                href={siteConfig.googleProfil.bewertung}
                target="_blank"
                rel="noreferrer"
                className="text-fg-muted hover:text-brand transition"
              >
                IM Invests bei Google bewerten
              </a>
            </p>
          </div>

          {footerNav.map((group) => (
            <nav key={group.title} aria-labelledby={`footer-${group.title}`}>
              <h2
                id={`footer-${group.title}`}
                className="text-fg-subtle text-xs font-semibold tracking-wide uppercase"
              >
                {group.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-fg-muted hover:text-brand text-sm transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/*
          Finanzinhalte brauchen einen klaren Hinweis, dass hier keine
          Anlageberatung stattfindet. Der Text steht auf jeder Seite.
        */}
        <div className="rounded-card border-border bg-surface-muted mt-12 border p-5">
          {/*
            „Steuerberatung“ steht jetzt auch in der Überschrift. Wer den Kasten nur
            überfliegt, liest die Überschrift und sonst nichts – und die Rechner zur
            Abgeltungsteuer und zur Vorabpauschale sind kein Randthema dieser Seite.
          */}
          <h2 className="text-fg text-sm font-semibold">
            Keine Anlage- oder Steuerberatung – nur Wissensvermittlung
          </h2>
          <p className="text-fg-muted mt-2 text-sm leading-relaxed">
            Alle Inhalte dieser Website dienen der allgemeinen Information und Bildung.
            Sie stellen keine Anlage-, Rechts- oder Steuerberatung dar und berücksichtigen
            weder deine persönliche Situation noch deine Anlageziele. Kurse, Kennzahlen
            und Rechenergebnisse sind Beispielwerte beziehungsweise Schätzungen. Jede
            Kapitalanlage ist mit Risiken verbunden, bis zum vollständigen Verlust des
            eingesetzten Geldes.
          </p>
          {/*
            Dieser Hinweis stand hier als pauschales „alles ist Demo“. Das ist
            überholt, seit die Wechselkurse von der EZB kommen – und eine falsche
            Angabe über die eigenen Daten ist kein Schutz, sondern ein Mangel.

            Die jetzige Fassung sagt, was tatsächlich gilt: Tagesschlusskurse
            statt Echtzeit, mögliche Abweichungen gegenüber anderen Quellen, keine
            Gewähr – und der Verweis darauf, dass jede einzelne Angabe an Ort und
            Stelle ihre Herkunft nennt. Welche Kurse noch Beispielwerte sind,
            steht dort, wo sie stehen, statt hier in einer Pauschale.
          */}
          {/*
            Dieser Absatz stand als eigene Kachel oben auf der Rechnerseite.
            Auf Wunsch hierher verlegt: Die Aufklärung gehört gesammelt ans
            Seitenende, nicht als Kasten zwischen die Inhalte – inhaltlich
            ändert sich nichts, jeder Rechner behält zudem seinen eigenen
            Methodik- und Grenzen-Abschnitt.
          */}
          <p className="text-fg-muted mt-2 text-sm leading-relaxed">
            <strong className="text-fg font-semibold">
              Modellrechnungen, keine Prognosen:
            </strong>{' '}
            Alle Rechner arbeiten mit Annahmen, die du selbst vorgibst – vor allem Rendite
            und Inflationsrate. Das Ergebnis ist genau so verlässlich wie diese Annahmen;
            Steuern und Produktkosten sind nicht vollständig berücksichtigt (Näheres im
            Methodik-Abschnitt der jeweiligen Seite). Rechne bei langen Zeiträumen mehrere
            Szenarien – die Spannweite der Ergebnisse ist die eigentliche Information,
            nicht die einzelne Zahl.
          </p>
          {/*
            Kennzeichnung nach Art. 50 Abs. 4 der KI-Verordnung (EU) 2024/1689,
            anwendbar seit dem 2. August 2026. Streng genommen greift die
            Ausnahme für redaktionell geprüfte Inhalte mit benanntem
            Verantwortlichen – der Hinweis steht trotzdem hier, weil er wahr
            ist und die Ausnahme nicht erst vor einer Behörde begründet werden
            soll. Ausführlich im Impressum unter „Einsatz künstlicher
            Intelligenz“.
          */}
          <p className="text-fg-muted mt-2 text-sm leading-relaxed">
            <strong className="text-fg font-semibold">
              Einsatz künstlicher Intelligenz:
            </strong>{' '}
            Texte und Erklärgrafiken dieser Website entstehen mit Unterstützung von
            KI-Werkzeugen und werden vor der Veröffentlichung von einem Menschen
            inhaltlich geprüft; die redaktionelle Verantwortung liegt beim Betreiber
            (siehe{' '}
            <Link href="/impressum" className="hover:text-brand underline">
              Impressum
            </Link>
            ). Beim Besuch der Website läuft keine KI – es gibt keinen Chatbot, und die
            Rechner arbeiten mit festen, offengelegten Formeln.
          </p>
          <p className="text-fg-muted mt-2 text-sm leading-relaxed">
            <strong className="text-fg font-semibold">Hinweis zu den Daten:</strong> Kurse
            werden als Tagesschlusskurse dargestellt und sind keine Echtzeitdaten. Sie
            können von den Angaben anderer Anbieter abweichen und sind nicht für
            Handelszwecke bestimmt. Nachrichten geben den Stand ihrer Veröffentlichung
            wieder; die Verschuldungszahlen sind Näherungswerte und keine amtliche
            Statistik. Für Aktualität, Richtigkeit und Vollständigkeit wird keine Gewähr
            übernommen. Herkunft und Stand stehen jeweils direkt an der Angabe.
          </p>
          {/*
            Steuern brauchen einen eigenen Absatz, nicht nur das Wort „Steuerberatung“
            in der Aufzählung darüber.

            Der Grund steht im Steuerberatungsgesetz: Geschäftsmäßige Hilfe in
            Steuersachen ist den dort genannten Berufen vorbehalten (§ 2 StBerG). Diese
            Website rechnet Abgeltungsteuer, Vorabpauschale und Sparerpauschbetrag aus
            und schreibt über die Besteuerung von Aktien, ETFs und Renten – also genau
            an der Grenze entlang. Was sie tut, ist Information an unbestimmt viele
            Leser, keine Anwendung des Steuerrechts auf einen konkreten Einzelfall. Der
            Absatz sagt das ausdrücklich, statt es dem Leser zu überlassen.

            Die zwei Sätze zur Rückwirkung und zur verbindlichen Auskunft stehen nicht
            aus Vorsicht da, sondern weil beides stimmt und für den Leser wichtiger ist
            als der Haftungssatz am Ende: Steuerrecht ändert sich, und wer Sicherheit
            braucht, bekommt sie beim Finanzamt (§ 89 Abs. 2 AO) – nicht hier.
          */}
          <p className="text-fg-muted mt-2 text-sm leading-relaxed">
            <strong className="text-fg font-semibold">Hinweis zu Steuerfragen:</strong>{' '}
            Steuerliche Erläuterungen, Beispielrechnungen und die Ergebnisse der Rechner
            sind allgemeine und unverbindliche Information. Sie stellen keine
            geschäftsmäßige Hilfeleistung in Steuersachen im Sinne des
            Steuerberatungsgesetzes dar und ersetzen nicht die Beratung durch eine
            Steuerberaterin, einen Steuerberater oder eine andere zur Hilfeleistung in
            Steuersachen befugte Person. Wie ein Sachverhalt tatsächlich besteuert wird,
            hängt von den persönlichen Verhältnissen ab und kann sich durch Gesetzgebung
            und Rechtsprechung ändern, unter Umständen auch rückwirkend. Verbindliche
            Auskunft erteilen allein das zuständige Finanzamt und die Angehörigen der
            steuerberatenden Berufe. Für Entscheidungen, die auf steuerliche Angaben
            dieser Website gestützt werden, wird keine Haftung übernommen.
          </p>
        </div>

        <div className="border-border text-fg-subtle mt-8 flex flex-col gap-3 border-t pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. {siteConfig.slogan}
          </p>
          <p>
            <Link href="/glossar" className="hover:text-brand transition">
              Glossar
            </Link>
            <span aria-hidden="true"> · </span>
            <Link href="/quellen" className="hover:text-brand transition">
              Quellen
            </Link>
            <span aria-hidden="true"> · </span>
            <Link href="/impressum" className="hover:text-brand transition">
              Impressum
            </Link>
            <span aria-hidden="true"> · </span>
            <Link href="/datenschutz" className="hover:text-brand transition">
              Datenschutz
            </Link>
            <span aria-hidden="true"> · </span>
            <Link href="/keine-cookies" className="hover:text-brand transition">
              Keine Cookies
            </Link>
            <span aria-hidden="true"> · </span>
            <Link href="/barrierefreiheit" className="hover:text-brand transition">
              Barrierefreiheit
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
