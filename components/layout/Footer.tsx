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
          <h2 className="text-fg text-sm font-semibold">
            Keine Anlageberatung – nur Wissensvermittlung
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
          <p className="text-fg-muted mt-2 text-sm leading-relaxed">
            <strong className="text-fg font-semibold">Hinweis zu den Daten:</strong> Kurse
            werden als Tagesschlusskurse dargestellt und sind keine Echtzeitdaten. Sie
            können von den Angaben anderer Anbieter abweichen und sind nicht für
            Handelszwecke bestimmt. Nachrichten geben den Stand ihrer Veröffentlichung
            wieder; die Verschuldungszahlen sind Näherungswerte und keine amtliche
            Statistik. Für Aktualität, Richtigkeit und Vollständigkeit wird keine Gewähr
            übernommen. Herkunft und Stand stehen jeweils direkt an der Angabe.
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
          </p>
        </div>
      </div>
    </footer>
  )
}
