import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import type { Product } from '@/types/api'
import { formatPrice } from '@/lib/utils'
import { productGradient, ProductSilhouette } from './ProductSilhouette'
import { Swatches } from './Swatches'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem)
  const token = useAuthStore(s => s.token)
  const navigate = useNavigate()
  const [imgFailed, setImgFailed] = useState(false)
  const [activeColor, setActiveColor] = useState(
    () => product.colors.find(c => c.isDefault)?.name ?? product.colors[0]?.name ?? '',
  )
  const onSale = product.salePrice && product.salePrice < product.price
  const showImage = Boolean(product.imageUrl) && !imgFailed

  return (
    <Link to={`/products/${product.slug}`} className="block group">
      <div
        className="relative aspect-square rounded-2xl overflow-hidden mb-3.5 transition-transform duration-300 group-hover:-translate-y-1"
        style={showImage ? undefined : { background: productGradient(product.silhouette) }}
      >
        {showImage ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(31,61,47,0.3),transparent_55%)]" />
            <ProductSilhouette
              variant={product.silhouette}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 z-[2] drop-shadow-[0_14px_22px_rgba(0,0,0,0.22)]"
            />
          </>
        )}
        {product.badge && (
          <span className="absolute top-3.5 left-3.5 z-[3] font-display font-extrabold uppercase tracking-[0.18em] text-[10px] bg-accent-bright text-primary-dark py-1.5 px-2.5 rounded-full">
            {product.badge}
          </span>
        )}
        <button
          type="button"
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            if (!token) {
              navigate(`/login?redirect=/products/${product.slug}`)
              return
            }
            void addItem(product, activeColor)
          }}
          aria-label={token ? 'Quick add' : 'Đăng nhập để mua'}
          className="absolute right-3.5 bottom-3.5 z-[3] w-10 h-10 rounded-full bg-white text-primary inline-flex items-center justify-center
            opacity-0 translate-y-1.5 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 shadow-[0_6px_18px_rgba(31,61,47,0.18)]"
        >
          <Plus size={18} strokeWidth={2} />
        </button>
      </div>

      <div className="flex justify-between items-baseline gap-3">
        <div className="font-display font-bold uppercase tracking-wider text-[14px] text-primary">{product.name}</div>
        <div className="font-display font-bold text-[14px] text-primary">
          {onSale && <s className="text-muted font-medium mr-1.5 text-xs">{formatPrice(product.price)}</s>}
          {formatPrice(product.salePrice ?? product.price)}
        </div>
      </div>
      <p className="text-muted text-[13px] mt-1">
        {product.material} · {activeColor}
      </p>
      <Swatches colors={product.colors} onChange={c => setActiveColor(c.name)} />
    </Link>
  )
}
