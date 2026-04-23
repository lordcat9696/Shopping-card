import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { toast } from '@/store/toast'
import type { Order } from '@/types/api'

const PAYMENT_LABELS: Record<Order['paymentMethod'], string> = {
  COD: 'Thanh toán khi nhận hàng',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
}

const STATUS_LABELS: Record<Order['status'], string> = {
  PENDING: 'Chờ xử lý',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã huỷ',
}

export function OrderConfirmPage() {
  const { code = '' } = useParams<{ code: string }>()
  const token = useAuthStore(s => s.token)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)

  const canCancel = order && (order.status === 'PENDING' || order.status === 'CONFIRMED')

  const onCancel = async () => {
    if (!order) return
    if (!confirm(`Huỷ đơn ${order.code}? Tồn kho sẽ được hoàn lại.`)) return
    setCancelling(true)
    try {
      const { data } = await api.post<Order>(`/orders/${order.code}/cancel`)
      setOrder(data)
      toast.success('Đã huỷ đơn hàng')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Huỷ đơn thất bại'
      toast.error(msg)
    } finally {
      setCancelling(false)
    }
  }

  useEffect(() => {
    if (!code || !token) return
    let cancelled = false
    api.get<Order>(`/orders/${code}`)
      .then(res => { if (!cancelled) setOrder(res.data) })
      .catch(() => { if (!cancelled) setError('Không tìm thấy đơn hàng.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [code, token])

  if (!token) return <Navigate to="/login" replace />

  if (loading) {
    return (
      <section className="py-24 text-center text-muted">Đang tải đơn hàng…</section>
    )
  }

  if (error || !order) {
    return (
      <section className="py-24 text-center">
        <h1 className="font-display font-black uppercase text-primary text-[28px]">Không tìm thấy đơn</h1>
        <p className="text-muted mt-2">Kiểm tra lại link hoặc vào <Link to="/account" className="underline">Tài khoản</Link>.</p>
      </section>
    )
  }

  const { shippingAddress: a } = order

  return (
    <section className="py-14 bg-bg min-h-[60vh]">
      <div className="max-w-[820px] mx-auto px-[clamp(20px,4vw,56px)]">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full bg-accent-bright text-primary-dark inline-flex items-center justify-center mx-auto mb-5">
            <Check size={28} strokeWidth={2.5} />
          </div>
          <h1 className="font-display font-black uppercase text-primary text-[clamp(28px,3.6vw,44px)] leading-none">
            Đặt hàng thành công
          </h1>
          <p className="text-muted text-[14px] mt-3">
            Mã đơn: <span className="font-display font-bold text-primary">{order.code}</span> · Trạng thái: {STATUS_LABELS[order.status]}
          </p>
        </div>

        <div className="bg-white border border-border-soft rounded-2xl p-6 md:p-8">
          <h2 className="font-display font-extrabold uppercase text-primary text-[13px] tracking-[0.14em] mb-4">
            Địa chỉ giao
          </h2>
          <div className="text-[14px] text-primary">
            <div className="font-medium">{a.fullName} · {a.phone}</div>
            <div className="text-muted mt-1">
              {[a.line1, a.ward, a.district, a.city].filter(Boolean).join(', ')}
            </div>
            {a.note && <div className="text-muted text-[13px] mt-2">Ghi chú: {a.note}</div>}
          </div>

          <h2 className="font-display font-extrabold uppercase text-primary text-[13px] tracking-[0.14em] mt-8 mb-4">
            Thanh toán
          </h2>
          <div className="text-[14px] text-primary">{PAYMENT_LABELS[order.paymentMethod]}</div>
          {order.paymentMethod === 'BANK_TRANSFER' && (
            <div className="mt-3 text-[13px] text-muted bg-bg border border-border-soft rounded-xl p-4">
              Vui lòng chuyển khoản theo nội dung: <span className="font-display font-bold text-primary">{order.code}</span> — shop sẽ xác nhận đơn ngay khi nhận được tiền.
              Thông tin tài khoản sẽ được gửi qua email.
            </div>
          )}

          <h2 className="font-display font-extrabold uppercase text-primary text-[13px] tracking-[0.14em] mt-8 mb-4">
            Sản phẩm
          </h2>
          <ul className="grid gap-3">
            {order.items.map(it => (
              <li key={it.id} className="flex items-center gap-4 text-[13px]">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-border-soft flex-shrink-0">
                  {it.imageUrl ? <img src={it.imageUrl} alt={it.productName} className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${it.productSlug}`} className="text-primary font-medium hover:underline truncate block">
                    {it.productName}
                  </Link>
                  <div className="text-muted text-[12px]">{it.colorName} × {it.quantity}</div>
                </div>
                <div className="text-primary font-display font-bold whitespace-nowrap">{formatPrice(it.lineTotal)}</div>
              </li>
            ))}
          </ul>

          <dl className="grid gap-2 mt-6 pt-5 border-t border-border-soft text-[13px]">
            <Row label="Tạm tính" value={formatPrice(order.subtotal)} />
            <Row label="Vận chuyển" value={formatPrice(order.shippingFee)} />
            <div className="flex justify-between pt-3 mt-1 border-t border-border-soft">
              <dt className="font-display font-extrabold uppercase text-primary text-[13px] tracking-wider">Tổng</dt>
              <dd className="font-display font-extrabold text-primary text-[18px]">{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link
            to="/"
            className="font-display font-bold uppercase tracking-[0.14em] text-[12px] border border-primary text-primary rounded-full py-3 px-7 hover:bg-primary hover:text-bg transition-colors"
          >
            Tiếp tục mua sắm
          </Link>
          <Link
            to="/account"
            className="font-display font-bold uppercase tracking-[0.14em] text-[12px] bg-primary text-bg rounded-full py-3 px-7 hover:bg-primary-dark transition-colors"
          >
            Xem đơn của tôi
          </Link>
          {canCancel && (
            <button
              type="button" onClick={onCancel} disabled={cancelling}
              className="font-display font-bold uppercase tracking-[0.14em] text-[12px] border border-red-600 text-red-700 rounded-full py-3 px-7 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
            >
              {cancelling ? 'Đang huỷ…' : 'Huỷ đơn'}
            </button>
          )}
        </div>
      </div>
    </section>
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
