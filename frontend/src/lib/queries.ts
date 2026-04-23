import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import type {
  AdminOrder,
  Category,
  InventoryItem,
  OrderStatsResponse,
  OrderStatus,
  PageResponse,
  Product,
  ProductUpsertRequest,
  Role,
  User,
  UserAddress,
  UserAddressInput,
} from '@/types/api'

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await api.get<PageResponse<Product>>('/products', {
        params: { size: 20 },
      })
      return data.content
    },
    staleTime: 30_000,
  })
}

export function useSearchProducts(q: string) {
  const query = q.trim()
  return useQuery<Product[]>({
    queryKey: ['products', 'search', query],
    queryFn: async () => {
      const { data } = await api.get<PageResponse<Product>>('/products', {
        params: { q: query, size: 12 },
      })
      return data.content
    },
    enabled: query.length >= 2,
    staleTime: 30_000,
  })
}

export interface ProductListParams {
  q?: string
  category?: string
  page: number
  size: number
}

export function useProductsPage(params: ProductListParams) {
  return useQuery<PageResponse<Product>>({
    queryKey: ['products', 'page', params],
    queryFn: async () => {
      const { data } = await api.get<PageResponse<Product>>('/products', {
        params: {
          q: params.q?.trim() || undefined,
          category: params.category || undefined,
          page: params.page,
          size: params.size,
        },
      })
      return data
    },
    staleTime: 30_000,
  })
}

export function useProduct(id: number | string) {
  return useQuery<Product>({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data } = await api.get<Product>(`/products/${id}`)
      return data
    },
    enabled: Boolean(id),
  })
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<Category[]>('/categories')
      return data
    },
    staleTime: 60_000,
  })
}

export function useAddresses(enabled = true) {
  return useQuery<UserAddress[]>({
    queryKey: ['addresses'],
    queryFn: async () => {
      const { data } = await api.get<UserAddress[]>('/addresses')
      return data
    },
    enabled,
    staleTime: 30_000,
  })
}

export function useCreateAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (req: UserAddressInput) => {
      const { data } = await api.post<UserAddress>('/addresses', req)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  })
}

export function useUpdateAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...req }: UserAddressInput & { id: number }) => {
      const { data } = await api.patch<UserAddress>(`/addresses/${id}`, req)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  })
}

export function useDeleteAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/addresses/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  })
}

export function useSetDefaultAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post<UserAddress>(`/addresses/${id}/default`)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  })
}

// ==================== Admin ====================

export interface AdminOrderFilters {
  status?: OrderStatus
  q?: string
  page?: number
  size?: number
}

export function useAdminOrders(filters: AdminOrderFilters) {
  return useQuery<PageResponse<AdminOrder>>({
    queryKey: ['admin', 'orders', filters],
    queryFn: async () => {
      const { data } = await api.get<PageResponse<AdminOrder>>('/admin/orders', { params: filters })
      return data
    },
    staleTime: 10_000,
  })
}

export function useCancelOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (code: string) => {
      const { data } = await api.post(`/orders/${code}/cancel`)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] })
    },
  })
}

export function useAdminOrder(id: number | null) {
  return useQuery<AdminOrder>({
    queryKey: ['admin', 'orders', id],
    queryFn: async () => {
      const { data } = await api.get<AdminOrder>(`/admin/orders/${id}`)
      return data
    },
    enabled: id != null,
  })
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: OrderStatus }) => {
      const { data } = await api.patch<AdminOrder>(`/admin/orders/${id}/status`, { status })
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] })
    },
  })
}

export function useOrderStats(from: string, to: string, status?: OrderStatus) {
  return useQuery<OrderStatsResponse>({
    queryKey: ['admin', 'stats', from, to, status],
    queryFn: async () => {
      const { data } = await api.get<OrderStatsResponse>('/admin/orders/stats', {
        params: { from, to, status },
      })
      return data
    },
    enabled: Boolean(from && to),
    staleTime: 30_000,
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (req: ProductUpsertRequest) => {
      const { data } = await api.post<Product>('/admin/products', req)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...req }: ProductUpsertRequest & { id: number }) => {
      const { data } = await api.put<Product>(`/admin/products/${id}`, req)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/products/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useAdminUsers(q?: string) {
  return useQuery<PageResponse<User>>({
    queryKey: ['admin', 'users', q],
    queryFn: async () => {
      const { data } = await api.get<PageResponse<User>>('/admin/users', { params: { q, size: 50 } })
      return data
    },
    staleTime: 10_000,
  })
}

export function useUpdateUserRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, role }: { id: number; role: Role }) => {
      const { data } = await api.patch<User>(`/admin/users/${id}/role`, { role })
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}

export function useInventory() {
  return useQuery<InventoryItem[]>({
    queryKey: ['admin', 'inventory'],
    queryFn: async () => {
      const { data } = await api.get<InventoryItem[]>('/admin/inventory')
      return data
    },
    staleTime: 10_000,
  })
}

export function useUpdateStock() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ colorId, stock }: { colorId: number; stock: number }) => {
      const { data } = await api.patch<InventoryItem>(`/admin/inventory/${colorId}`, { stock })
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'inventory'] })
      qc.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
