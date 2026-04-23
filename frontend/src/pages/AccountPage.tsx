import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { api } from '@/lib/api'
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from '@/lib/queries'
import { formatPrice } from '@/lib/utils'
import { AddressCard } from '@/components/checkout/AddressCard'
import { AddressForm } from '@/components/checkout/AddressForm'
import type { Order, UserAddressInput } from '@/types/api'

const STATUS_LABELS: Record<Order['status'], string> = {
  PENDING: 'Chờ xử lý',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã huỷ',
}

const STATUS_COLORS: Record<Order['status'], string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPING: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-700',
}

export function AccountPage() {
  const { user, token, logout } = useAuthStore()
  const navigate = useNavigate()

  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  const { data: addresses = [], isLoading: loadingAddrs } = useAddresses(Boolean(token))
  const createAddr = useCreateAddress()
  const updateAddr = useUpdateAddress()
  const deleteAddr = useDeleteAddress()
  const setDefault = useSetDefaultAddress()

  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    api.get<Order[]>('/orders')
      .then(res => { if (!cancelled) setOrders(res.data) })
      .catch(() => { if (!cancelled) setOrders([]) })
      .finally(() => { if (!cancelled) setLoadingOrders(false) })
    return () => { cancelled = true }
  }, [token])

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  const handleCreate = async (v: UserAddressInput) => {
    await createAddr.mutateAsync(v)
    setAdding(false)
  }

  const handleUpdate = async (id: number, v: UserAddressInput) => {
    await updateAddr.mutateAsync({ id, ...v })
    setEditingId(null)
  }

  const handleDelete = (id: number) => {
    if (!confirm('Xoá địa chỉ này?')) return
    deleteAddr.mutate(id)
  }

  return (
    <section className="max-w-[980px] mx-auto px-5 py-12">
      <h1 className="font-display font-black uppercase text-primary text-[clamp(28px,3.4vw,40px)] tracking-[-0.01em]">
        Tài khoản
      </h1>

      <div className="mt-8 grid md:grid-cols-[260px_1fr] gap-8">
        <aside className="grid gap-5 h-fit">
          <div className="bg-white border border-border-soft rounded-2xl p-5">
            <div className="font-display font-bold text-primary text-[16px] truncate">{user.name ?? user.email}</div>
            <div className="text-muted text-[12px] truncate mt-1">{user.email}</div>
            {user.phone && <div className="text-muted text-[12px] truncate">{user.phone}</div>}
            <div className="text-muted text-[11px] mt-3">
              Đăng nhập bằng: {user.provider === 'GOOGLE' ? 'Google' : 'Email'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => { logout(); navigate('/') }}
            className="font-display font-bold uppercase tracking-[0.14em] text-[12px] border border-primary text-primary rounded-full py-3 hover:bg-primary hover:text-bg transition-colors"
          >
            Đăng xuất
          </button>
        </aside>

        <div className="grid gap-10">
          {/* Addresses */}
          <div>
            <div className="flex items-end justify-between gap-3 flex-wrap mb-5">
              <h2 className="font-display font-extrabold uppercase text-primary text-[14px] tracking-[0.14em]">
                Địa chỉ của tôi
              </h2>
              {!adding && (
                <button
                  type="button" onClick={() => { setAdding(true); setEditingId(null) }}
                  className="text-[12px] text-primary underline hover:no-underline"
                >
                  + Thêm địa chỉ
                </button>
              )}
            </div>

            {adding && (
              <div className="bg-white border border-border-soft rounded-2xl p-5 mb-3">
                <AddressForm
                  submitLabel="Thêm"
                  onSubmit={handleCreate}
                  onCancel={() => setAdding(false)}
                  submitting={createAddr.isPending}
                />
              </div>
            )}

            {loadingAddrs ? (
              <div className="text-muted text-[14px]">Đang tải…</div>
            ) : addresses.length === 0 && !adding ? (
              <div className="bg-white border border-border-soft rounded-2xl p-6 text-center text-muted text-[14px]">
                Chưa có địa chỉ nào. Thêm địa chỉ mặc định để giao hàng nhanh hơn.
              </div>
            ) : (
              <ul className="grid gap-3">
                {addresses.map(a => (
                  <li key={a.id}>
                    {editingId === a.id ? (
                      <div className="bg-white border border-border-soft rounded-2xl p-5">
                        <AddressForm
                          initial={a}
                          submitLabel="Lưu"
                          onSubmit={(v) => handleUpdate(a.id, v)}
                          onCancel={() => setEditingId(null)}
                          submitting={updateAddr.isPending}
                        />
                      </div>
                    ) : (
                      <AddressCard
                        address={a}
                        onEdit={() => { setEditingId(a.id); setAdding(false) }}
                        onDelete={() => handleDelete(a.id)}
                        onSetDefault={() => setDefault.mutate(a.id)}
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Orders */}
          <div>
            <h2 className="font-display font-extrabold uppercase text-primary text-[14px] tracking-[0.14em] mb-5">
              Đơn hàng của tôi
            </h2>
            {loadingOrders ? (
              <div className="text-muted text-[14px]">Đang tải…</div>
            ) : orders.length === 0 ? (
              <div className="bg-white border border-border-soft rounded-2xl p-8 text-center">
                <p className="text-muted text-[14px]">Chưa có đơn hàng nào.</p>
                <Link
                  to="/"
                  className="inline-block mt-4 font-display font-bold uppercase tracking-[0.14em] text-[12px] text-primary border-b border-primary pb-1"
                >
                  Bắt đầu mua sắm →
                </Link>
              </div>
            ) : (
              <ul className="grid gap-3">
                {orders.map(o => (
                  <li key={o.id}>
                    <Link
                      to={`/orders/${o.code}`}
                      className="block bg-white border border-border-soft rounded-2xl p-5 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div>
                          <div className="font-display font-bold text-primary text-[15px]">{o.code}</div>
                          <div className="text-muted text-[12px] mt-0.5">
                            {new Date(o.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            {' · '}{o.items.length} sản phẩm
                          </div>
                        </div>
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-medium ${STATUS_COLORS[o.status]}`}>
                          {STATUS_LABELS[o.status]}
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border-soft flex items-center justify-between">
                        <span className="text-muted text-[12px]">
                          {o.paymentMethod === 'COD' ? 'COD' : 'Chuyển khoản'}
                        </span>
                        <span className="font-display font-extrabold text-primary text-[15px]">
                          {formatPrice(o.total)}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
