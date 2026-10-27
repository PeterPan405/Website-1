import type { ReactNode } from 'react'

import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

export type CalloutVariant = 'info' | 'tip' | 'warning' | 'draft'

const variantConfig: Record<
  CalloutVariant,
  { icon: IconName; wrapper: string; iconColor: string; defaultTitle: string }
> = {
  info: {
    icon: 'info',
    wrapper: 'bg-surface-muted',
    iconColor: 'text-fg',
    defaultTitle: 'Gut zu wissen',
  },
  tip: {
    icon: 'lightbulb',
    wrapper: 'bg-surface-muted',
    iconColor: 'text-fg',
    defaultTitle: 'Tipp',
  },
  warning: {
    icon: 'warning',
    wrapper: 'bg-surface-muted',
    iconColor: 'text-warning',
    defaultTitle: 'Achtung',
  },
  draft: {
    icon: 'clock',
    wrapper: 'bg-surface-muted',
    iconColor: 'text-fg-muted',
    defaultTitle: 'Noch in Arbeit',
  },
}

/** Hervorgehobener Hinweiskasten innerhalb von Fließtext. */
export function Callout({
  variant = 'info',
  title,
  children,
  className,
}: {
  variant?: CalloutVariant
  title?: string
  children: ReactNode
  className?: string
}) {
  const config = variantConfig[variant]

  return (
    /*
      Karte nur, wo etwas abgesetzt werden muss: das eine Grau, kein Rahmen,
      keine getönte Fläche. Farbe trägt allein das Warnzeichen (GESTALTUNG.md § 5).
    */
    <aside className={cn('rounded-card p-5 sm:p-6', config.wrapper, className)}>
      <div className="flex gap-3">
        <Icon
          name={config.icon}
          className={cn('mt-0.5 size-5 shrink-0', config.iconColor)}
        />
        <div className="min-w-0">
          <p className="text-fg text-sm font-semibold">{title ?? config.defaultTitle}</p>
          {/*
            Listen brauchen hier eigene Regeln.

            `space-y-2` greift nur auf die direkten Kinder – eine Liste ist ein
            einziges davon, ihre Punkte liefen also ohne Abstand ineinander, und
            die Aufzählungszeichen entfernt der Tailwind-Reset. Ohne diese Regeln
            liest sich eine Aufzählung im Kasten wie ein durchgehender Absatz.

            Der Punkt nimmt `currentColor`, damit er die Farbe der jeweiligen
            Kastenart annimmt statt gegen sie zu stehen.
          */}
          <div className="text-fg-muted mt-1.5 space-y-2 text-sm leading-relaxed [&_ul]:space-y-1.5 [&_ul>li]:relative [&_ul>li]:pl-4 [&_ul>li]:before:absolute [&_ul>li]:before:top-[0.55em] [&_ul>li]:before:left-0 [&_ul>li]:before:size-1.5 [&_ul>li]:before:rounded-full [&_ul>li]:before:bg-current [&_ul>li]:before:opacity-40">
            {children}
          </div>
        </div>
      </div>
    </aside>
  )
}
