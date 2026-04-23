import { useMemo, useState } from 'react'
import { Save } from 'lucide-react'
import { useInventory, useUpdateStock } from '@/lib/queries'
import { toast } from '@/store/toast'

export function InventoryAdminPage() {
  const { data: inventory = [], isLoading } = useInventory()
  const updateStock = useUpdateStock()

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'out' | 'low'>('all')
  // draft[colorId] = string user đang gõ trước khi Save
  const [drafts, setDrafts] = useState<Record<number, string>>({})

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return inventory.filter(i => {
      if (filter === 'out' && i.stock > 0) return false
      if (filter === 'low' && (i.stock === 0 || i.stock > 5)) return false
      if (!q) return true
      return i.productName.toLowerCase().includes(q) || i.colorName.toLowerCase().includes(q)
    })
  }, [inventory, search, filter])

  const onSave = async (colorId: number, currentStock: number) => {
    const draft = drafts[colorId]
    if (draft == null) return
    const n = parseInt(draft, 10)
    if (isNaN(n) || n < 0) {
      toast.error('Số lượng không hợp lệ')
      return
    }
    if (n === currentStock) {
      setDrafts(d => { const c = { ...d }; delete c[colorId]; return c })
      return
    }
    try {
      await updateStock.mutateAsync({ colorId, stock: n })
      toast.success('Đã cập nhật tồn kho')
      setDrafts(d => { const c = { ...d }; delete c[colorId]; return c })
    } catch {
      toast.error('Cập nhật thất bại')
    }
  }

  const totals = useMemo(() => ({
    totalVariants: inventory.length,
    outOfStock: inventory.filter(i => i.stock === 0).length,
    lowStock: inventory.filter(i => i.stock > 0 && i.stock <= 5).length,
    totalUnits: inventory.reduce((s, i) => s + i.stock, 0),
  }), [inventory])

  return (
    <div>
      <h1 className="font-display font-black uppercase text-primary text-[clamp(24px,3vw,34px)] leading-none mb-6">
        Quản lý kho
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard label="Tổng variant" value={String(totals.totalVariants)} />
        <StatCard label="Tổng tồn" value={String(totals.totalUnits)} />
        <StatCard label="Sắp hết (≤5)" value={String(totals.lowStock)} tint="yellow" />
        <StatCard label="Hết hàng" value={String(totals.outOfStock)} tint="red" />
      </div>

      <div className="bg-white border border-border-soft rounded-2xl p-4 mb-4 flex flex-wrap gap-3 items-end">
        <label className="grid gap-1.5 flex-1 min-w-[200px]">
          <span className="text-[11px] font-display font-bold uppercase tracking-[0.12em] text-primary">Tìm kiếm</span>
          <input
            type="search"
            placeholder="Tên sản phẩm, màu…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-border-soft rounded-full px-4 py-2 text-[13px] bg-white focus:outline-none focus:border-primary"
          />
        </label>
        <div className="flex gap-2">
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>Tất cả</FilterButton>
          <FilterButton active={filter === 'low'} onClick={() => setFilter('low')}>Sắp hết</FilterButton>
          <FilterButton active={filter === 'out'} onClick={() => setFilter('out')}>Hết hàng</FilterButton>
        </div>
      </div>

      {isLoading ? (
        <div className="text-muted text-[14px] p-8 text-center">Đang tải…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-border-soft rounded-2xl p-12 text-center text-muted text-[14px]">
          Không có variant phù hợp.
        </div>
      ) : (
        <div className="bg-white border border-border-soft rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="bg-[#EAE1C7]">
                <tr>
                  <Th>Ảnh</Th>
                  <Th>Sản phẩm</Th>
                  <Th>Màu</Th>
                  <Th>Tồn kho hiện tại</Th>
                  <Th>Cập nhật</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(it => {
                  const draft = drafts[it.colorId]
                  const hasChange = draft != null && parseInt(draft, 10) !== it.stock
                  return (
                    <tr key={it.colorId} className="border-t border-border-soft align-middle">
                      <Td>
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-border-soft">
                          {it.productImageUrl && <img src={it.productImageUrl} alt={it.productName} className="w-full h-full object-cover" />}
                        </div>
                      </Td>
                      <Td>
                        <div className="font-display font-bold text-primary">{it.productName}</div>
                        <div className="text-[11px] text-muted">{it.productSlug}</div>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border border-border-soft" style={{ backgroundColor: it.colorHex }} />
                          <span className="text-primary">{it.colorName}</span>
                        </div>
                      </Td>
                      <Td>
                        <span className={
                          it.stock === 0
                            ? 'text-red-700 font-display font-bold'
                            : it.stock <= 5
                              ? 'text-yellow-700 font-display font-bold'
                              : 'text-primary font-display font-bold'
                        }>
                          {it.stock}
                        </span>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            value={draft ?? it.stock}
                            onChange={e => setDrafts(d => ({ ...d, [it.colorId]: e.target.value }))}
                            className="border border-border-soft rounded-full px-3 py-1.5 text-[13px] bg-white w-[90px] focus:outline-none focus:border-primary"
                          />
                          <button
                            type="button"
                            disabled={!hasChange || updateStock.isPending}
                            onClick={() => onSave(it.colorId, it.stock)}
                            className="inline-flex items-center gap-1 text-[12px] font-display font-bold uppercase tracking-[0.1em] border border-primary text-primary rounded-full px-3 py-1.5 hover:bg-primary hover:text-bg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Save size={12} /> Lưu
                          </button>
                        </div>
                      </Td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-4 py-3 font-display font-bold uppercase tracking-[0.1em] text-[11px] text-primary">{children}</th>
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className ?? ''}`}>{children}</td>
}

function StatCard({ label, value, tint }: { label: string; value: string; tint?: 'yellow' | 'red' }) {
  const color = tint === 'red'
    ? 'text-red-700'
    : tint === 'yellow'
      ? 'text-yellow-700'
      : 'text-primary'
  return (
    <div className="bg-white border border-border-soft rounded-2xl p-4">
      <div className="text-[11px] uppercase tracking-[0.12em] text-muted font-display font-bold">{label}</div>
      <div className={`font-display font-black text-[22px] mt-1 ${color}`}>{value}</div>
    </div>
  )
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[11px] font-display font-bold uppercase tracking-[0.1em] border rounded-full px-3 py-2 transition-colors ${
        active ? 'bg-primary text-bg border-primary' : 'border-border-soft text-primary hover:border-primary'
      }`}
    >
      {children}
    </button>
  )
}
