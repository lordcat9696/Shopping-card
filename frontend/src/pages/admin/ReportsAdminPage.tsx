import { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useOrderStats } from '@/lib/queries'
import { formatPrice } from '@/lib/utils'
import type { OrderStatus } from '@/types/api'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Chờ xử lý',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã huỷ',
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: '#F59E0B',
  CONFIRMED: '#3B82F6',
  SHIPPING: '#8B5CF6',
  DELIVERED: '#10B981',
  CANCELLED: '#EF4444',
}

const MAX_RANGE_DAYS = 365  // giới hạn 1 năm

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function daysAgoIso(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

function addDaysIso(iso: string, days: number) {
  const d = new Date(iso)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function diffDays(a: string, b: string) {
  const da = new Date(a).getTime()
  const db = new Date(b).getTime()
  return Math.round((db - da) / (1000 * 60 * 60 * 24))
}

export function ReportsAdminPage() {
  const [from, setFrom] = useState(daysAgoIso(29))
  const [to, setTo] = useState(todayIso())
  const [status, setStatus] = useState<OrderStatus | ''>('')

  const { data, isLoading } = useOrderStats(from, to, status || undefined)

  // Clamp: nếu range > 1 năm thì kéo cái kia theo
  const handleFrom = (v: string) => {
    setFrom(v)
    if (diffDays(v, to) > MAX_RANGE_DAYS) {
      setTo(addDaysIso(v, MAX_RANGE_DAYS))
    }
  }
  const handleTo = (v: string) => {
    setTo(v)
    if (diffDays(from, v) > MAX_RANGE_DAYS) {
      setFrom(addDaysIso(v, -MAX_RANGE_DAYS))
    }
  }

  // HTML date input min/max để hạn chế 1 năm
  const fromMax = to
  const fromMin = addDaysIso(to, -MAX_RANGE_DAYS)
  const toMin = from
  const toMaxByRange = addDaysIso(from, MAX_RANGE_DAYS)
  const toMax = toMaxByRange < todayIso() ? toMaxByRange : todayIso()

  return (
    <div>
      <h1 className="font-display font-black uppercase text-primary text-[clamp(24px,3vw,34px)] leading-none mb-6">
        Báo cáo
      </h1>

      <div className="bg-white border border-border-soft rounded-2xl p-4 mb-2 flex flex-wrap gap-3 items-end">
        <label className="grid gap-1.5">
          <span className="text-[11px] font-display font-bold uppercase tracking-[0.12em] text-primary">Từ ngày</span>
          <input type="date" value={from} onChange={e => handleFrom(e.target.value)} min={fromMin} max={fromMax}
            className="border border-border-soft rounded-full px-4 py-2 text-[13px] bg-white focus:outline-none focus:border-primary" />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[11px] font-display font-bold uppercase tracking-[0.12em] text-primary">Đến ngày</span>
          <input type="date" value={to} onChange={e => handleTo(e.target.value)} min={toMin} max={toMax}
            className="border border-border-soft rounded-full px-4 py-2 text-[13px] bg-white focus:outline-none focus:border-primary" />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[11px] font-display font-bold uppercase tracking-[0.12em] text-primary">Trạng thái</span>
          <select value={status} onChange={e => setStatus(e.target.value as OrderStatus | '')}
            className="border border-border-soft rounded-full px-4 py-2 text-[13px] bg-white focus:outline-none focus:border-primary">
            <option value="">Tất cả</option>
            {(Object.keys(STATUS_LABELS) as OrderStatus[]).map(s => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </label>
        <div className="flex gap-2 ml-auto">
          <PresetButton onClick={() => { setFrom(daysAgoIso(6)); setTo(todayIso()) }}>7 ngày</PresetButton>
          <PresetButton onClick={() => { setFrom(daysAgoIso(29)); setTo(todayIso()) }}>30 ngày</PresetButton>
          <PresetButton onClick={() => { setFrom(daysAgoIso(89)); setTo(todayIso()) }}>90 ngày</PresetButton>
          <PresetButton onClick={() => { setFrom(daysAgoIso(364)); setTo(todayIso()) }}>1 năm</PresetButton>
        </div>
      </div>
      <p className="text-[12px] text-muted mb-6">Tối đa tìm trong 1 năm.</p>

      {isLoading || !data ? (
        <div className="text-muted text-[14px] p-8 text-center">Đang tải…</div>
      ) : (
        <div className="grid gap-6 min-w-0">
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <SummaryCard label="Tổng đơn" value={String(data.totalOrders)} />
            <SummaryCard label="Tổng doanh thu" value={formatPrice(data.totalRevenue)} />
            <SummaryCard
              label="Trung bình / đơn"
              value={data.totalOrders > 0 ? formatPrice(Math.round(data.totalRevenue / data.totalOrders)) : '—'}
            />
          </div>

          {/* Daily bar chart */}
          <div className="bg-white border border-border-soft rounded-2xl p-5 min-w-0">
            <h2 className="font-display font-extrabold uppercase text-primary text-[13px] tracking-[0.14em] mb-5">
              Số đơn theo ngày {status && <span className="text-muted font-normal normal-case tracking-normal">· {STATUS_LABELS[status as OrderStatus]}</span>}
            </h2>
            {data.daily.length === 0 ? (
              <div className="text-muted text-[13px] text-center py-10">Không có dữ liệu trong khoảng này.</div>
            ) : (
              <DailyBarChart daily={data.daily} />
            )}
          </div>

          {/* Status breakdown */}
          <div className="bg-white border border-border-soft rounded-2xl p-5 min-w-0">
            <h2 className="font-display font-extrabold uppercase text-primary text-[13px] tracking-[0.14em] mb-5">
              Phân bố theo trạng thái
              <span className="text-muted font-normal normal-case tracking-normal ml-1">(toàn bộ trong khoảng, không áp filter status)</span>
            </h2>
            {data.statusBreakdown.length === 0 ? (
              <div className="text-muted text-[13px] text-center py-6">Không có dữ liệu.</div>
            ) : (
              <StatusBreakdown breakdown={data.statusBreakdown} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function DailyBarChart({ daily }: { daily: { date: string; count: number; revenue: number }[] }) {
  // Scroll ngang: tính width theo số ngày (~40px/ngày), min = container width.
  const minWidth = Math.max(600, daily.length * 40)

  const chartData = {
    labels: daily.map(d => d.date.slice(5)),  // MM-DD
    datasets: [
      {
        label: 'Số đơn',
        data: daily.map(d => d.count),
        backgroundColor: '#1F3D2F',
        borderRadius: 4,
        // Ẩn revenue khỏi dataset nhưng gắn vào để tooltip lấy
        revenueData: daily.map(d => d.revenue),
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items: { dataIndex: number }[]) => daily[items[0].dataIndex].date,
          label: (ctx: { dataIndex: number; parsed: { y: number } }) => {
            const d = daily[ctx.dataIndex]
            return [`${d.count} đơn`, `Doanh thu: ${formatPrice(d.revenue)}`]
          },
        },
        backgroundColor: '#1F3D2F',
        titleFont: { size: 12, weight: 'bold' as const },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6B6B6B', font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#6B6B6B', font: { size: 11 }, stepSize: 1, precision: 0 },
        grid: { color: '#E3DCC9', tickLength: 0 },
      },
    },
  }

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth, height: 260 }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}

function StatusBreakdown({ breakdown }: {
  breakdown: { status: OrderStatus; count: number; revenue: number }[]
}) {
  const total = breakdown.reduce((s, b) => s + b.count, 0)
  return (
    <div className="grid gap-3">
      {breakdown.map(b => {
        const pct = total > 0 ? (b.count / total) * 100 : 0
        return (
          <div key={b.status} className="grid grid-cols-[140px_1fr_80px_140px] gap-4 items-center text-[13px]">
            <span className="font-display font-bold uppercase tracking-[0.1em] text-[11px] text-primary">
              {STATUS_LABELS[b.status]}
            </span>
            <div className="h-2 rounded-full bg-border-soft overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: STATUS_COLORS[b.status] }} />
            </div>
            <span className="text-primary tabular-nums text-right">{b.count} đơn</span>
            <span className="text-muted tabular-nums text-right">{formatPrice(b.revenue)}</span>
          </div>
        )
      })}
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-border-soft rounded-2xl p-5">
      <div className="text-[11px] uppercase tracking-[0.12em] text-muted font-display font-bold">{label}</div>
      <div className="font-display font-black text-primary text-[24px] mt-1.5">{value}</div>
    </div>
  )
}

function PresetButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button" onClick={onClick}
      className="text-[11px] font-display font-bold uppercase tracking-[0.1em] border border-border-soft text-primary rounded-full px-3 py-2 hover:border-primary transition-colors"
    >
      {children}
    </button>
  )
}
