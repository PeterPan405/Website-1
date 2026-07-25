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
    wrapper: 'border-brand/25 bg-brand-soft',
    iconColor: 'text-brand',
    defaultTitle: 'Gut zu wissen',
  },
  tip: {
    icon: 'lightbulb',
    wrapper: 'border-success/25 bg-success-soft',
    iconColor: 'text-success',
    defaultTitle: 'Tipp',
  },
  warning: {
    icon: 'warning',
    wrapper: 'border-warning/30 bg-warning-soft',
    iconColor: 'text-warning',
    defaultTitle: 'Achtung',
  },
  draft: {
    icon: 'clock',
    wrapper: 'border-border-strong border-dashed bg-surface-muted',
    iconColor: 'text-fg-subtle',
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
    <aside className={cn('rounded-card border p-4 sm:p-5', config.wrapper, className)}>
      <div className="flex gap-3">
        <Icon
          name={config.icon}
          className={cn('mt-0.5 size-5 shrink-0', config.iconColor)}
        />
        <div className="min-w-0">
          <p className="text-fg text-sm font-semibold">{title ?? config.defaultTitle}</p>
          <div className="text-fg-muted mt-1.5 space-y-2 text-sm leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </aside>
  )
}
