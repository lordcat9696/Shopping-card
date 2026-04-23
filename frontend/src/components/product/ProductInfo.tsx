import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Heart, Minus, Plus, Star } from 'lucide-react'
import type { Product } from '@/types/api'
import { formatPrice, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SizeSelector } from './SizeSelector'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'

export function ProductInfo({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem)
  const token = useAuthStore(s => s.token)
  const navigate = useNavigate()
  const selectedColor = (colorName: string) => product.colors.find(c => c.name === colorName)
  const [activeColor, setActiveColor] = useState(
    () => product.colors.find(c => c.isDefault)?.name ?? product.colors[0]?.name ?? '',
  )
  const [size, setSize] = useState('M')
  const [qty, setQty] = useState(1)
  const [openDesc, setOpenDesc] = useState(true)
  const [openFabric, setOpenFabric] = useState(false)
  const [openCare, setOpenCare] = useState(false)

  const onSale = product.salePrice && product.salePrice < product.price
  const price = product.salePrice ?? product.price

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-muted font-display">
          <span>{product.category.name}</span>
          <span className="opacity-40">·</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} className="fill-primary text-primary" strokeWidth={0} />
            ))}
            <span className="ml-1 text-primary">(128)</span>
          </div>
        </div>
        <h1 className="font-display font-black uppercase text-primary text-[clamp(28px,3vw,40px)] leading-[1.05] tracking-[-0.01em] mt-2">
          {product.name}
        </h1>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="font-display font-black text-primary text-[24px]">{formatPrice(price)}</span>
        {onSale && <s className="text-muted text-[16px] font-medium">{formatPrice(product.price)}</s>}
        {onSale && product.badge && (
          <span className="font-display font-bold text-[11px] uppercase tracking-widest bg-accent-bright text-primary-dark px-2 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-display font-bold text-[12px] uppercase tracking-[0.16em] text-primary">
            Màu · <span className="text-muted font-medium tracking-normal normal-case">{activeColor}</span>
          </span>
          {(() => {
            const c = selectedColor(activeColor)
            if (!c) return null
            if (c.stock <= 0) return <span className="text-[11px] text-red-700 font-display font-bold uppercase tracking-widest">Hết hàng</span>
            if (c.stock <= 5) return <span className="text-[11px] text-yellow-700 font-display font-bold uppercase tracking-widest">Còn {c.stock}</span>
            return <span className="text-[11px] text-muted">Còn {c.stock}</span>
          })()}
        </div>
        <div className="flex gap-2">
          {product.colors.map(c => (
            <button
              key={c.name}
              type="button"
              onClick={() => setActiveColor(c.name)}
              aria-label={c.name}
              title={c.name}
              className={cn(
                'w-10 h-10 rounded-full transition-all border-2',
                activeColor === c.name ? 'border-primary' : 'border-transparent hover:border-border-soft',
              )}
            >
              <span
                className="block w-full h-full rounded-full border border-white/60"
                style={{ backgroundColor: c.hexCode }}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-display font-bold text-[12px] uppercase tracking-[0.16em] text-primary">Kích thước</span>
          <button type="button" className="text-[12px] text-muted underline hover:text-primary">Hướng dẫn chọn size</button>
        </div>
        <SizeSelector active={size} onChange={setSize} />
      </div>

      <div className="flex gap-2 mt-2">
        <div className="flex items-center border border-border-soft rounded-full bg-white">
          <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-12 inline-flex items-center justify-center text-primary hover:bg-border-soft/40 rounded-l-full" aria-label="Giảm"><Minus size={14} /></button>
          <span className="min-w-[32px] text-center text-[14px] font-medium">{qty}</span>
          <button type="button" onClick={() => setQty(q => q + 1)} className="w-10 h-12 inline-flex items-center justify-center text-primary hover:bg-border-soft/40 rounded-r-full" aria-label="Tăng"><Plus size={14} /></button>
        </div>
        {(() => {
          const c = selectedColor(activeColor)
          const outOfStock = !c || c.stock <= 0
          const overStock = c && qty > c.stock
          const disabled = token != null && (outOfStock || overStock)
          return (
            <Button
              variant="primaryDark"
              size="md"
              className="flex-1 h-12"
              disabled={disabled}
              onClick={async () => {
                if (!token) {
                  navigate(`/login?redirect=/products/${product.slug}`)
                  return
                }
                await addItem(product, activeColor, qty)
              }}
            >
              {!token
                ? 'Đăng nhập để mua'
                : outOfStock
                  ? 'Hết hàng'
                  : overStock
                    ? `Chỉ còn ${c!.stock}`
                    : `Thêm vào giỏ — ${formatPrice(price * qty)}`}
            </Button>
          )
        })()}
        <button type="button" aria-label="Yêu thích" className="w-12 h-12 rounded-full border border-border-soft inline-flex items-center justify-center text-primary hover:bg-border-soft/40">
          <Heart size={18} />
        </button>
      </div>

      <ul className="grid grid-cols-2 gap-y-2 gap-x-4 mt-2 text-[13px] text-muted">
        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />Giao 2–3 ngày toàn quốc</li>
        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />Đổi trả 60 ngày miễn phí</li>
        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />Thanh toán khi nhận hàng</li>
        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />Bảo hành 12 tháng đường may</li>
      </ul>

      <div className="border-t border-border-soft mt-4">
        <DisclosurePanel title="Mô tả sản phẩm" open={openDesc} onToggle={() => setOpenDesc(v => !v)}>
          <p>{product.description}</p>
          <p className="mt-3">
            Thiết kế: <strong>{product.name}</strong> — vải <strong>{product.material}</strong>, phù hợp sân đấu và
            di chuyển cường độ cao. Đường may flatlock hạn chế cọ xát, form dáng ôm cơ thể vẫn giữ được sự thoải mái.
          </p>
        </DisclosurePanel>
        <DisclosurePanel title="Chất liệu & thành phần" open={openFabric} onToggle={() => setOpenFabric(v => !v)}>
          <ul className="list-disc ml-5 space-y-1">
            <li>87% {product.material} · 13% Spandex</li>
            <li>Trọng lượng vải: 180 gsm</li>
            <li>Công nghệ Exdry: thấm hút mồ hôi, khô nhanh</li>
            <li>Chống tia UV UPF 30+</li>
          </ul>
        </DisclosurePanel>
        <DisclosurePanel title="Hướng dẫn giặt & bảo quản" open={openCare} onToggle={() => setOpenCare(v => !v)}>
          <ul className="list-disc ml-5 space-y-1">
            <li>Giặt máy nước lạnh ≤ 30°C</li>
            <li>Không dùng thuốc tẩy</li>
            <li>Không sấy, phơi nơi thoáng mát</li>
            <li>Không là ủi trực tiếp lên hình in / logo phản quang</li>
          </ul>
        </DisclosurePanel>
      </div>
    </div>
  )
}

function DisclosurePanel({
  title, open, onToggle, children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-border-soft">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left font-display font-bold text-[13px] uppercase tracking-[0.14em] text-primary"
      >
        {title}
        <ChevronDown size={18} className={cn('transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="pb-4 text-[14px] leading-relaxed text-muted">{children}</div>
      )}
    </div>
  )
}
