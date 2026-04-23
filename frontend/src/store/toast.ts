import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  type: ToastType
  message: string
}

interface ToastState {
  toasts: Toast[]
  show: (message: string, type?: ToastType, durationMs?: number) => void
  dismiss: (id: number) => void
}

let _id = 0

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  show: (message, type = 'info', durationMs = 3000) => {
    const id = ++_id
    set(s => ({ toasts: [...s.toasts, { id, type, message }] }))
    if (durationMs > 0) {
      setTimeout(() => get().dismiss(id), durationMs)
    }
  },
  dismiss: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}))

export const toast = {
  success: (msg: string, durationMs?: number) => useToastStore.getState().show(msg, 'success', durationMs),
  error: (msg: string, durationMs?: number) => useToastStore.getState().show(msg, 'error', durationMs),
  info: (msg: string, durationMs?: number) => useToastStore.getState().show(msg, 'info', durationMs),
}
