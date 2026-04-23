import axios from 'axios'
import { useAuthStore } from '@/store/auth'

export const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      const { token, logout } = useAuthStore.getState()
      // Chỉ logout nếu đang có token (tránh loop khi gọi /auth/login, /auth/me chưa login)
      if (token) logout()
    }
    return Promise.reject(err)
  },
)
