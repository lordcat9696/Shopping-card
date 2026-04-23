export function BodyHappyDesign() {
  const bullets = [
    'Second-skin organic cotton',
    'Bonded seams — zero chafe',
    'Four-way stretch recovery',
    'Oeko-Tex verified dyes',
  ]
  return (
    <section className="py-[clamp(56px,8vw,112px)] bg-bg">
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] grid md:grid-cols-[1.1fr_1fr] gap-12 items-center">
        <div>
          <span className="font-display font-bold uppercase tracking-[0.24em] text-[12px] text-primary/60">
            Body-happy design
          </span>
          <h2 className="font-display font-black uppercase text-primary text-[clamp(40px,6vw,96px)] leading-[0.94] tracking-[-0.015em] mt-3">
            Made to<br />
            <em className="not-italic block text-[color:var(--color-accent)]">move with you.</em>
          </h2>
          <p className="mt-5 text-muted max-w-[440px] leading-relaxed text-[16px]">
            Soft seams, breathable weaves, and a cut that stays put. We obsess over the small details so your day feels easy.
          </p>
          <ul className="mt-7 grid gap-3.5">
            {bullets.map(b => (
              <li key={b} className="flex items-center gap-3 text-[14px] font-medium">
                <span className="w-[22px] h-[22px] rounded-full shrink-0 bg-[linear-gradient(135deg,#C5E17A,#7FB069)]" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-[1.1fr_0.9fr] grid-rows-[220px_160px_160px] gap-3">
          <div className="row-span-2 rounded-2xl overflow-hidden relative bg-[linear-gradient(160deg,#C9B58B_0%,#8D6E4A_100%)]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_70%,rgba(31,61,47,0.35),transparent_55%)]" />
          </div>
          <div className="rounded-2xl overflow-hidden bg-[linear-gradient(160deg,#6E9478,#2C4A38)]" />
          <div className="rounded-2xl overflow-hidden bg-[linear-gradient(160deg,#D7C39B,#9C8059)]" />
          <div className="col-span-2 h-[200px] rounded-2xl overflow-hidden flex items-center px-7 bg-[linear-gradient(110deg,#3A6A4E_0%,#1F3D2F_50%,#2F4B3B_100%)]">
            <span className="font-display font-black uppercase text-[clamp(22px,2.2vw,32px)] leading-none tracking-[-0.01em] text-bg">
              Softness,<br />
              <em className="not-italic text-accent-bright">reimagined.</em>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
