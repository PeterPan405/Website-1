'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'

import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Icon } from '@/components/ui/Icon'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/cn'
import { mainNav, type NavItem } from '@/lib/navigation'
import { areaStyles, siteConfig } from '@/lib/site'

/**
 * Sticky Kopfzeile mit Mega-Menü (Desktop) und Panel-Navigation (Mobil).
 *
 * Bedienung per Tastatur ist vollständig abgedeckt: Die Menü-Auslöser sind
 * echte Buttons mit `aria-expanded`, Escape schließt das offene Menü, und ein
 * Fokuswechsel nach außen schließt es ebenfalls.
 */
export function Header() {
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
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
      if (event.key !== 'Escape') return
      setOpenMenu(null)
      setMobileOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
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
        'bg-canvas/80 sticky top-0 z-50 border-b backdrop-blur-md transition-shadow duration-200',
        scrolled ? 'border-border shadow-card' : 'border-transparent'
      )}
    >
      <div className="fk-container flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="text-fg hover:text-brand rounded-lg transition"
          aria-label={`Zur Startseite von ${siteConfig.name}`}
        >
          <Logo />
        </Link>

        {/* ---------------- Desktop-Navigation ---------------- */}
        <nav aria-label="Hauptnavigation" className="hidden lg:block">
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

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/lernen" className="fk-btn-primary hidden lg:inline-flex">
            Jetzt lernen
            <Icon name="arrow-right" className="size-4" />
          </Link>
          <button
            type="button"
            className="fk-btn-ghost size-10 rounded-full p-0 lg:hidden"
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
            className="border-border bg-canvas border-t lg:hidden"
          >
            <nav
              aria-label="Hauptnavigation (mobil)"
              className="fk-container max-h-[calc(100dvh-4rem)] overflow-y-auto py-4"
            >
              <ul className="space-y-1">
                {mainNav.map((item) => (
                  <li key={item.label}>
                    {item.children ? (
                      <details className="group open:border-border open:bg-surface rounded-xl border border-transparent">
                        <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-3 font-medium">
                          <span className="flex items-center gap-2.5">
                            <span
                              className={cn(
                                'size-2 rounded-full',
                                areaStyles[item.area].dot
                              )}
                              aria-hidden="true"
                            />
                            {item.label}
                          </span>
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
                        dotClass={areaStyles[item.area].dot}
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
  const style = areaStyles[item.area]

  if (!item.children) {
    return (
      <li>
        <Link
          href={item.href}
          aria-current={active ? 'page' : undefined}
          className={cn(
            'flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition',
            active ? 'bg-surface text-fg shadow-card' : 'text-fg-muted hover:text-fg'
          )}
        >
          <span className={cn('size-1.5 rounded-full', style.dot)} aria-hidden="true" />
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
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        // Öffnen nur bewusst per Klick, Enter oder Leertaste. Ein Öffnen schon
        // beim Fokussieren würde beim Durchtabben jedes Menü aufklappen – und
        // ein anschließendes Enter hätte es sofort wieder geschlossen.
        onClick={onToggle}
        className={cn(
          'flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition',
          active || isOpen
            ? 'bg-surface text-fg shadow-card'
            : 'text-fg-muted hover:text-fg'
        )}
      >
        <span className={cn('size-1.5 rounded-full', style.dot)} aria-hidden="true" />
        {item.label}
        <Icon
          name="chevron-down"
          className={cn('size-4 transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.99 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="fk-card absolute top-full left-0 mt-2 w-80 origin-top-left overflow-hidden p-2"
          >
            <p className="text-fg-subtle px-3 pt-2 pb-1 text-xs font-semibold tracking-wide uppercase">
              {item.label}
            </p>
            <ul>
              {item.children.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    aria-current={pathname === child.href ? 'page' : undefined}
                    className="group hover:bg-surface-muted flex items-start gap-3 rounded-xl px-3 py-2.5 transition"
                  >
                    <span
                      className={cn('mt-1.5 size-1.5 shrink-0 rounded-full', style.dot)}
                      aria-hidden="true"
                    />
                    <span>
                      <span className="text-fg block text-sm font-medium">
                        {child.label}
                      </span>
                      {child.hint && (
                        <span className="text-fg-muted block text-xs">{child.hint}</span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {item.footerLink && (
              <Link
                href={item.footerLink.href}
                className={cn(
                  'mt-1 flex items-center justify-between gap-2 rounded-xl px-3 py-2.5',
                  'hover:bg-surface-muted text-sm font-semibold transition',
                  style.text
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
  dotClass,
}: {
  href: string
  label: string
  pathname: string
  emphasis?: boolean
  dotClass?: string
}) {
  const active = pathname === href
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition',
        active ? 'bg-brand-soft text-brand font-semibold' : 'text-fg-muted hover:text-fg',
        emphasis && !active && 'text-fg font-semibold'
      )}
    >
      {dotClass && (
        <span className={cn('size-2 rounded-full', dotClass)} aria-hidden="true" />
      )}
      {label}
    </Link>
  )
}
