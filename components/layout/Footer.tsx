import Link from 'next/link'

import { Logo } from '@/components/ui/Logo'
import { footerNav } from '@/lib/navigation'
import { siteConfig } from '@/lib/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-border bg-surface mt-24 border-t">
      <div className="fk-container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="text-fg-muted mt-4 max-w-sm text-sm leading-relaxed">
              {siteConfig.description}
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
          <p className="text-fg-muted mt-2 text-sm leading-relaxed">
            <strong className="text-fg font-semibold">Hinweis zu den Daten:</strong> Die
            Kurs-, News- und Verschuldungsdaten dieser Version sind{' '}
            <strong className="text-fg font-semibold">Demo-Daten</strong> und keine echten
            Marktdaten.
          </p>
        </div>

        <div className="border-border text-fg-subtle mt-8 flex flex-col gap-3 border-t pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. {siteConfig.slogan}
          </p>
          <p>
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
