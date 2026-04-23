import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { useAdminUsers, useUpdateUserRole } from '@/lib/queries'
import { toast } from '@/store/toast'
import type { Role } from '@/types/api'

const ROLES: Role[] = ['USER', 'SUB_ADMIN', 'ADMIN']

const ROLE_COLORS: Record<Role, string> = {
  USER: 'bg-border-soft/60 text-primary',
  SUB_ADMIN: 'bg-blue-100 text-blue-800',
  ADMIN: 'bg-primary-dark text-accent-bright',
}

export function UsersAdminPage() {
  const currentUser = useAuthStore(s => s.user)
  const [q, setQ] = useState('')
  const [debounced, setDebounced] = useState('')
  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 300)
    return () => clearTimeout(t)
  }, [q])

  const { data, isLoading } = useAdminUsers(debounced || undefined)
  const updateRole = useUpdateUserRole()

  const users = data?.content ?? []

  const onChangeRole = async (id: number, email: string, role: Role) => {
    if (!confirm(`Đổi role của ${email} thành ${role}?`)) return
    try {
      await updateRole.mutateAsync({ id, role })
      toast.success(`Đã đổi role của ${email} → ${role}`)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Đổi role thất bại'
      toast.error(msg)
    }
  }

  return (
    <div>
      <h1 className="font-display font-black uppercase text-primary text-[clamp(24px,3vw,34px)] leading-none mb-6">
        Phân quyền user
      </h1>

      <div className="bg-white border border-border-soft rounded-2xl p-4 mb-4">
        <label className="grid gap-1.5">
          <span className="text-[11px] font-display font-bold uppercase tracking-[0.12em] text-primary">Tìm kiếm</span>
          <input
            type="search"
            placeholder="Email hoặc tên…"
            value={q}
            onChange={e => setQ(e.target.value)}
            className="border border-border-soft rounded-full px-4 py-2 text-[13px] bg-white focus:outline-none focus:border-primary"
          />
        </label>
      </div>

      {isLoading ? (
        <div className="text-muted text-[14px] p-8 text-center">Đang tải…</div>
      ) : users.length === 0 ? (
        <div className="bg-white border border-border-soft rounded-2xl p-12 text-center text-muted text-[14px]">
          Không có user phù hợp.
        </div>
      ) : (
        <div className="bg-white border border-border-soft rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="bg-[#EAE1C7]">
                <tr>
                  <Th>Email</Th>
                  <Th>Tên</Th>
                  <Th>SĐT</Th>
                  <Th>Provider</Th>
                  <Th>Role hiện tại</Th>
                  <Th>Đổi role</Th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const isSelf = currentUser?.id === u.id
                  return (
                    <tr key={u.id} className="border-t border-border-soft align-middle">
                      <Td className="text-primary font-medium">{u.email}</Td>
                      <Td className="text-muted">{u.name ?? '—'}</Td>
                      <Td className="text-muted">{u.phone ?? '—'}</Td>
                      <Td className="text-muted">{u.provider}</Td>
                      <Td>
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-display font-bold uppercase tracking-[0.1em] ${ROLE_COLORS[u.role]}`}>
                          {u.role}
                        </span>
                        {isSelf && <span className="ml-2 text-[10px] text-muted italic">(bạn)</span>}
                      </Td>
                      <Td>
                        <select
                          value={u.role}
                          disabled={updateRole.isPending}
                          onChange={e => onChangeRole(u.id, u.email, e.target.value as Role)}
                          className="border border-border-soft rounded-full px-3 py-1.5 text-[12px] bg-white focus:outline-none focus:border-primary disabled:opacity-60"
                        >
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </Td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-4 py-3 font-display font-bold uppercase tracking-[0.1em] text-[11px] text-primary">{children}</th>
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className ?? ''}`}>{children}</td>
}
