import { forwardRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '@/types/api'
import { ProductCard } from './ProductCard'

export const ProductCarousel = forwardRef<HTMLDivElement, { products: Product[] }>(
  ({ products }, ref) => {
    return (
      <div
        ref={ref}
        className="grid grid-flow-col gap-5 overflow-x-auto snap-x snap-mandatory pb-2
          auto-cols-[calc((100%-20px)/2)] md:auto-cols-[calc((100%-60px)/4)]
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map(p => (
          <div key={p.id} className="snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    )
  },
)
ProductCarousel.displayName = 'ProductCarousel'

export function CarouselNav({ trackRef }: { trackRef: React.RefObject<HTMLDivElement | null> }) {
  const scroll = (dir: -1 | 1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('a') as HTMLElement | null
    const step = card ? card.offsetWidth + 20 : 280
    track.scrollBy({ left: dir * step * 2, behavior: 'smooth' })
  }
  const base =
    'w-11 h-11 rounded-full border-[1.5px] border-primary text-primary bg-transparent inline-flex items-center justify-center transition-colors hover:bg-primary hover:text-bg active:scale-95'
  return (
    <div className="flex gap-2.5">
      <button type="button" aria-label="Previous" className={base} onClick={() => scroll(-1)}>
        <ChevronLeft size={18} />
      </button>
      <button type="button" aria-label="Next" className={base} onClick={() => scroll(1)}>
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
