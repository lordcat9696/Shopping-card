import { ArrowRight } from 'lucide-react'
import { ProductSilhouette } from '@/components/product/ProductSilhouette'
import { useCategories } from '@/lib/queries'

const CARD_DATA: Record<string, { silhouette: 'brief' | 'bikini' | 'boyshort' | 'chill'; gradient: string; badge?: string }> = {
  'ao-thun':    { silhouette: 'brief',    gradient: 'linear-gradient(155deg, #4A7A5A 0%, #1F3D2F 100%)', badge: 'New' },
  'ao-polo':    { silhouette: 'brief',    gradient: 'linear-gradient(155deg, #D4B07A 0%, #8C6C3E 100%)' },
  'ao-tanktop': { silhouette: 'brief',    gradient: 'linear-gradient(155deg, #7A9887 0%, #2E4A38 100%)' },
  'quan-short': { silhouette: 'boyshort', gradient: 'linear-gradient(155deg, #E6C89C 0%, #8A7150 100%)', badge: 'Bán chạy' },
  'vay':        { silhouette: 'chill',    gradient: 'linear-gradient(155deg, #A78BB5 0%, #5C3E68 100%)' },
}

export function ShopByStyle() {
  const { data: categories } = useCategories()
  const cats = categories ?? []

  return (
    <section className="py-[clamp(56px,8vw,112px)]">
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
        <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
          <div>
            <span className="font-display font-bold uppercase tracking-[0.24em] text-[12px] text-primary/60">
              Choose your fit
            </span>
            <h2 className="font-display font-black uppercase text-primary text-[clamp(32px,4.2vw,56px)] leading-none tracking-[-0.015em] mt-2">
              Shop by style
            </h2>
          </div>
          <p className="text-muted max-w-[420px] text-[15px] leading-relaxed">
            Four signature cuts, thoughtfully designed to move with your day. Every pair is cut-and-sewn in our partner atelier in Porto.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cats.slice(0, 4).map(cat => {
            const meta = CARD_DATA[cat.slug] ?? { silhouette: 'brief' as const, gradient: 'linear-gradient(155deg, #4A7A5A, #1F3D2F)' }
            return (
              <a
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden transition-transform duration-[250ms] hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(31,61,47,0.45)]"
                style={{ background: meta.gradient }}
              >
                {meta.badge && (
                  <span className="absolute top-3.5 left-3.5 z-[2] font-display font-bold uppercase tracking-[0.18em] text-[10px] bg-white/90 text-primary py-1.5 px-2.5 rounded-full">
                    {meta.badge}
                  </span>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <ProductSilhouette variant={meta.silhouette} className="w-4/5 drop-shadow-[0_18px_28px_rgba(0,0,0,0.25)]" />
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_85%,rgba(31,61,47,0.35),transparent_55%)] pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 z-[2] flex items-center justify-between px-5 py-5 font-display font-black uppercase tracking-[0.08em] text-[18px] text-white">
                  {cat.name}
                  <ArrowRight size={22} strokeWidth={2.2} />
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
