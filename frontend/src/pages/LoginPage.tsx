import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'

export function LoginPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('redirect') ?? '/'
  const login = useAuthStore(s => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate(redirect)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Không đăng nhập được. Kiểm tra email / mật khẩu.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="max-w-[420px] mx-auto px-5 py-16">
      <h1 className="font-display font-black uppercase text-primary text-[clamp(28px,3.4vw,40px)] tracking-[-0.01em] text-center">
        Đăng nhập
      </h1>
      <p className="text-muted text-[14px] text-center mt-2">
        Chào mừng trở lại Maison Verde.
      </p>

      <form onSubmit={onSubmit} className="mt-8 grid gap-4">
        <label className="grid gap-1.5">
          <span className="text-[12px] font-display font-bold uppercase tracking-[0.12em] text-primary">Email</span>
          <input
            type="email" required autoComplete="email"
            value={email} onChange={e => setEmail(e.target.value)}
            className="border border-border-soft rounded-full px-4 py-3 text-[14px] bg-white focus:outline-none focus:border-primary"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[12px] font-display font-bold uppercase tracking-[0.12em] text-primary">Mật khẩu</span>
          <input
            type="password" required autoComplete="current-password" minLength={6}
            value={password} onChange={e => setPassword(e.target.value)}
            className="border border-border-soft rounded-full px-4 py-3 text-[14px] bg-white focus:outline-none focus:border-primary"
          />
        </label>

        {error && <div className="text-[13px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

        <button
          type="submit" disabled={submitting}
          className="mt-2 font-display font-bold uppercase tracking-[0.14em] text-[13px] bg-primary text-bg rounded-full py-3.5 hover:bg-primary-dark disabled:opacity-60 transition-colors"
        >
          {submitting ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6 text-[12px] text-muted uppercase tracking-[0.14em]">
        <span className="flex-1 h-px bg-border-soft" /> hoặc <span className="flex-1 h-px bg-border-soft" />
      </div>

      <div className="flex justify-center">
        <GoogleSignInButton
          onSuccess={() => navigate(redirect)}
          onError={(msg) => setError(msg)}
        />
      </div>

      <p className="text-[13px] text-center text-muted mt-8">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="text-primary font-medium border-b border-primary pb-0.5">
          Đăng ký
        </Link>
      </p>
    </section>
  )
}
