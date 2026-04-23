import { useRef } from 'react'
import { useProducts } from '@/lib/queries'
import { ProductCarousel, CarouselNav } from '@/components/product/ProductCarousel'

export function EverydayEdit() {
  const { data: products, isLoading } = useProducts()
  const trackRef = useRef<HTMLDivElement>(null)

  return (
    <section className="py-[clamp(56px,8vw,112px)] bg-bg">
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
        <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
          <div>
            <span className="font-display font-bold uppercase tracking-[0.24em] text-[12px] text-primary/60">
              Best sellers
            </span>
            <h2 className="font-display font-black uppercase text-primary text-[clamp(32px,4.2vw,56px)] leading-none tracking-[-0.015em] mt-2">
              The everyday edit
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="/products"
              className="font-display font-bold uppercase tracking-wider text-[13px] text-primary border-b-[1.5px] border-primary pb-1"
            >
              Shop all →
            </a>
            <CarouselNav trackRef={trackRef} />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-border-soft/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <ProductCarousel ref={trackRef} products={products ?? []} />
        )}
      </div>
    </section>
  )
}
