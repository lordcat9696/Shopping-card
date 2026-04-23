export interface Category {
  id: number
  slug: string
  name: string
  description?: string
}

export interface ProductColor {
  id: number
  name: string
  hexCode: string
  isDefault: boolean
  stock: number
}

export interface InventoryItem {
  colorId: number
  productId: number
  productSlug: string
  productName: string
  productImageUrl?: string
  colorName: string
  colorHex: string
  stock: number
}

export interface ProductImage {
  url: string
  alt?: string
  sortOrder: number
}

export interface Product {
  id: number
  slug: string
  name: string
  description: string
  material: string
  price: number       // VND
  salePrice?: number  // VND
  badge?: string      // e.g. "New", "Bán chạy", "-13%"
  silhouette: 'brief' | 'bikini' | 'boyshort' | 'chill'
  imageUrl?: string   // ảnh chính — dùng cho ProductCard, thumbnail
  category: Category
  colors: ProductColor[]
  images?: ProductImage[]  // gallery detail — sorted theo sortOrder
}

export interface PageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number
  size: number
}

export interface CartItem {
  id: number
  productId: number
  productSlug: string
  productName: string
  imageUrl?: string
  colorName: string
  colorHex?: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export interface Cart {
  id: string  // UUID
  items: CartItem[]
  subtotal: number
  itemCount: number
}

export interface AddItemRequest {
  productId: number
  colorName: string
  quantity: number
}

export type PaymentMethod = 'COD' | 'BANK_TRANSFER'

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED'

export interface ShippingAddress {
  fullName: string
  phone: string
  line1: string
  ward?: string
  district?: string
  city: string
  note?: string
}

export interface OrderItem {
  id: number
  productId: number
  productSlug: string
  productName: string
  colorName: string
  quantity: number
  unitPrice: number
  lineTotal: number
  imageUrl?: string
}

export interface Order {
  id: number
  code: string
  status: OrderStatus
  paymentMethod: PaymentMethod
  shippingAddress: ShippingAddress
  subtotal: number
  shippingFee: number
  total: number
  items: OrderItem[]
  createdAt: string
}

export interface CreateOrderRequest {
  cartId: string
  paymentMethod: PaymentMethod
  shippingAddress: ShippingAddress
}

export interface UserAddress {
  id: number
  fullName: string
  phone: string
  line1: string
  ward?: string
  district?: string
  city: string
  note?: string
  isDefault: boolean
}

export type UserAddressInput = Omit<UserAddress, 'id'>


export type AuthProvider = 'LOCAL' | 'GOOGLE'
export type Role = 'USER' | 'SUB_ADMIN' | 'ADMIN'

export interface User {
  id: number
  email: string
  name?: string
  phone?: string
  provider: AuthProvider
  role: Role
}

export interface AdminOrder extends Order {
  userId: number | null
  userEmail: string | null
  userName: string | null
}

export interface ProductUpsertRequest {
  slug: string
  name: string
  description?: string
  material?: string
  price: number
  salePrice?: number
  badge?: string
  silhouette: string
  imageUrl?: string
  categoryId: number
}

export interface OrderStatsResponse {
  from: string       // ISO date yyyy-mm-dd
  to: string
  totalOrders: number
  totalRevenue: number
  statusBreakdown: { status: OrderStatus; count: number; revenue: number }[]
  daily: { date: string; count: number; revenue: number }[]
}

export interface AuthResponse {
  token: string
  user: User
}
