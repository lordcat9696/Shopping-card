import { useState } from 'react'
import type { Product } from '@/types/api'
import { ProductSilhouette, productGradient } from './ProductSilhouette'

export function ProductGallery({ product }: { product: Product }) {
  // Ưu tiên product.images (sorted theo sortOrder từ BE).
  // Fallback: lặp imageUrl 5 lần để vẫn render được gallery khi thiếu data.
  const slots: (string | undefined)[] =
    product.images && product.images.length > 0
      ? product.images.map(i => i.url)
      : Array.from({ length: 5 }, () => product.imageUrl)

  const [active, setActive] = useState(0)
  const [failed, setFailed] = useState<Record<number, boolean>>({})

  const activeSrc = slots[active]
  const showHeroImage = Boolean(activeSrc) && !failed[active]
  const altOf = (idx: number) =>
    product.images?.[idx]?.alt ?? `${product.name} view ${idx + 1}`

  return (
    <div className="flex flex-col gap-3">
      {/* Hero main image */}
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[linear-gradient(160deg,#E5D9B7,#C9B58B)]">
        {showHeroImage ? (
          <img
            src={activeSrc}
            alt={altOf(active)}
            onError={() => setFailed(f => ({ ...f, [active]: true }))}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(31,61,47,0.3),transparent_55%)]" />
            <ProductSilhouette
              variant={product.silhouette}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 drop-shadow-[0_24px_32px_rgba(0,0,0,0.25)]"
            />
          </>
        )}
        {product.badge && (
          <span className="absolute top-4 left-4 z-[3] font-display font-extrabold uppercase tracking-[0.18em] text-[11px] bg-accent-bright text-primary-dark py-1.5 px-3 rounded-full">
            {product.badge}
          </span>
        )}
      </div>

      {/* 2x2 thumbnail grid: slots 1–4 (slot 0 đang là hero) */}
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map(i => (
          <Thumb
            key={i}
            src={failed[i] ? undefined : slots[i]}
            alt={altOf(i)}
            product={product}
            active={active === i}
            onClick={() => setActive(i)}
            onError={() => setFailed(f => ({ ...f, [i]: true }))}
          />
        ))}
      </div>
    </div>
  )
}

function Thumb({
  src, alt, product, active, onClick, onError,
}: {
  src: string | undefined
  alt: string
  product: Product
  active: boolean
  onClick: () => void
  onError: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`aspect-square rounded-xl overflow-hidden border-2 transition-colors relative ${
        active ? 'border-primary' : 'border-transparent hover:border-border-soft'
      }`}
    >
      {src ? (
        <img src={src} alt={alt} onError={onError} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full relative" style={{ background: productGradient(product.silhouette) }}>
          <ProductSilhouette variant={product.silhouette} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3/5" />
        </div>
      )}
    </button>
  )
}
