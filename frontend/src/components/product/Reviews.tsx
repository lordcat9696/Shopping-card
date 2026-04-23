import { Star } from 'lucide-react'

const BREAKDOWN = [
  { stars: 5, count: 96 },
  { stars: 4, count: 22 },
  { stars: 3, count: 7 },
  { stars: 2, count: 2 },
  { stars: 1, count: 1 },
]

const SAMPLE_REVIEWS = [
  {
    name: 'Minh T.',
    date: '2 tuần trước',
    stars: 5,
    title: 'Mát, khô nhanh, đúng form',
    body: 'Mặc đánh pickleball 2 trận liên tiếp, mồ hôi ướt đẫm mà áo vẫn khô nhanh. Form vừa, không bí. Sẽ mua thêm màu khác.',
    size: 'M', color: 'Navy',
  },
  {
    name: 'Ngọc A.',
    date: '1 tháng trước',
    stars: 5,
    title: 'Chất vải xịn hơn giá tiền',
    body: 'Tanktop co giãn tốt, phần lưng ôm body đẹp. Đường may phẳng, không cấn da. Recommend cho ai tập cardio + gym.',
    size: 'S', color: 'Đen',
  },
  {
    name: 'Huy P.',
    date: '1 tháng trước',
    stars: 4,
    title: 'Tốt, nhưng nên lên 1 size',
    body: 'Nói chung ổn. Mình nặng 72kg / cao 1m76 bình thường mặc L vừa, Coolmate này hơi ôm nên bạn nào muốn thoải mái hơn thì lên XL.',
    size: 'L', color: 'Xám',
  },
]

export function Reviews() {
  const total = BREAKDOWN.reduce((s, b) => s + b.count, 0)
  const avg = BREAKDOWN.reduce((s, b) => s + b.stars * b.count, 0) / total

  return (
    <section className="bg-bg pt-10 pb-20">
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
        <h2 className="font-display font-black uppercase text-primary text-center text-[clamp(32px,4.2vw,56px)] leading-none tracking-[-0.015em]">
          {total}.000+ khách đã yêu
        </h2>

        <div className="grid md:grid-cols-[320px_1fr] gap-10 mt-10">
          <aside>
            <div className="flex items-baseline gap-3">
              <span className="font-display font-black text-[56px] leading-none text-primary">{avg.toFixed(1)}</span>
              <div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className="fill-primary text-primary" strokeWidth={0} />
                  ))}
                </div>
                <div className="text-[13px] text-muted mt-1">{total} đánh giá</div>
              </div>
            </div>

            <ul className="mt-6 grid gap-2">
              {BREAKDOWN.map(b => {
                const pct = (b.count / total) * 100
                return (
                  <li key={b.stars} className="flex items-center gap-3 text-[13px]">
                    <span className="w-5 text-primary font-display font-bold">{b.stars}★</span>
                    <div className="flex-1 h-2 rounded-full bg-border-soft overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-muted text-right">{b.count}</span>
                  </li>
                )
              })}
            </ul>

            <button
              type="button"
              className="mt-6 w-full font-display font-bold text-[12px] uppercase tracking-[0.14em] border border-primary text-primary rounded-full py-3 hover:bg-primary hover:text-bg transition-colors"
            >
              Viết đánh giá
            </button>
          </aside>

          <ul className="grid gap-5">
            {SAMPLE_REVIEWS.map((r, i) => (
              <li key={i} className="bg-white border border-border-soft rounded-2xl p-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-[linear-gradient(135deg,#C5E17A,#7FB069)] text-primary-dark font-display font-extrabold text-[12px] inline-flex items-center justify-center">
                      {r.name.charAt(0)}
                    </span>
                    <div>
                      <div className="font-display font-bold text-[14px] text-primary">{r.name}</div>
                      <div className="text-[12px] text-muted">{r.date} · Size {r.size} · {r.color}</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.stars }).map((_, k) => (
                      <Star key={k} size={13} className="fill-primary text-primary" strokeWidth={0} />
                    ))}
                  </div>
                </div>
                <h4 className="font-display font-bold uppercase tracking-wider text-[14px] text-primary mt-3">{r.title}</h4>
                <p className="text-[14px] text-muted leading-relaxed mt-1">{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
