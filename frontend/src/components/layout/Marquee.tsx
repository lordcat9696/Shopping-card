const items = [
  'Free shipping over $60',
  'Planet-first materials',
  'Made in small batches',
  '365-day returns',
]

export function Marquee() {
  const doubled = [...items, ...items]
  return (
    <div className="bg-accent-bright text-primary-dark overflow-hidden border-y border-primary-dark">
      <div className="flex gap-14 py-3.5 font-display font-extrabold uppercase tracking-[0.18em] text-[14px] whitespace-nowrap animate-marquee w-[200%]">
        {doubled.map((txt, i) => (
          <span key={i} className="before:content-['✦'] before:mr-14 before:opacity-60">
            {txt}
          </span>
        ))}
      </div>
    </div>
  )
}
