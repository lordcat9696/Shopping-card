import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@/lib/api'
import { useCartStore } from '@/store/cart'
import type { AuthResponse, User } from '@/types/api'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  loginWithGoogle: (idToken: string) => Promise<void>
  logout: () => void
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,

      login: async (email, password) => {
        const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
        set({ token: data.token, user: data.user })
        await useCartStore.getState().loadFromServer()
      },

      register: async (email, password, name) => {
        const { data } = await api.post<AuthResponse>('/auth/register', { email, password, name })
        set({ token: data.token, user: data.user })
        await useCartStore.getState().loadFromServer()
      },

      loginWithGoogle: async (idToken) => {
        const { data } = await api.post<AuthResponse>('/auth/google', { idToken })
        set({ token: data.token, user: data.user })
        await useCartStore.getState().loadFromServer()
      },

      logout: () => {
        set({ token: null, user: null })
        useCartStore.getState().reset()
      },

      hydrate: async () => {
        if (!get().token) return
        set({ loading: true })
        try {
          const { data } = await api.get<User>('/auth/me')
          set({ user: data })
          await useCartStore.getState().loadFromServer()
        } catch {
          set({ token: null, user: null })
          useCartStore.getState().reset()
        } finally {
          set({ loading: false })
        }
      },
    }),
    {
      name: 'mv-auth',
      partialize: (s) => ({ token: s.token, user: s.user }),
    },
  ),
)
