import { cn } from '@/lib/utils'

export const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export function SizeSelector({
  active,
  onChange,
  sizes = DEFAULT_SIZES,
}: {
  active: string
  onChange: (size: string) => void
  sizes?: string[]
}) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {sizes.map(s => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={cn(
            'h-11 rounded-lg border text-[13px] font-display font-bold uppercase tracking-wider transition-all',
            active === s
              ? 'bg-primary text-bg border-primary'
              : 'bg-transparent text-primary border-border-soft hover:border-primary',
          )}
        >
          {s}
        </button>
      ))}
    </div>
  )
}
