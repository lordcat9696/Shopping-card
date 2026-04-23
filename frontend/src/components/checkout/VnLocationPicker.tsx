import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

/** Tỉnh/quận/phường của VN qua https://provinces.open-api.vn (public API, miễn phí). */
interface Province { code: number; name: string }
interface District { code: number; name: string }
interface Ward { code: number; name: string }

const BASE = 'https://provinces.open-api.vn/api'

async function fetchProvinces(): Promise<Province[]> {
  const res = await fetch(`${BASE}/p/`)
  if (!res.ok) throw new Error('Không tải được danh sách tỉnh/thành')
  return res.json()
}

async function fetchDistricts(provinceCode: number): Promise<District[]> {
  const res = await fetch(`${BASE}/p/${provinceCode}?depth=2`)
  if (!res.ok) throw new Error('Không tải được danh sách quận/huyện')
  const data = await res.json()
  return data.districts ?? []
}

async function fetchWards(districtCode: number): Promise<Ward[]> {
  const res = await fetch(`${BASE}/d/${districtCode}?depth=2`)
  if (!res.ok) throw new Error('Không tải được danh sách phường/xã')
  const data = await res.json()
  return data.wards ?? []
}

export interface VnLocationValue {
  city: string
  district: string
  ward: string
}

export function VnLocationPicker({
  value,
  onChange,
  required,
}: {
  value: VnLocationValue
  onChange: (v: VnLocationValue) => void
  required?: boolean
}) {
  const { data: provinces = [], isLoading: loadingP } = useQuery({
    queryKey: ['vn', 'provinces'],
    queryFn: fetchProvinces,
    staleTime: Infinity,
    gcTime: Infinity,
  })

  // Map name → code để lookup districts/wards theo tên được chọn
  const provinceCode = useMemo(
    () => provinces.find(p => p.name === value.city)?.code,
    [provinces, value.city],
  )

  const { data: districts = [], isLoading: loadingD } = useQuery({
    queryKey: ['vn', 'districts', provinceCode],
    queryFn: () => fetchDistricts(provinceCode!),
    enabled: Boolean(provinceCode),
    staleTime: Infinity,
    gcTime: Infinity,
  })

  const districtCode = useMemo(
    () => districts.find(d => d.name === value.district)?.code,
    [districts, value.district],
  )

  const { data: wards = [], isLoading: loadingW } = useQuery({
    queryKey: ['vn', 'wards', districtCode],
    queryFn: () => fetchWards(districtCode!),
    enabled: Boolean(districtCode),
    staleTime: Infinity,
    gcTime: Infinity,
  })

  // Reset cấp dưới khi cấp trên đổi (VD đổi tỉnh → clear quận + phường)
  // Guard: chỉ reset nếu giá trị hiện tại không tồn tại trong danh sách mới
  useEffect(() => {
    if (value.district && districts.length > 0 && !districts.find(d => d.name === value.district)) {
      onChange({ ...value, district: '', ward: '' })
    }
  }, [districts, value, onChange])

  useEffect(() => {
    if (value.ward && wards.length > 0 && !wards.find(w => w.name === value.ward)) {
      onChange({ ...value, ward: '' })
    }
  }, [wards, value, onChange])

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <SelectField
        label="Tỉnh / Thành"
        required={required}
        value={value.city}
        loading={loadingP}
        onChange={(city) => onChange({ city, district: '', ward: '' })}
        options={provinces.map(p => ({ value: p.name, label: p.name }))}
        placeholder="Chọn tỉnh/thành"
      />
      <SelectField
        label="Quận / Huyện"
        required={required}
        value={value.district}
        loading={loadingD}
        disabled={!provinceCode}
        onChange={(district) => onChange({ ...value, district, ward: '' })}
        options={districts.map(d => ({ value: d.name, label: d.name }))}
        placeholder={provinceCode ? 'Chọn quận/huyện' : 'Chọn tỉnh trước'}
      />
      <SelectField
        label="Phường / Xã"
        value={value.ward}
        loading={loadingW}
        disabled={!districtCode}
        onChange={(ward) => onChange({ ...value, ward })}
        options={wards.map(w => ({ value: w.name, label: w.name }))}
        placeholder={districtCode ? 'Chọn phường/xã' : 'Chọn quận trước'}
      />
    </div>
  )
}

function SelectField({
  label, value, onChange, options, placeholder, loading, disabled, required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder: string
  loading?: boolean
  disabled?: boolean
  required?: boolean
}) {
  return (
    <label className="grid gap-1.5 min-w-0">
      <span className="text-[12px] font-display font-bold uppercase tracking-[0.12em] text-primary truncate">
        {label}{required && ' *'}
      </span>
      <select
        required={required}
        disabled={disabled || loading}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border-soft rounded-full px-4 py-3 text-[14px] bg-white focus:outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed appearance-none truncate"
      >
        <option value="">{loading ? 'Đang tải…' : placeholder}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  )
}
