import { X } from 'lucide-react'
import { useAdminOrder } from '@/lib/queries'
import { formatPrice } from '@/lib/utils'
import type { OrderStatus, PaymentMethod } from '@/types/api'

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

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  COD: 'Thanh toán khi nhận hàng',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
}

export function OrderDetailModal({ orderId, onClose }: { orderId: number; onClose: () => void }) {
  const { data: order, isLoading } = useAdminOrder(orderId)

  return (
    <div className="fixed inset-0 bg-black/40 z-[80] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-[780px] w-full max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border-soft flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display font-black uppercase text-primary text-[22px]">
              {order ? `Đơn ${order.code}` : 'Chi tiết đơn hàng'}
            </h2>
            {order && (
              <div className="flex items-center gap-2 mt-1.5 text-[12px] text-muted">
                <span>{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                <span>·</span>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_COLORS[order.status]}`}>
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
            )}
          </div>
          <button type="button" onClick={onClose} aria-label="Đóng" className="text-muted hover:text-primary">
            <X size={20} />
          </button>
        </div>

        {isLoading || !order ? (
          <div className="p-10 text-center text-muted text-[14px]">Đang tải…</div>
        ) : (
          <div className="p-6 grid gap-6">
            <Section title="Khách hàng">
              <KV label="Tên" value={order.userName ?? '—'} />
              <KV label="Email" value={order.userEmail ?? '—'} />
              <KV label="User ID" value={order.userId != null ? `#${order.userId}` : '—'} />
            </Section>

            <Section title="Địa chỉ giao hàng">
              <KV label="Người nhận" value={`${order.shippingAddress.fullName} · ${order.shippingAddress.phone}`} />
              <KV label="Địa chỉ" value={[
                order.shippingAddress.line1,
                order.shippingAddress.ward,
                order.shippingAddress.district,
                order.shippingAddress.city,
              ].filter(Boolean).join(', ')} />
              {order.shippingAddress.note && (
                <KV label="Ghi chú" value={order.shippingAddress.note} />
              )}
            </Section>

            <Section title="Thanh toán">
              <KV label="Phương thức" value={PAYMENT_LABELS[order.paymentMethod]} />
              {order.paymentMethod === 'BANK_TRANSFER' && (
                <div className="text-[12px] text-muted bg-bg border border-border-soft rounded-xl p-3 mt-2">
                  Nội dung chuyển khoản: <span className="font-display font-bold text-primary">{order.code}</span>
                </div>
              )}
            </Section>

            <Section title={`Sản phẩm (${order.items.length})`}>
              <ul className="grid gap-3">
                {order.items.map(it => (
                  <li key={it.id} className="flex items-center gap-3 text-[13px]">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-border-soft flex-shrink-0">
                      {it.imageUrl && <img src={it.imageUrl} alt={it.productName} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-primary font-medium truncate">{it.productName}</div>
                      <div className="text-muted text-[12px]">{it.colorName} × {it.quantity} · {formatPrice(it.unitPrice)}</div>
                    </div>
                    <div className="text-primary font-display font-bold whitespace-nowrap">
                      {formatPrice(it.lineTotal)}
                    </div>
                  </li>
                ))}
              </ul>

              <dl className="grid gap-2 mt-5 pt-5 border-t border-border-soft text-[13px]">
                <Row label="Tạm tính" value={formatPrice(order.subtotal)} />
                <Row label="Vận chuyển" value={formatPrice(order.shippingFee)} />
                <div className="flex justify-between pt-3 mt-1 border-t border-border-soft">
                  <dt className="font-display font-extrabold uppercase text-primary text-[13px] tracking-wider">Tổng</dt>
                  <dd className="font-display font-extrabold text-primary text-[18px]">{formatPrice(order.total)}</dd>
                </div>
              </dl>
            </Section>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display font-extrabold uppercase text-primary text-[12px] tracking-[0.14em] mb-3">{title}</h3>
      <div className="grid gap-1.5">{children}</div>
    </div>
  )
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 text-[13px]">
      <div className="text-muted">{label}</div>
      <div className="text-primary break-words">{value}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className="text-primary font-medium">{value}</dd>
    </div>
  )
}
