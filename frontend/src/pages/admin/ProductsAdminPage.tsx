import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useProducts, useCategories, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/lib/queries'
import { formatPrice } from '@/lib/utils'
import { toast } from '@/store/toast'
import type { Product, ProductUpsertRequest } from '@/types/api'

const SILHOUETTES = ['brief', 'bikini', 'boyshort', 'chill'] as const

export function ProductsAdminPage() {
  const { data: products = [], isLoading } = useProducts()
  const [editing, setEditing] = useState<Product | 'new' | null>(null)
  const deleteP = useDeleteProduct()

  const onDelete = async (p: Product) => {
    if (!confirm(`Xoá sản phẩm "${p.name}"?`)) return
    try {
      await deleteP.mutateAsync(p.id)
      toast.success('Đã xoá sản phẩm')
    } catch {
      toast.error('Xoá thất bại')
    }
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <h1 className="font-display font-black uppercase text-primary text-[clamp(24px,3vw,34px)] leading-none">
          Sản phẩm
        </h1>
        <button
          type="button" onClick={() => setEditing('new')}
          className="inline-flex items-center gap-2 font-display font-bold uppercase tracking-[0.14em] text-[12px] bg-primary text-bg rounded-full py-2.5 px-5 hover:bg-primary-dark transition-colors"
        >
          <Plus size={14} /> Thêm sản phẩm
        </button>
      </div>

      {isLoading ? (
        <div className="text-muted text-[14px] p-8 text-center">Đang tải…</div>
      ) : (
        <div className="bg-white border border-border-soft rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="bg-[#EAE1C7]">
                <tr>
                  <Th>Ảnh</Th>
                  <Th>Tên / Slug</Th>
                  <Th>Danh mục</Th>
                  <Th>Giá</Th>
                  <Th>Silhouette</Th>
                  <Th>Hành động</Th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-t border-border-soft align-middle">
                    <Td>
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-border-soft">
                        {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />}
                      </div>
                    </Td>
                    <Td>
                      <div className="font-display font-bold text-primary">{p.name}</div>
                      <div className="text-[11px] text-muted">{p.slug}</div>
                    </Td>
                    <Td className="text-muted">{p.category.name}</Td>
                    <Td>
                      <div className="font-display font-bold text-primary">{formatPrice(p.salePrice ?? p.price)}</div>
                      {p.salePrice && <div className="text-[11px] text-muted line-through">{formatPrice(p.price)}</div>}
                    </Td>
                    <Td className="text-muted">{p.silhouette}</Td>
                    <Td>
                      <div className="flex gap-2">
                        <button
                          type="button" onClick={() => setEditing(p)}
                          className="inline-flex items-center gap-1 text-[12px] text-primary hover:underline"
                        >
                          <Pencil size={12} /> Sửa
                        </button>
                        <button
                          type="button" onClick={() => onDelete(p)}
                          className="inline-flex items-center gap-1 text-[12px] text-red-600 hover:underline"
                        >
                          <Trash2 size={12} /> Xoá
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editing && (
        <ProductFormModal
          initial={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}

function ProductFormModal({ initial, onClose }: { initial: Product | null; onClose: () => void }) {
  const { data: categories = [] } = useCategories()
  const createP = useCreateProduct()
  const updateP = useUpdateProduct()

  const [form, setForm] = useState<ProductUpsertRequest>({
    slug: initial?.slug ?? '',
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    material: initial?.material ?? '',
    price: initial?.price ?? 0,
    salePrice: initial?.salePrice ?? undefined,
    badge: initial?.badge ?? '',
    silhouette: initial?.silhouette ?? 'brief',
    imageUrl: initial?.imageUrl ?? '',
    categoryId: initial?.category.id ?? (categories[0]?.id ?? 0),
  })
  const [error, setError] = useState<string | null>(null)

  const update = <K extends keyof ProductUpsertRequest>(k: K, v: ProductUpsertRequest[K]) =>
    setForm(prev => ({ ...prev, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      if (initial) {
        await updateP.mutateAsync({ id: initial.id, ...form })
        toast.success('Đã cập nhật sản phẩm')
      } else {
        await createP.mutateAsync(form)
        toast.success('Đã tạo sản phẩm')
      }
      onClose()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Lưu thất bại'
      setError(msg)
    }
  }

  const pending = createP.isPending || updateP.isPending

  return (
    <div className="fixed inset-0 bg-black/40 z-[80] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-[720px] w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border-soft">
          <h2 className="font-display font-black uppercase text-primary text-[22px]">
            {initial ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
          </h2>
        </div>
        <form onSubmit={submit} className="p-6 grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Slug" required value={form.slug} onChange={v => update('slug', v)} />
            <Field label="Tên sản phẩm" required value={form.name} onChange={v => update('name', v)} />
          </div>
          <Field label="Mô tả" value={form.description ?? ''} onChange={v => update('description', v)} textarea />
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Chất liệu" value={form.material ?? ''} onChange={v => update('material', v)} />
            <Field label="Badge (New, Bán chạy, -13%...)" value={form.badge ?? ''} onChange={v => update('badge', v)} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Giá (VND)" type="number" required value={String(form.price)} onChange={v => update('price', parseInt(v) || 0)} />
            <Field label="Giá sale (để trống nếu không sale)" type="number" value={form.salePrice != null ? String(form.salePrice) : ''} onChange={v => update('salePrice', v ? parseInt(v) : undefined)} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="grid gap-1.5">
              <span className="text-[11px] font-display font-bold uppercase tracking-[0.12em] text-primary">Silhouette *</span>
              <select required value={form.silhouette} onChange={e => update('silhouette', e.target.value)}
                className="border border-border-soft rounded-full px-4 py-3 text-[14px] bg-white focus:outline-none focus:border-primary">
                {SILHOUETTES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-display font-bold uppercase tracking-[0.12em] text-primary">Danh mục *</span>
              <select required value={form.categoryId} onChange={e => update('categoryId', parseInt(e.target.value))}
                className="border border-border-soft rounded-full px-4 py-3 text-[14px] bg-white focus:outline-none focus:border-primary">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
          </div>
          <Field label="Image URL (vd /products/slug.jpg)" value={form.imageUrl ?? ''} onChange={v => update('imageUrl', v)} />

          {error && <div className="text-[13px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={pending}
              className="font-display font-bold uppercase tracking-[0.14em] text-[12px] bg-primary text-bg rounded-full py-3 px-7 hover:bg-primary-dark disabled:opacity-60 transition-colors">
              {pending ? 'Đang lưu…' : initial ? 'Cập nhật' : 'Tạo mới'}
            </button>
            <button type="button" onClick={onClose}
              className="font-display font-bold uppercase tracking-[0.14em] text-[12px] border border-border-soft text-primary rounded-full py-3 px-7 hover:border-primary transition-colors">
              Huỷ
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-4 py-3 font-display font-bold uppercase tracking-[0.1em] text-[11px] text-primary">{children}</th>
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className ?? ''}`}>{children}</td>
}

function Field({ label, value, onChange, required, type = 'text', textarea }: {
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  type?: string
  textarea?: boolean
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[11px] font-display font-bold uppercase tracking-[0.12em] text-primary">
        {label}{required && ' *'}
      </span>
      {textarea ? (
        <textarea
          required={required} value={value}
          onChange={e => onChange(e.target.value)}
          rows={3}
          className="border border-border-soft rounded-2xl px-4 py-3 text-[14px] bg-white focus:outline-none focus:border-primary resize-none"
        />
      ) : (
        <input
          type={type} required={required} value={value}
          onChange={e => onChange(e.target.value)}
          className="border border-border-soft rounded-full px-4 py-3 text-[14px] bg-white focus:outline-none focus:border-primary"
        />
      )}
    </label>
  )
}
