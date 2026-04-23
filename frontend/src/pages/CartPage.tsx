import { Link } from 'react-router-dom'
import { Minus, Plus, X } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ProductSilhouette } from '@/components/product/ProductSilhouette'

export function CartPage() {
  const items = useCartStore(s => s.items)
  const updateQty = useCartStore(s => s.updateQty)
  const removeItem = useCartStore(s => s.removeItem)

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

  if (items.length === 0) {
    return (
      <section className="py-24 bg-bg min-h-[60vh]">
        <div className="max-w-[820px] mx-auto px-[clamp(20px,4vw,56px)] text-center">
          <h1 className="font-display font-black uppercase text-primary text-[clamp(32px,4.2vw,56px)] leading-none mb-6">
            Giỏ hàng trống
          </h1>
          <p className="text-muted text-[16px] mb-8">
            Bạn chưa chọn sản phẩm nào. Ghé The Everyday Edit để bắt đầu.
          </p>
          <Button variant="primaryDark" asChild>
            <Link to="/">Xem sản phẩm →</Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-bg min-h-[60vh]">
      <div className="max-w-[1080px] mx-auto px-[clamp(20px,4vw,56px)]">
        <div className="mb-10">
          <h1 className="font-display font-black uppercase text-primary text-[clamp(32px,4.2vw,56px)] leading-none">
            Giỏ hàng ({items.length})
          </h1>
        </div>

        <div className="grid md:grid-cols-[1fr_360px] gap-10">
          <ul className="flex flex-col divide-y border-soft">
            {items.map(it => (
              <li key={it.id} className="py-5 flex gap-4 items-center">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-[linear-gradient(160deg,#E5D9B7,#C9B58B)] relative shrink-0">
                  {it.imageUrl ? (
                    <img src={it.imageUrl} alt={it.productName} className="w-full h-full object-cover" />
                  ) : (
                    <ProductSilhouette variant="brief" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link to={`/products/${it.productSlug}`} className="font-display font-bold uppercase tracking-wider text-[14px] text-primary hover:underline">
                    {it.productName}
                  </Link>
                  <p className="text-muted text-[13px] mt-1 flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full border border-border-soft" style={{ backgroundColor: it.colorHex }} />
                    {it.colorName}
                  </p>
                  <p className="text-primary text-[14px] font-medium mt-1">{formatPrice(it.unitPrice)}</p>
                </div>

                <div className="flex items-center gap-1 border border-border-soft rounded-full">
                  <button type="button" aria-label="Giảm" onClick={() => updateQty(it.id, it.quantity - 1)} className="w-8 h-8 inline-flex items-center justify-center text-primary hover:bg-border-soft/40 rounded-full"><Minus size={14} /></button>
                  <span className="min-w-[28px] text-center text-[14px] font-medium">{it.quantity}</span>
                  <button type="button" aria-label="Tăng" onClick={() => updateQty(it.id, it.quantity + 1)} className="w-8 h-8 inline-flex items-center justify-center text-primary hover:bg-border-soft/40 rounded-full"><Plus size={14} /></button>
                </div>

                <div className="text-primary font-display font-bold text-[15px] w-28 text-right">
                  {formatPrice(it.unitPrice * it.quantity)}
                </div>

                <button type="button" aria-label="Xoá" onClick={() => removeItem(it.id)} className="text-muted hover:text-primary">
                  <X size={18} />
                </button>
              </li>
            ))}
          </ul>

          <aside className="bg-white border border-border-soft rounded-2xl p-6 h-fit sticky top-24">
            <h2 className="font-display font-extrabold uppercase text-primary text-[14px] tracking-[0.14em] mb-4">
              Tóm tắt đơn
            </h2>
            <dl className="grid gap-3 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-muted">Tạm tính</dt>
                <dd className="text-primary font-medium">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Vận chuyển</dt>
                <dd className="text-muted">Tính ở bước thanh toán</dd>
              </div>
              <div className="flex justify-between border-t border-border-soft pt-3 mt-1">
                <dt className="font-display font-extrabold uppercase text-primary text-[13px] tracking-wider">Tổng</dt>
                <dd className="font-display font-extrabold text-primary text-[16px]">{formatPrice(subtotal)}</dd>
              </div>
            </dl>
            <Button variant="primaryDark" className="w-full mt-5" asChild>
              <Link to="/checkout">Thanh toán →</Link>
            </Button>
            <Link to="/" className="block text-center text-[13px] text-muted hover:text-primary mt-3">
              Tiếp tục mua sắm
            </Link>
          </aside>
        </div>
      </div>
    </section>
  )
}
