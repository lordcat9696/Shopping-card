import { useState } from 'react'
import { VnLocationPicker } from './VnLocationPicker'
import { phoneErrorMessage } from '@/lib/utils'
import type { UserAddressInput } from '@/types/api'

export function AddressForm({
  initial,
  submitLabel = 'Lưu địa chỉ',
  onCancel,
  onSubmit,
  submitting,
  showDefaultToggle = true,
}: {
  initial?: Partial<UserAddressInput>
  submitLabel?: string
  onCancel?: () => void
  onSubmit: (v: UserAddressInput) => void | Promise<void>
  submitting?: boolean
  showDefaultToggle?: boolean
}) {
  const [form, setForm] = useState<UserAddressInput>({
    fullName: initial?.fullName ?? '',
    phone: initial?.phone ?? '',
    line1: initial?.line1 ?? '',
    ward: initial?.ward ?? '',
    district: initial?.district ?? '',
    city: initial?.city ?? '',
    note: initial?.note ?? '',
    isDefault: initial?.isDefault ?? false,
  })
  const [phoneError, setPhoneError] = useState<string | null>(null)

  const update = <K extends keyof UserAddressInput>(k: K, v: UserAddressInput[K]) =>
    setForm(prev => ({ ...prev, [k]: v }))

  const validate = (): boolean => {
    const pe = phoneErrorMessage(form.phone)
    setPhoneError(pe)
    return pe === null
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    void onSubmit({ ...form, phone: form.phone.replace(/[\s-]/g, '') })
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Field
          label="Họ tên" required maxLength={128}
          value={form.fullName} onChange={v => update('fullName', v)}
        />
        <div>
          <Field
            label="SĐT" required type="tel"
            value={form.phone}
            onChange={v => { update('phone', v); if (phoneError) setPhoneError(null) }}
            onBlur={() => setPhoneError(phoneErrorMessage(form.phone))}
          />
          {phoneError && <div className="text-[12px] text-red-700 mt-1">{phoneError}</div>}
        </div>
      </div>

      <Field
        label="Địa chỉ (số nhà, đường)" required maxLength={256}
        value={form.line1} onChange={v => update('line1', v)}
      />

      <VnLocationPicker
        required
        value={{
          city: form.city,
          district: form.district ?? '',
          ward: form.ward ?? '',
        }}
        onChange={(v) => setForm(prev => ({
          ...prev,
          city: v.city,
          district: v.district,
          ward: v.ward,
        }))}
      />

      <label className="grid gap-1.5">
        <span className="text-[12px] font-display font-bold uppercase tracking-[0.12em] text-primary">
          Ghi chú (tuỳ chọn)
        </span>
        <textarea
          value={form.note ?? ''}
          onChange={e => update('note', e.target.value)}
          rows={2}
          maxLength={512}
          className="border border-border-soft rounded-2xl px-4 py-3 text-[14px] bg-white focus:outline-none focus:border-primary resize-none"
        />
      </label>

      {showDefaultToggle && (
        <label className="inline-flex items-center gap-2.5 text-[13px] text-primary cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={e => update('isDefault', e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          Đặt làm địa chỉ mặc định
        </label>
      )}

      <div className="flex gap-3 flex-wrap">
        <button
          type="submit" disabled={submitting}
          className="font-display font-bold uppercase tracking-[0.14em] text-[12px] bg-primary text-bg rounded-full py-3 px-7 hover:bg-primary-dark disabled:opacity-60 transition-colors"
        >
          {submitting ? 'Đang lưu…' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button" onClick={onCancel}
            className="font-display font-bold uppercase tracking-[0.14em] text-[12px] border border-border-soft text-primary rounded-full py-3 px-7 hover:border-primary transition-colors"
          >
            Huỷ
          </button>
        )}
      </div>
    </form>
  )
}

function Field({ label, value, onChange, onBlur, required, type = 'text', maxLength }: {
  label: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  required?: boolean
  type?: string
  maxLength?: number
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[12px] font-display font-bold uppercase tracking-[0.12em] text-primary">
        {label}{required && ' *'}
      </span>
      <input
        type={type} required={required} value={value} maxLength={maxLength}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        className="border border-border-soft rounded-full px-4 py-3 text-[14px] bg-white focus:outline-none focus:border-primary"
      />
    </label>
  )
}
