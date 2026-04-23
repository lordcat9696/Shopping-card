import { useState } from 'react'
import { Eye } from 'lucide-react'
import { useAdminOrders, useUpdateOrderStatus } from '@/lib/queries'
import { formatPrice } from '@/lib/utils'
import { toast } from '@/store/toast'
import { OrderDetailModal } from './OrderDetailModal'
import type { OrderStatus } from '@/types/api'

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Chờ xử lý',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã huỷ',
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPING: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-700',
}

// Chuỗi các status được phép transition từ mỗi status (đơn giản hoá workflow)
const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPING', 'CANCELLED'],
  SHIPPING: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
}

export function OrdersAdminPage() {
  const [status, setStatus] = useState<OrderStatus | ''>('PENDING')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(0)
  const [detailId, setDetailId] = useState<number | null>(null)

  const { data, isLoading } = useAdminOrders({
    status: status || undefined,
    q: q.trim() || undefined,
    page,
    size: 20,
  })
  const updateStatus = useUpdateOrderStatus()

  const orders = data?.content ?? []
  const totalPages = data?.totalPages ?? 1

  const onChangeStatus = async (id: number, next: OrderStatus, code: string) => {
    try {
      await updateStatus.mutateAsync({ id, status: next })
      toast.success(`${code} → ${STATUS_LABELS[next]}`)
    } catch {
      toast.error('Cập nhật trạng thái thất bại')
    }
  }

  return (
    <div>
      <h1 className="font-display font-black uppercase text-primary text-[clamp(24px,3vw,34px)] leading-none mb-6">
        Đơn hàng
      </h1>

      <div className="bg-white border border-border-soft rounded-2xl p-4 mb-4 flex flex-wrap gap-3 items-end">
        <label className="grid gap-1.5">
          <span className="text-[11px] font-display font-bold uppercase tracking-[0.12em] text-primary">Trạng thái</span>
          <select
            value={status}
            onChange={e => { setStatus(e.target.value as OrderStatus | ''); setPage(0) }}
            className="border border-border-soft rounded-full px-4 py-2 text-[13px] bg-white focus:outline-none focus:border-primary"
          >
            <option value="">Tất cả</option>
            {(Object.keys(STATUS_LABELS) as OrderStatus[]).map(s => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 flex-1 min-w-[200px]">
          <span className="text-[11px] font-display font-bold uppercase tracking-[0.12em] text-primary">Tìm kiếm</span>
          <input
            type="search"
            placeholder="Mã đơn, email, tên khách…"
            value={q}
            onChange={e => { setQ(e.target.value); setPage(0) }}
            className="border border-border-soft rounded-full px-4 py-2 text-[13px] bg-white focus:outline-none focus:border-primary"
          />
        </label>
      </div>

      {isLoading ? (
        <div className="text-muted text-[14px] p-8 text-center">Đang tải…</div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-border-soft rounded-2xl p-12 text-center text-muted text-[14px]">
          Không có đơn hàng phù hợp.
        </div>
      ) : (
        <>
          <div className="bg-white border border-border-soft rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead className="bg-[#EAE1C7]">
                  <tr>
                    <Th>Mã đơn</Th>
                    <Th>Khách hàng</Th>
                    <Th>Ngày đặt</Th>
                    <Th>Tổng</Th>
                    <Th>Trạng thái</Th>
                    <Th>Chuyển</Th>
                    <Th>Chi tiết</Th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="border-t border-border-soft align-middle">
                      <Td>
                        <div className="font-display font-bold text-primary">{o.code}</div>
                        <div className="text-[11px] text-muted">{o.items.length} sản phẩm</div>
                      </Td>
                      <Td>
                        <div className="text-primary">{o.userName ?? '—'}</div>
                        <div className="text-[11px] text-muted">{o.userEmail ?? '—'}</div>
                      </Td>
                      <Td className="text-muted">
                        {new Date(o.createdAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                      </Td>
                      <Td className="font-display font-bold text-primary">{formatPrice(o.total)}</Td>
                      <Td>
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-medium ${STATUS_COLORS[o.status]}`}>
                          {STATUS_LABELS[o.status]}
                        </span>
                      </Td>
                      <Td>
                        <div className="flex flex-wrap gap-1.5">
                          {NEXT_STATUSES[o.status].map(next => (
                            <button
                              key={next}
                              type="button"
                              disabled={updateStatus.isPending}
                              onClick={() => onChangeStatus(o.id, next, o.code)}
                              className="text-[11px] font-display font-bold uppercase tracking-[0.1em] border border-primary text-primary rounded-full px-2.5 py-1 hover:bg-primary hover:text-bg transition-colors disabled:opacity-50"
                            >
                              {STATUS_LABELS[next]}
                            </button>
                          ))}
                        </div>
                      </Td>
                      <Td>
                        <button
                          type="button" onClick={() => setDetailId(o.id)}
                          className="inline-flex items-center gap-1 text-[12px] text-primary hover:underline"
                        >
                          <Eye size={12} /> Xem
                        </button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-5 text-[13px]">
              <button
                type="button" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                className="px-3 py-1.5 rounded-full border border-border-soft text-primary hover:bg-border-soft/40 disabled:opacity-40"
              >← Trước</button>
              <span className="text-muted">Trang {page + 1} / {totalPages}</span>
              <button
                type="button" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                className="px-3 py-1.5 rounded-full border border-border-soft text-primary hover:bg-border-soft/40 disabled:opacity-40"
              >Sau →</button>
            </div>
          )}
        </>
      )}

      {detailId != null && (
        <OrderDetailModal orderId={detailId} onClose={() => setDetailId(null)} />
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
