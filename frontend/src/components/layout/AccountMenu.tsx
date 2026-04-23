import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

export function AccountMenu() {
  const { user, token, logout } = useAuthStore()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  if (!token || !user) {
    return (
      <Link to="/login" className="hover:text-primary hidden md:inline">
        Sign in
      </Link>
    )
  }

  const initial = (user.name ?? user.email).charAt(0).toUpperCase()

  return (
    <div ref={wrapperRef} className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-8 h-8 rounded-full bg-primary text-bg inline-flex items-center justify-center font-display font-bold text-[13px]"
        aria-label="Account menu"
      >
        {initial}
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white border border-border-soft rounded-xl shadow-lg py-2 text-[13px] z-30">
          <div className="px-4 py-2 border-b border-border-soft">
            <div className="font-display font-bold text-primary truncate">{user.name ?? user.email}</div>
            <div className="text-muted text-[12px] truncate">{user.email}</div>
          </div>
          <Link
            to="/account" onClick={() => setOpen(false)}
            className="block px-4 py-2 hover:bg-border-soft/40"
          >
            Tài khoản
          </Link>
          {(user.role === 'ADMIN' || user.role === 'SUB_ADMIN') && (
            <Link
              to="/admin/orders" onClick={() => setOpen(false)}
              className="block px-4 py-2 hover:bg-border-soft/40 text-primary font-display font-bold uppercase tracking-[0.1em] text-[12px]"
            >
              Admin dashboard →
            </Link>
          )}
          <button
            type="button"
            onClick={() => { logout(); setOpen(false); navigate('/') }}
            className="w-full text-left px-4 py-2 hover:bg-border-soft/40"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  )
}
