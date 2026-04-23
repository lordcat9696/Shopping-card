import { create } from 'zustand'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { toast } from '@/store/toast'
import type { AddItemRequest, Cart, CartItem, Product } from '@/types/api'

function extractApiError(err: unknown, fallback: string): string {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback
}

export interface LocalCartItem {
  id: string                 // local id (productId-colorName) — stable key cho React list
  serverId?: number          // CartItem.id từ BE
  productId: number
  productSlug: string
  productName: string
  colorName: string
  colorHex: string
  unitPrice: number
  imageUrl?: string
  quantity: number
}

interface CartState {
  cartId: string | null
  items: LocalCartItem[]
  itemCount: number
  /**
   * Thêm item vào cart. Yêu cầu user đã đăng nhập.
   * BE là source of truth — sau POST thành công, reload cart từ BE để đồng bộ.
   * @returns 'OK' / 'NEED_AUTH' / 'ERROR'
   */
  addItem: (product: Product, colorName: string, quantity?: number) => Promise<'OK' | 'NEED_AUTH' | 'ERROR'>
  updateQty: (localId: string, quantity: number) => Promise<void>
  removeItem: (localId: string) => Promise<void>
  /** Load cart của user đang login từ BE. */
  loadFromServer: () => Promise<void>
  /** Clear local state — dùng khi logout hoặc sau checkout. Không đụng BE. */
  reset: () => void
}

function recount(items: LocalCartItem[]) {
  return items.reduce((sum, it) => sum + it.quantity, 0)
}

function toLocal(i: CartItem): LocalCartItem {
  return {
    id: `${i.productId}-${i.colorName}`,
    serverId: i.id,
    productId: i.productId,
    productSlug: i.productSlug,
    productName: i.productName,
    colorName: i.colorName,
    colorHex: i.colorHex ?? '#888',
    unitPrice: i.unitPrice,
    imageUrl: i.imageUrl,
    quantity: i.quantity,
  }
}

function applyCart(data: Cart) {
  const items = data.items.map(toLocal)
  return { cartId: data.id, items, itemCount: recount(items) }
}

export const useCartStore = create<CartState>()((set, get) => ({
  cartId: null,
  items: [],
  itemCount: 0,

  addItem: async (product, colorName, quantity = 1) => {
    const token = useAuthStore.getState().token
    if (!token) return 'NEED_AUTH'

    const color = product.colors.find(c => c.name === colorName) ?? product.colors[0]
    if (!color) return 'ERROR'

    // Đảm bảo có cartId (tạo cart của user nếu chưa có).
    const ensureCartId = async (): Promise<string | null> => {
      try {
        const { data } = await api.get<Cart>('/cart/my')
        set(applyCart(data))
        return data.id
      } catch {
        return null
      }
    }

    let cartId = get().cartId
    if (!cartId) {
      cartId = await ensureCartId()
      if (!cartId) return 'ERROR'
    }

    const req: AddItemRequest = { productId: product.id, colorName: color.name, quantity }
    const postItem = async (targetId: string) => {
      const { data } = await api.post<Cart>(`/cart/${targetId}/items`, req)
      set(applyCart(data))
    }

    try {
      await postItem(cartId)
      toast.success(`Đã thêm ${product.name} vào giỏ`)
      return 'OK'
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 403 || status === 404) {
        // cartId stale → refresh rồi retry
        const fresh = await ensureCartId()
        if (!fresh) return 'ERROR'
        try {
          await postItem(fresh)
          toast.success(`Đã thêm ${product.name} vào giỏ`)
          return 'OK'
        } catch (retryErr) {
          toast.error(extractApiError(retryErr, 'Thêm vào giỏ thất bại'))
          return 'ERROR'
        }
      }
      toast.error(extractApiError(err, 'Thêm vào giỏ thất bại'))
      return 'ERROR'
    }
  },

  updateQty: async (localId, quantity) => {
    const { cartId, items } = get()
    const target = items.find(i => i.id === localId)
    if (!cartId || !target?.serverId) return
    try {
      if (quantity <= 0) {
        const { data } = await api.delete<Cart>(`/cart/${cartId}/items/${target.serverId}`)
        set(applyCart(data))
      } else {
        const { data } = await api.patch<Cart>(`/cart/${cartId}/items/${target.serverId}`, { quantity })
        set(applyCart(data))
      }
    } catch (err) {
      toast.error(extractApiError(err, 'Cập nhật giỏ hàng thất bại'))
      await get().loadFromServer()
    }
  },

  removeItem: async (localId) => {
    const { cartId, items } = get()
    const target = items.find(i => i.id === localId)
    if (!cartId || !target?.serverId) return
    try {
      const { data } = await api.delete<Cart>(`/cart/${cartId}/items/${target.serverId}`)
      set(applyCart(data))
    } catch {
      await get().loadFromServer()
    }
  },

  reset: () => set({ cartId: null, items: [], itemCount: 0 }),

  loadFromServer: async () => {
    const token = useAuthStore.getState().token
    if (!token) {
      set({ cartId: null, items: [], itemCount: 0 })
      return
    }
    try {
      const { data } = await api.get<Cart>('/cart/my')
      set(applyCart(data))
    } catch {
      // Không xoá state hiện có — chỉ log. Nếu 401, axios interceptor sẽ logout.
    }
  },
}))
