import { Check, X, AlertCircle, Info } from 'lucide-react'
import { useToastStore } from '@/store/toast'
import type { ToastType } from '@/store/toast'

const STYLES: Record<ToastType, { bg: string; icon: React.ReactNode }> = {
  success: {
    bg: 'bg-[#1F3D2F] text-bg',
    icon: <Check size={16} strokeWidth={2.5} />,
  },
  error: {
    bg: 'bg-red-700 text-white',
    icon: <AlertCircle size={16} strokeWidth={2.5} />,
  },
  info: {
    bg: 'bg-white text-primary border border-border-soft',
    icon: <Info size={16} strokeWidth={2} />,
  },
}

export function Toaster() {
  const toasts = useToastStore(s => s.toasts)
  const dismiss = useToastStore(s => s.dismiss)

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => {
        const style = STYLES[t.type]
        return (
          <div
            key={t.id}
            className={`pointer-events-auto min-w-[260px] max-w-[400px] shadow-lg rounded-2xl px-4 py-3 flex items-center gap-3 text-[13px] font-medium ${style.bg}`}
            style={{ animation: 'toast-in 200ms ease-out' }}
          >
            <span className="flex-shrink-0">{style.icon}</span>
            <span className="flex-1">{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Đóng"
              className="opacity-60 hover:opacity-100 flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
      <style>{`@keyframes toast-in { from { transform: translateX(16px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }`}</style>
    </div>
  )
}
