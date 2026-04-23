import { useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useProduct, useProducts } from '@/lib/queries'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductInfo } from '@/components/product/ProductInfo'
import { FitGuide } from '@/components/product/FitGuide'
import { Reviews } from '@/components/product/Reviews'
import { ProductCarousel, CarouselNav } from '@/components/product/ProductCarousel'

export function ProductDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const { data: product, isLoading, isError } = useProduct(slug)
  const { data: allProducts } = useProducts()
  const trackRef = useRef<HTMLDivElement>(null)

  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] py-16 grid grid-cols-[88px_1fr_1fr] gap-6">
        <div className="grid gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-border-soft/60 animate-pulse" />
          ))}
        </div>
        <div className="aspect-[4/5] rounded-2xl bg-border-soft/60 animate-pulse" />
        <div className="flex flex-col gap-4">
          <div className="h-6 w-24 rounded bg-border-soft/60 animate-pulse" />
          <div className="h-10 w-3/4 rounded bg-border-soft/60 animate-pulse" />
          <div className="h-6 w-1/3 rounded bg-border-soft/60 animate-pulse" />
          <div className="h-12 w-full rounded-full bg-border-soft/60 animate-pulse mt-6" />
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <section className="py-24 text-center">
        <h1 className="font-display font-black uppercase text-primary text-[clamp(28px,3.4vw,40px)]">Không tìm thấy sản phẩm</h1>
        <p className="mt-4 text-muted">Sản phẩm <code className="bg-border-soft/50 px-1.5 py-0.5 rounded">{slug}</code> không tồn tại.</p>
        <Link to="/products" className="mt-6 inline-block font-display font-bold uppercase tracking-wider text-[13px] text-primary border-b-[1.5px] border-primary pb-1">
          ← Quay lại danh sách
        </Link>
      </section>
    )
  }

  const pool = (allProducts ?? []).filter(p => p.id !== product.id)
  const sameCat = pool.filter(p => p.category.id === product.category.id)
  // Gộp same-category lên đầu rồi nối phần còn lại → carousel có đủ items để scroll
  const related = [...sameCat, ...pool.filter(p => !sameCat.includes(p))]

  return (
    <>
      {/* Breadcrumb */}
      <nav className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pt-5 pb-1 text-[12px] text-muted flex items-center gap-1.5">
        <Link to="/" className="hover:text-primary">Trang chủ</Link>
        <ChevronRight size={12} />
        <Link to={`/products?category=${product.category.slug}`} className="hover:text-primary">{product.category.name}</Link>
        <ChevronRight size={12} />
        <span className="text-primary font-medium truncate">{product.name}</span>
      </nav>

      {/* Gallery + Info */}
      <section className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] pt-8 pb-0">
        <div className="flex flex-wrap gap-10 items-start">
          <div style={{ flex: '1 1 58%', minWidth: 320 }}><ProductGallery product={product} /></div>
          <div style={{ flex: '1 1 34%', minWidth: 280 }}>
            <ProductInfo product={product} />
          </div>
        </div>
      </section>

      <FitGuide />

      {/* You may also like — carousel với prev/next */}
      {related.length > 0 && (
        <section className="bg-bg pb-0">
          <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
            <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
              <h2 className="font-display font-black uppercase text-primary text-[clamp(28px,3.4vw,44px)] leading-none tracking-[-0.01em]">
                Có thể bạn sẽ thích
              </h2>
              <CarouselNav trackRef={trackRef} />
            </div>
            <ProductCarousel ref={trackRef} products={related} />
          </div>
        </section>
      )}

      <Reviews />
    </>
  )
}
