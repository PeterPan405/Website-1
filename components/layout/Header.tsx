'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'

import { SearchDialog } from '@/components/layout/SearchDialog'
import { SprachUmschalter } from '@/components/layout/SprachUmschalter'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Icon } from '@/components/ui/Icon'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/cn'
import { mainNav, type NavItem } from '@/lib/navigation'
import { siteConfig } from '@/lib/site'

/**
 * Sticky Kopfzeile mit Mega-Menü (Desktop) und Panel-Navigation (Mobil).
 *
 * Einträge mit Untermenü bestehen aus zwei Bedienelementen: Der Name ist ein
 * Verweis auf die Bereichsseite, der Pfeil daneben klappt das Menü auf. Mit der
 * Maus genügt weiterhin das Darüberfahren.
 *
 * Bedienung per Tastatur ist vollständig abgedeckt: Die Menü-Auslöser sind
 * echte Buttons mit `aria-expanded`, Escape schließt das offene Menü, und ein
 * Fokuswechsel nach außen schließt es ebenfalls.
 */
export function Header() {
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [lastPathname, setLastPathname] = useState(pathname)

  // Bei jedem Seitenwechsel alle Menüs schließen – auch bei Vor- und
  // Zurück-Navigation im Browser. Die Anpassung erfolgt während des Renderns
  // statt in einem Effekt, damit das Menü nicht für einen Frame offen bleibt.
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setOpenMenu(null)
    setMobileOpen(false)
    setSearchOpen(false)
  }

  // Dezenter Schatten, sobald die Seite gescrollt ist.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Solange das mobile Panel offen ist, darf der Seiteninhalt nicht scrollen.
  useEffect(() => {
    if (!mobileOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileOpen])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // Strg+K beziehungsweise Cmd+K oeffnet die Suche. Der Browser belegt die
      // Kombination selbst (Fokus in die Adresszeile), deshalb preventDefault.
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpenMenu(null)
        setMobileOpen(false)
        setSearchOpen(true)
        return
      }
      if (event.key !== 'Escape') return
      setOpenMenu(null)
      setMobileOpen(false)
    }
    /*
      Andere Seiten können die Suche über ein Ereignis öffnen – die 404-Seite
      tut das. Ein Ereignis statt eines geteilten Zustands, weil die Kopfzeile
      die einzige Besitzerin des Dialogs bleiben soll.
    */
    function beiSuchwunsch() {
      setOpenMenu(null)
      setMobileOpen(false)
      setSearchOpen(true)
    }
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('fk-suche-oeffnen', beiSuchwunsch)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('fk-suche-oeffnen', beiSuchwunsch)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [])

  function openWithHover(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenMenu(label)
  }

  function closeWithDelay() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    // Kurze Verzögerung, damit der Zeiger die Lücke zum Panel überbrücken kann.
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120)
  }

  return (
    <header
      className={cn(
        // Milchglas: 82 % Seitengrund plus Weichzeichner (GESTALTUNG.md § 6).
        'sticky top-0 z-50 border-b bg-[color-mix(in_srgb,var(--c-canvas)_82%,transparent)] backdrop-blur-xl transition-colors duration-150',
        scrolled ? 'border-border' : 'border-transparent'
      )}
    >
      {/*
        Über die volle Bildschirmbreite statt in der Inhaltsspalte: Logo ganz
        links, die Knöpfe ganz rechts, die Navigation dazwischen.

        `justify-between` und **nicht** ein Raster mit `1fr auto 1fr`: Beim
        Raster stand das Menü zwar exakt in der Bildschirmmitte, aber die
        Wortmarke ist schmaler als die vier Bedienelemente rechts – die Lücke
        links wurde damit sichtbar größer als die rechte. `justify-between`
        verteilt den Freiraum gleichmäßig auf beide Lücken; das Menü sitzt
        dadurch optisch mittig, weil beide Abstände gleich sind.

        Die Breitenfrage von früher bleibt damit gelöst: Sieben Menüpunkte,
        Wortmarke und vier Bedienelemente brauchen zusammen rund 1.230 Pixel
        und passten nie in die 1.088 Pixel der Inhaltsspalte – `fk-btn` trägt
        ein `whitespace-nowrap`, also schrumpfte nichts, der Knopf wanderte
        aus der Spalte heraus. Volle Breite ist dafür der großzügigere Weg
        als eine zweite, etwas breitere Spalte.
      */}
      <div className="mx-auto flex h-16 w-full max-w-[120rem] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="text-fg hover:text-brand rounded-md transition"
          aria-label={`Zur Startseite von ${siteConfig.name}`}
        >
          <Logo />
        </Link>

        {/* ---------------- Desktop-Navigation ---------------- */}
        <nav aria-label="Hauptnavigation" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <NavEntry
                key={item.label}
                item={item}
                pathname={pathname}
                isOpen={openMenu === item.label}
                onOpen={() => openWithHover(item.label)}
                onClose={closeWithDelay}
                onToggle={() =>
                  setOpenMenu((current) => (current === item.label ? null : item.label))
                }
              />
            ))}
          </ul>
        </nav>

        {/*
          Enger auf dem Telefon: Mit dem kräftigeren Schriftzug (27.10.2026)
          ragte die Leiste bei 375 px um 8 px über den Rand – jede Seite ließ
          sich seitlich schieben (`npm run breite`).
        */}
        <div className="flex items-center gap-0.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="fk-btn-ghost size-10 rounded-full p-0"
          >
            <Icon name="search" className="size-5" />
            <span className="sr-only">Suche öffnen</span>
          </button>
          <SprachUmschalter />
          <ThemeToggle />
          {/*
            Kein „Jetzt lernen"-Knopf mehr (27.10.2026, „sieht nach sehr viel
            aus"): „Lernen" steht zwei Zentimeter daneben im Menü.
          */}
          <button
            type="button"
            className="fk-btn-ghost size-10 rounded-full p-0 xl:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <Icon name={mobileOpen ? 'close' : 'menu'} className="size-6" />
            <span className="sr-only">
              {mobileOpen ? 'Navigation schließen' : 'Navigation öffnen'}
            </span>
          </button>
        </div>
      </div>

      {/* ---------------- Mobile Navigation ---------------- */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="border-border bg-canvas border-t xl:hidden"
          >
            <nav
              aria-label="Hauptnavigation (mobil)"
              className="mx-auto max-h-[calc(100dvh-4rem)] w-full max-w-[120rem] overflow-y-auto px-4 py-4 sm:px-6"
            >
              <ul className="space-y-1">
                {mainNav.map((item) => (
                  <li key={item.label}>
                    {item.children ? (
                      <details className="group open:bg-surface-muted rounded-md">
                        <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-3 font-medium">
                          <span>{item.label}</span>
                          <Icon
                            name="chevron-down"
                            className="text-fg-subtle size-5 transition group-open:rotate-180"
                          />
                        </summary>
                        <ul className="space-y-1 px-3 pb-3">
                          <li>
                            <MobileLink
                              href={item.href}
                              label={`Übersicht ${item.label}`}
                              pathname={pathname}
                              emphasis
                            />
                          </li>
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <MobileLink
                                href={child.href}
                                label={child.label}
                                pathname={pathname}
                              />
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : (
                      <MobileLink
                        href={item.href}
                        label={item.label}
                        pathname={pathname}
                      />
                    )}
                  </li>
                ))}
              </ul>
              <Link href="/lernen" className="fk-btn-primary mt-4 w-full">
                Jetzt lernen
                <Icon name="arrow-right" className="size-4" />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}

/** Prüft, ob ein Navigationsziel den aktuellen Pfad enthält. */
function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavEntry({
  item,
  pathname,
  isOpen,
  onOpen,
  onClose,
  onToggle,
}: {
  item: NavItem
  pathname: string
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onToggle: () => void
}) {
  const panelId = useId()
  const active = isActive(pathname, item.href)

  if (!item.children) {
    return (
      <li>
        <Link
          href={item.href}
          aria-current={active ? 'page' : undefined}
          className={cn(
            /*
              Navigation: 15 px; nicht gewählt grau/500, gewählt Text/600 mit
              einem 2-px-Strich in der Textfarbe darunter.
            */
            'relative block px-3 py-2 text-base transition-colors',
            active
              ? 'text-fg after:bg-fg font-semibold after:absolute after:inset-x-3 after:-bottom-px after:h-0.5'
              : 'text-fg-muted hover:text-fg font-medium'
          )}
        >
          {item.label}
        </Link>
      </li>
    )
  }

  return (
    <li
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onBlur={(event) => {
        // Schließen, sobald der Fokus die Gruppe komplett verlässt.
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          onClose()
        }
      }}
    >
      {/*
        Zwei Bedienelemente in einer Pille: Der Name führt auf die
        Bereichsseite, der Pfeil klappt das Menü auf.

        Vorher war das Ganze ein Button, der ausschließlich auf- und zuklappte –
        ein Klick auf „Märkte“ führte nirgendwohin, obwohl es die Seite gibt.
        Ein Element kann aber nicht beides sein: Ein Verweis, der beim Klick
        stattdessen ein Menü öffnet, führt in die Irre, und ein Button, der
        navigiert, lässt sich weder im neuen Tab öffnen noch als Ziel kopieren.

        Beim Zeigen mit der Maus öffnet weiterhin die ganze Gruppe – das
        übernimmt das umschließende <li>. Der Pfeil ist für alle da, die keine
        Maus benutzen: Mit Tastatur oder auf einem Touchgerät gibt es kein
        Darüberfahren.
      */}
      <div
        className={cn(
          'relative flex items-center text-base transition-colors',
          active
            ? 'text-fg after:bg-fg font-semibold after:absolute after:inset-x-3 after:-bottom-px after:h-0.5'
            : isOpen
              ? 'text-fg font-medium'
              : 'text-fg-muted hover:text-fg font-medium'
        )}
      >
        <Link
          href={item.href}
          aria-current={active ? 'page' : undefined}
          className="py-2 pr-1 pl-3"
        >
          {item.label}
        </Link>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          // Öffnen nur bewusst per Klick, Enter oder Leertaste. Ein Öffnen schon
          // beim Fokussieren würde beim Durchtabben jedes Menü aufklappen – und
          // ein anschließendes Enter hätte es sofort wieder geschlossen.
          onClick={onToggle}
          className="py-2 pr-3 pl-0.5"
        >
          <Icon
            name="chevron-down"
            className={cn('size-4 transition-transform', isOpen && 'rotate-180')}
          />
          <span className="sr-only">
            Untermenü {item.label} {isOpen ? 'schließen' : 'öffnen'}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.99 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            /*
              Schwebende Flächen sind die Ausnahme von „randlos“: Sie liegen
              über fremdem Inhalt und brauchen Kante und Schatten, um sich
              davon zu lösen – wie jedes Systemmenü.
            */
            className="border-border bg-surface shadow-lift absolute top-full left-0 mt-2 w-60 origin-top-left overflow-hidden rounded-md border py-1.5"
          >
            {/*
              Ohne Überschrift und ohne Erklärzeile je Eintrag (27.10.2026):
              Der Betreiber fand das Lernen-Menü mit 13 Einträgen samt
              Unterzeilen „einfach viel zu viel". Ein Menü ist ein Wegweiser,
              kein Inhaltsverzeichnis – das steht auf der Seite dahinter.
            */}
            <ul>
              {item.children.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    aria-current={pathname === child.href ? 'page' : undefined}
                    className="text-fg hover:bg-surface-muted mx-1.5 flex min-h-11 items-center rounded-sm px-3 text-base transition-colors"
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
            {item.footerLink && (
              <Link
                href={item.footerLink.href}
                className={cn(
                  'border-border mt-1.5 flex min-h-11 items-center justify-between gap-2 border-t px-4.5 pt-1.5',
                  'text-brand text-base font-semibold transition hover:underline'
                )}
              >
                {item.footerLink.label}
                <Icon name="arrow-right" className="size-4" />
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

function MobileLink({
  href,
  label,
  pathname,
  emphasis = false,
}: {
  href: string
  label: string
  pathname: string
  emphasis?: boolean
}) {
  const active = pathname === href
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex min-h-11 items-center gap-2.5 rounded-md px-3 py-2.5 text-base transition-colors',
        active
          ? 'bg-surface-muted text-fg font-semibold'
          : 'text-fg-muted hover:text-fg font-medium',
        emphasis && !active && 'text-fg font-semibold'
      )}
    >
      {label}
    </Link>
  )
}
