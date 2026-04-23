import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { ShoppingBag, Package, Users, BarChart3, Boxes } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

export function AdminLayout() {
  const { user, token, loading } = useAuthStore()

  if (loading) {
    return <section className="py-24 text-center text-muted">Đang kiểm tra quyền truy cập…</section>
  }
  if (!token || !user) {
    return <Navigate to="/login?redirect=/admin/orders" replace />
  }
  if (user.role !== 'ADMIN' && user.role !== 'SUB_ADMIN') {
    return (
      <section className="py-24 text-center">
        <h1 className="font-display font-black uppercase text-primary text-[28px]">Không có quyền truy cập</h1>
        <p className="text-muted mt-3">Khu vực này chỉ dành cho ADMIN / SUB_ADMIN.</p>
      </section>
    )
  }

  const isAdmin = user.role === 'ADMIN'

  return (
    <section className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] py-10 min-h-[60vh]">
      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        <aside className="h-fit bg-white border border-border-soft rounded-2xl p-4 md:sticky md:top-24">
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted font-display font-bold px-3 pt-1 pb-3">
            Admin dashboard
          </div>
          <nav className="grid gap-1">
            <AdminNavLink to="/admin/orders" icon={<ShoppingBag size={15} />}>Đơn hàng</AdminNavLink>
            <AdminNavLink to="/admin/reports" icon={<BarChart3 size={15} />}>Báo cáo</AdminNavLink>
            <AdminNavLink to="/admin/products" icon={<Package size={15} />}>Sản phẩm</AdminNavLink>
            <AdminNavLink to="/admin/inventory" icon={<Boxes size={15} />}>Kho</AdminNavLink>
            {isAdmin && (
              <AdminNavLink to="/admin/users" icon={<Users size={15} />}>Phân quyền</AdminNavLink>
            )}
          </nav>
          <div className="border-t border-border-soft mt-4 pt-3 px-3">
            <div className="text-[11px] text-muted">Đăng nhập:</div>
            <div className="text-[13px] text-primary font-medium truncate">{user.email}</div>
            <div className="text-[10px] uppercase tracking-[0.14em] font-display font-bold mt-1 text-accent-bright bg-primary-dark inline-block px-2 py-0.5 rounded-full">
              {user.role}
            </div>
          </div>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </section>
  )
}

function AdminNavLink({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] transition-colors ${
          isActive
            ? 'bg-primary text-bg font-display font-bold'
            : 'text-primary hover:bg-border-soft/50'
        }`
      }
    >
      {icon}
      {children}
    </NavLink>
  )
}
