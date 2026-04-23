import { ProductSilhouette } from './ProductSilhouette'

const ROWS = [
  { size: 'XS', chest: '78–82', waist: '60–64', hip: '84–88', weight: '42–47' },
  { size: 'S',  chest: '82–86', waist: '64–68', hip: '88–92', weight: '47–52' },
  { size: 'M',  chest: '86–92', waist: '68–74', hip: '92–97', weight: '52–58' },
  { size: 'L',  chest: '92–98', waist: '74–80', hip: '97–102', weight: '58–66' },
  { size: 'XL', chest: '98–104', waist: '80–86', hip: '102–108', weight: '66–75' },
  { size: 'XXL', chest: '104–110', waist: '86–92', hip: '108–114', weight: '75–85' },
]

export function FitGuide() {
  return (
    <section className="bg-bg" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
          <h2 className="font-display font-black uppercase text-primary text-[clamp(28px,3.4vw,44px)] leading-none tracking-[-0.01em]">
            Fit & Feel
          </h2>
          <p className="text-muted text-[14px] max-w-[420px]">
            Chọn size theo số đo cơ thể. Dáng ôm — nếu bạn thích thoải mái, lên 1 size so với bảng.
          </p>
        </div>

        <div className="grid md:grid-cols-[1.1fr_1fr] gap-10 items-start">
          <div className="grid grid-cols-2 gap-4">
            {(['brief', 'bikini', 'boyshort', 'chill'] as const).map(v => (
              <div key={v} className="bg-white border border-border-soft rounded-2xl p-4 aspect-square flex flex-col items-center justify-between">
                <ProductSilhouette variant={v} className="w-2/3" />
                <span className="font-display font-bold uppercase tracking-[0.14em] text-[11px] text-primary">
                  {labelOf(v)}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-white border border-border-soft rounded-2xl overflow-hidden">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-[#EAE1C7]">
                  <Th>Size</Th>
                  <Th>Ngực (cm)</Th>
                  <Th>Eo (cm)</Th>
                  <Th>Hông (cm)</Th>
                  <Th>Cân nặng (kg)</Th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(r => (
                  <tr key={r.size} className="border-t border-border-soft">
                    <Td bold>{r.size}</Td>
                    <Td>{r.chest}</Td>
                    <Td>{r.waist}</Td>
                    <Td>{r.hip}</Td>
                    <Td>{r.weight}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-4 py-3 font-display font-bold uppercase tracking-[0.1em] text-[11px] text-primary">{children}</th>
}

function Td({ children, bold }: { children: React.ReactNode; bold?: boolean }) {
  return <td className={`px-4 py-3 ${bold ? 'font-display font-bold text-primary' : 'text-muted'}`}>{children}</td>
}

function labelOf(v: 'brief' | 'bikini' | 'boyshort' | 'chill') {
  switch (v) {
    case 'brief': return 'Regular'
    case 'bikini': return 'Fitted'
    case 'boyshort': return 'Shorts'
    case 'chill': return 'Relaxed'
  }
}
