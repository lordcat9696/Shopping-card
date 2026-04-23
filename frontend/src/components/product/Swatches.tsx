import { useState } from 'react'
import type { ProductColor } from '@/types/api'

export function Swatches({
  colors,
  onChange,
}: {
  colors: ProductColor[]
  onChange?: (c: ProductColor) => void
}) {
  const [active, setActive] = useState(() => colors.find(c => c.isDefault)?.name ?? colors[0]?.name)
  return (
    <div className="flex gap-1.5 mt-2.5">
      {colors.map(c => (
        <button
          key={c.name}
          type="button"
          title={c.name}
          aria-label={c.name}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setActive(c.name)
            onChange?.(c)
          }}
          className={`w-4 h-4 rounded-full cursor-pointer transition-transform hover:scale-[1.18] border-[1.5px] border-white/90 shadow-[0_0_0_1px_var(--color-border-soft)]
            ${active === c.name ? 'shadow-[0_0_0_1.5px_var(--color-primary)]' : ''}`}
          style={{ backgroundColor: c.hexCode }}
        />
      ))}
    </div>
  )
}
