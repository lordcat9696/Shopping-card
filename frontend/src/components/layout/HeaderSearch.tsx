import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useSearchProducts } from '@/lib/queries'
import { formatPrice } from '@/lib/utils'

export function HeaderSearch() {
  const [q, setQ] = useState('')
  const [debounced, setDebounced] = useState('')
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // debounce 250ms
  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 250)
    return () => clearTimeout(t)
  }, [q])

  const { data: results = [], isFetching } = useSearchProducts(debounced)

  // click outside → close dropdown
  useEffect(() => {
    if (!open) return
    const onClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim().length < 2) return
    setOpen(false)
    navigate(`/products?q=${encodeURIComponent(q.trim())}`)
  }

  const showDropdown = open && debounced.trim().length >= 2

  return (
    <div ref={wrapperRef} className="relative hidden md:block w-full max-w-[280px]">
      <form onSubmit={onSubmit}>
        <div className="relative">
          <Search size={14} strokeWidth={1.8} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            type="search"
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            placeholder="Tìm sản phẩm..."
            className="w-full bg-white border border-border-soft rounded-full pl-9 pr-9 py-2 text-[13px] placeholder:text-muted/70 focus:outline-none focus:border-primary"
          />
          {q && (
            <button
              type="button"
              onClick={() => { setQ(''); setDebounced('') }}
              aria-label="Xoá"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full inline-flex items-center justify-center text-muted hover:text-primary hover:bg-border-soft/40"
            >
              <X size={13} strokeWidth={1.8} />
            </button>
          )}
        </div>
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] bg-white border border-border-soft rounded-xl shadow-lg z-30 max-h-[480px] overflow-y-auto">
          {isFetching && results.length === 0 && (
            <div className="px-4 py-6 text-center text-[13px] text-muted">Đang tìm…</div>
          )}
          {!isFetching && results.length === 0 && (
            <div className="px-4 py-6 text-center text-[13px] text-muted">
              Không tìm thấy kết quả cho "<span className="text-primary">{debounced}</span>"
            </div>
          )}
          {results.length > 0 && (
            <>
              <ul className="py-2">
                {results.slice(0, 8).map((p) => {
                  const price = p.salePrice ?? p.price
                  return (
                    <li key={p.id}>
                      <Link
                        to={`/products/${p.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-border-soft/40"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-border-soft flex-shrink-0">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] text-primary font-medium truncate">{p.name}</div>
                          <div className="text-[12px] text-muted">{p.category.name}</div>
                        </div>
                        <div className="text-[13px] font-display font-bold text-primary whitespace-nowrap">
                          {formatPrice(price)}
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
              <button
                type="button"
                onClick={onSubmit}
                className="w-full border-t border-border-soft px-4 py-3 text-[12px] font-display font-bold uppercase tracking-[0.14em] text-primary hover:bg-border-soft/40"
              >
                Xem tất cả kết quả →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
