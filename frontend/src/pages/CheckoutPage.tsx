import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { toast } from '@/store/toast'
import { useAddresses, useCreateAddress } from '@/lib/queries'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { AddressCard } from '@/components/checkout/AddressCard'
import { AddressForm } from '@/components/checkout/AddressForm'
import type { CreateOrderRequest, Order, PaymentMethod, UserAddress, UserAddressInput } from '@/types/api'

const SHIPPING_FEE = 30_000

export function CheckoutPage() {
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const { cartId, items, reset } = useCartStore()

  const { data: addresses = [], isLoading: loadingAddrs } = useAddresses(Boolean(token))
  const createAddress = useCreateAddress()

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [adding, setAdding] = useState(false)
  const [payment, setPayment] = useState<PaymentMethod>('COD')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-chọn địa chỉ mặc định khi danh sách load xong
  useEffect(() => {
    if (selectedId != null) return
    if (addresses.length === 0) return
    const def = addresses.find(a => a.isDefault) ?? addresses[0]
    setSelectedId(def.id)
  }, [addresses, selectedId])

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
  const total = subtotal + SHIPPING_FEE
  const selected = addresses.find(a => a.id === selectedId) ?? null

  if (!token) return <Navigate to="/login?redirect=/checkout" replace />
  if (items.length === 0) return <Navigate to="/cart" replace />

  const onSaveNewAddress = async (v: UserAddressInput) => {
    try {
      const newAddr = await createAddress.mutateAsync(v)
      setSelectedId(newAddr.id)
      setAdding(false)
    } catch {
      setError('Không lưu được địa chỉ. Thử lại.')
    }
  }

  const onPlaceOrder = async () => {
    if (!cartId) {
      setError('Không tìm thấy giỏ hàng. Thử reload trang.')
      return
    }
    if (!selected) {
      setError('Vui lòng chọn địa chỉ giao hàng.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const req: CreateOrderRequest = {
        cartId,
        paymentMethod: payment,
        shippingAddress: {
          fullName: selected.fullName,
          phone: selected.phone,
          line1: selected.line1,
          ward: selected.ward,
          district: selected.district,
          city: selected.city,
          note: selected.note,
        },
      }
      const { data } = await api.post<Order>('/orders', req)
      reset()
      toast.success(`Đặt hàng thành công! Mã đơn: ${data.code}`, 4000)
      navigate(`/orders/${data.code}`, { replace: true })
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Đặt hàng thất bại. Thử lại sau.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-12 bg-bg min-h-[60vh]">
      <div className="max-w-[1080px] mx-auto px-[clamp(20px,4vw,56px)]">
        <h1 className="font-display font-black uppercase text-primary text-[clamp(32px,4.2vw,48px)] leading-none mb-10">
          Thanh toán
        </h1>

        <div className="grid md:grid-cols-[1fr_380px] gap-10">
          <div className="grid gap-10">
            <div>
              <div className="flex items-end justify-between gap-3 flex-wrap mb-5">
                <h2 className="font-display font-extrabold uppercase text-primary text-[14px] tracking-[0.14em]">
                  Địa chỉ giao hàng
                </h2>
                {!adding && addresses.length > 0 && (
                  <button
                    type="button" onClick={() => setAdding(true)}
                    className="text-[12px] text-primary underline hover:no-underline"
                  >
                    + Thêm địa chỉ mới
                  </button>
                )}
              </div>

              {loadingAddrs ? (
                <div className="text-muted text-[14px]">Đang tải địa chỉ…</div>
              ) : adding || addresses.length === 0 ? (
                <div className="bg-white border border-border-soft rounded-2xl p-5">
                  {addresses.length === 0 && (
                    <p className="text-muted text-[13px] mb-4">
                      Bạn chưa có địa chỉ nào. Thêm địa chỉ đầu tiên để tiếp tục.
                    </p>
                  )}
                  <AddressForm
                    submitLabel={addresses.length === 0 ? 'Lưu và tiếp tục' : 'Lưu địa chỉ'}
                    onSubmit={onSaveNewAddress}
                    onCancel={addresses.length === 0 ? undefined : () => setAdding(false)}
                    submitting={createAddress.isPending}
                  />
                </div>
              ) : (
                <div className="grid gap-3">
                  {addresses.map(a => (
                    <AddressCard
                      key={a.id}
                      address={a}
                      selectable
                      selected={a.id === selectedId}
                      onSelect={() => setSelectedId(a.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="font-display font-extrabold uppercase text-primary text-[14px] tracking-[0.14em] mb-5">
                Hình thức thanh toán
              </h2>
              <div className="grid gap-3">
                <PaymentOption
                  selected={payment === 'COD'}
                  onClick={() => setPayment('COD')}
                  title="Thanh toán khi nhận hàng (COD)"
                  desc="Trả tiền mặt cho shipper khi nhận sản phẩm."
                />
                <PaymentOption
                  selected={payment === 'BANK_TRANSFER'}
                  onClick={() => setPayment('BANK_TRANSFER')}
                  title="Chuyển khoản ngân hàng"
                  desc="Sau khi đặt, bạn sẽ nhận thông tin tài khoản để chuyển khoản."
                />
              </div>
            </div>
          </div>

          <aside className="bg-white border border-border-soft rounded-2xl p-6 h-fit md:sticky md:top-24">
            <h2 className="font-display font-extrabold uppercase text-primary text-[14px] tracking-[0.14em] mb-4">
              Đơn hàng ({items.length})
            </h2>
            <ul className="grid gap-3 max-h-[240px] overflow-y-auto pr-1">
              {items.map(it => (
                <li key={it.id} className="flex items-center gap-3 text-[13px]">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-border-soft flex-shrink-0">
                    {it.imageUrl ? <img src={it.imageUrl} alt={it.productName} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-primary font-medium truncate">{it.productName}</div>
                    <div className="text-muted text-[12px]">{it.colorName} × {it.quantity}</div>
                  </div>
                  <div className="text-primary font-display font-bold whitespace-nowrap">
                    {formatPrice(it.unitPrice * it.quantity)}
                  </div>
                </li>
              ))}
            </ul>

            <dl className="grid gap-2 mt-5 pt-5 border-t border-border-soft text-[13px]">
              <Row label="Tạm tính" value={formatPrice(subtotal)} />
              <Row label="Vận chuyển" value={formatPrice(SHIPPING_FEE)} />
              <div className="flex justify-between pt-3 mt-1 border-t border-border-soft">
                <dt className="font-display font-extrabold uppercase text-primary text-[13px] tracking-wider">Tổng</dt>
                <dd className="font-display font-extrabold text-primary text-[16px]">{formatPrice(total)}</dd>
              </div>
            </dl>

            {error && <div className="mt-4 text-[13px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

            <button
              type="button" onClick={onPlaceOrder}
              disabled={submitting || !selected}
              className="mt-5 w-full font-display font-bold uppercase tracking-[0.14em] text-[13px] bg-primary text-bg rounded-full py-3.5 hover:bg-primary-dark disabled:opacity-60 transition-colors"
            >
              {submitting ? 'Đang đặt hàng…' : 'Đặt hàng'}
            </button>
            <Link to="/cart" className="block text-center text-[13px] text-muted hover:text-primary mt-3">
              ← Sửa giỏ hàng
            </Link>
          </aside>
        </div>
      </div>
    </section>
  )
}

function PaymentOption({ selected, onClick, title, desc }: {
  selected: boolean
  onClick: () => void
  title: string
  desc: string
}) {
  return (
    <button
      type="button" onClick={onClick}
      className={`text-left rounded-2xl border-2 p-4 transition-colors ${
        selected ? 'border-primary bg-white' : 'border-border-soft bg-white/60 hover:border-primary/40'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 ${selected ? 'border-primary' : 'border-border-soft'}`}>
          {selected && <span className="block w-2.5 h-2.5 bg-primary rounded-full m-[4px]" />}
        </span>
        <div>
          <div className="font-display font-bold text-primary text-[14px]">{title}</div>
          <div className="text-muted text-[13px] mt-0.5">{desc}</div>
        </div>
      </div>
    </button>
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
