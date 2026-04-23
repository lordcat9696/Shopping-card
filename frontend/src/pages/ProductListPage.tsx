import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useProductsPage } from '@/lib/queries'
import { ProductCard } from '@/components/product/ProductCard'

const PAGE_SIZE = 12

export function ProductListPage() {
  const [params, setParams] = useSearchParams()
  const urlQ = params.get('q') ?? ''
  const urlPage = Math.max(0, parseInt(params.get('page') ?? '0', 10) || 0)

  const [input, setInput] = useState(urlQ)
  const [debounced, setDebounced] = useState(urlQ)

  // Sync input từ URL nếu thay đổi (vd user bấm back/forward)
  useEffect(() => {
    setInput(urlQ)
    setDebounced(urlQ)
  }, [urlQ])

  // Debounce input → update URL
  useEffect(() => {
    const t = setTimeout(() => setDebounced(input.trim()), 300)
    return () => clearTimeout(t)
  }, [input])

  useEffect(() => {
    // Chỉ cập nhật URL khi debounced đã khác URL hiện tại, tránh loop
    if (debounced === urlQ) return
    const next = new URLSearchParams(params)
    if (debounced) next.set('q', debounced)
    else next.delete('q')
    next.delete('page')  // reset page khi search đổi
    setParams(next, { replace: true })
  }, [debounced]) // eslint-disable-line react-hooks/exhaustive-deps

  const { data, isLoading, isFetching } = useProductsPage({
    q: urlQ || undefined,
    page: urlPage,
    size: PAGE_SIZE,
  })

  const items = data?.content ?? []
  const totalPages = data?.totalPages ?? 0
  const totalElements = data?.totalElements ?? 0

  const goToPage = (p: number) => {
    const next = new URLSearchParams(params)
    if (p === 0) next.delete('page')
    else next.set('page', String(p))
    setParams(next)
  }

  const searching = urlQ.length > 0

  return (
    <section className="py-16 bg-bg">
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
        <h1 className="font-display font-black uppercase text-primary text-[clamp(32px,4.2vw,56px)] leading-none mb-3">
          {searching ? 'Kết quả tìm kiếm' : 'All products'}
        </h1>
        <p className="text-muted text-[14px]">
          {isLoading
            ? 'Đang tải…'
            : searching
              ? `${totalElements} sản phẩm cho "${urlQ}"`
              : `${totalElements} sản phẩm`}
        </p>

        {/* Search bar */}
        <div className="mt-6 mb-10 max-w-[520px] relative">
          <Search size={15} strokeWidth={1.8} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            type="search"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Tìm sản phẩm theo tên, chất liệu, mô tả..."
            className="w-full bg-white border border-border-soft rounded-full pl-11 pr-11 py-3 text-[14px] placeholder:text-muted/70 focus:outline-none focus:border-primary"
          />
          {input && (
            <button
              type="button"
              onClick={() => setInput('')}
              aria-label="Xoá"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full inline-flex items-center justify-center text-muted hover:text-primary hover:bg-border-soft/40"
            >
              <X size={14} strokeWidth={1.8} />
            </button>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-border-soft/60 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-muted text-[14px]">
            {searching
              ? 'Không tìm thấy sản phẩm phù hợp. Thử từ khoá khác.'
              : 'Chưa có sản phẩm nào.'}
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-5 ${isFetching && !isLoading ? 'opacity-60' : ''} transition-opacity`}>
              {items.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={urlPage}
                totalPages={totalPages}
                onGoTo={goToPage}
              />
            )}
          </>
        )}
      </div>
    </section>
  )
}

function Pagination({ currentPage, totalPages, onGoTo }: {
  currentPage: number
  totalPages: number
  onGoTo: (page: number) => void
}) {
  const pages = buildPageNumbers(currentPage, totalPages, 7)

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-12 text-[13px]" aria-label="Pagination">
      <button
        type="button" onClick={() => onGoTo(currentPage - 1)} disabled={currentPage === 0}
        className="px-3 py-2 rounded-full border border-border-soft text-primary hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ← Trước
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-muted">…</span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onGoTo(p)}
            className={`min-w-[36px] h-9 rounded-full inline-flex items-center justify-center transition-colors ${
              p === currentPage
                ? 'bg-primary text-bg font-display font-bold'
                : 'border border-border-soft text-primary hover:border-primary'
            }`}
          >
            {p + 1}
          </button>
        ),
      )}
      <button
        type="button" onClick={() => onGoTo(currentPage + 1)} disabled={currentPage >= totalPages - 1}
        className="px-3 py-2 rounded-full border border-border-soft text-primary hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Sau →
      </button>
    </nav>
  )
}

/**
 * Tạo danh sách số trang hiển thị: luôn có trang đầu + trang cuối, "..." nếu
 * khoảng cách với current xa. Ví dụ total=20, current=10 → [0, '...', 9, 10, 11, '...', 19]
 */
function buildPageNumbers(current: number, total: number, maxVisible: number): (number | '...')[] {
  if (total <= maxVisible) return Array.from({ length: total }, (_, i) => i)
  const result: (number | '...')[] = []
  const side = 1  // số trang kế bên current
  result.push(0)
  if (current - side > 1) result.push('...')
  for (let p = Math.max(1, current - side); p <= Math.min(total - 2, current + side); p++) {
    result.push(p)
  }
  if (current + side < total - 2) result.push('...')
  result.push(total - 1)
  return result
}
