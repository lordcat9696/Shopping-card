import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/auth'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (resp: { credential: string }) => void }) => void
          renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void
        }
      }
    }
  }
}

const GSI_SRC = 'https://accounts.google.com/gsi/client'
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${GSI_SRC}"]`)) {
      resolve()
      return
    }
    const s = document.createElement('script')
    s.src = GSI_SRC
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Không tải được Google Identity Services'))
    document.head.appendChild(s)
  })
}

export function GoogleSignInButton({ onSuccess, onError }: {
  onSuccess?: () => void
  onError?: (msg: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const loginWithGoogle = useAuthStore(s => s.loginWithGoogle)

  useEffect(() => {
    if (!CLIENT_ID) {
      onError?.('Thiếu VITE_GOOGLE_CLIENT_ID trong .env.local')
      return
    }
    let cancelled = false
    loadScript()
      .then(() => {
        if (cancelled || !ref.current || !window.google) return
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: async (resp) => {
            try {
              await loginWithGoogle(resp.credential)
              onSuccess?.()
            } catch (e) {
              const msg = e instanceof Error ? e.message : 'Đăng nhập Google thất bại'
              onError?.(msg)
            }
          },
        })
        window.google.accounts.id.renderButton(ref.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
          logo_alignment: 'left',
          width: 320,
        })
      })
      .catch(e => onError?.(e.message))
    return () => { cancelled = true }
  }, [loginWithGoogle, onSuccess, onError])

  if (!CLIENT_ID) {
    return (
      <div className="text-[12px] text-muted italic">
        Google Sign-In chưa cấu hình (thiếu VITE_GOOGLE_CLIENT_ID)
      </div>
    )
  }

  return <div ref={ref} />
}
