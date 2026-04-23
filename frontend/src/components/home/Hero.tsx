import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative bg-primary text-bg overflow-hidden">
      <div className="grid md:grid-cols-2 min-h-[560px]">
        <div className="flex flex-col justify-center gap-6 px-[clamp(20px,4vw,56px)] py-[clamp(48px,7vw,96px)]">
          <span className="font-display font-bold uppercase tracking-[0.24em] text-[12px] text-accent-bright">
            Earth Day · Seasonal Edit
          </span>
          <h1 className="font-display font-black uppercase leading-[0.92] tracking-[-0.02em] text-[clamp(56px,9vw,128px)]">
            Stay<br />kind to<br /><em className="not-italic text-accent-bright">every&nbsp;day.</em>
          </h1>
          <p className="max-w-[440px] leading-relaxed text-[16px] text-[rgba(244,238,222,0.82)]">
            A sustainable edit of everyday essentials — made from certified organic cotton, shipped carbon-neutral, designed to last seasons.
          </p>
          <div className="flex gap-3.5 mt-2 flex-wrap">
            <Button>Shop the edit →</Button>
            <Button variant="ghost">Our promise</Button>
          </div>
        </div>

        <div className="relative flex items-end justify-center overflow-hidden
          bg-[radial-gradient(120%_120%_at_80%_20%,rgba(197,225,122,0.25),transparent_60%),linear-gradient(160deg,#2A5240_0%,#1A3527_100%)]">
          <svg viewBox="0 0 440 560" className="relative z-[2] w-[88%] max-w-[520px]" aria-hidden>
            <defs>
              <linearGradient id="heroFabric" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#F4EEDE" stopOpacity="0.98" />
                <stop offset="1" stopColor="#C5E17A" stopOpacity="0.55" />
              </linearGradient>
              <radialGradient id="heroGlow" cx="0.5" cy="0.45" r="0.55">
                <stop offset="0" stopColor="#C5E17A" stopOpacity="0.35" />
                <stop offset="1" stopColor="#C5E17A" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="220" cy="260" r="230" fill="url(#heroGlow)" />
            <ellipse cx="220" cy="520" rx="180" ry="16" fill="#0F2418" opacity="0.35" />
            <path d="M70 180 Q220 110 370 180 L360 360 Q330 460 220 510 Q110 460 80 360 Z" fill="url(#heroFabric)" />
            <path d="M110 210 Q220 150 330 210 L322 345 Q300 430 220 475 Q140 430 118 345 Z" fill="#fff" opacity="0.18" />
            <path d="M70 180 Q220 110 370 180 L370 212 Q220 146 70 212 Z" fill="#0F2418" opacity="0.25" />
            <rect x="195" y="310" width="50" height="65" rx="8" fill="#1F3D2F" opacity="0.9" />
            <text x="220" y="352" textAnchor="middle" fill="#C5E17A" fontFamily="Archivo" fontWeight="900" fontSize="22" letterSpacing="1">V®</text>
          </svg>
          <div className="absolute left-8 bottom-8 z-[3] flex flex-col gap-2.5 font-display uppercase tracking-[0.18em] text-[11px]">
            <span className="bg-[rgba(26,53,39,0.6)] px-3.5 py-2 rounded-full backdrop-blur-[6px]">Organic cotton</span>
            <span className="bg-[rgba(26,53,39,0.6)] px-3.5 py-2 rounded-full backdrop-blur-[6px]">GOTS certified</span>
            <span className="bg-[rgba(26,53,39,0.6)] px-3.5 py-2 rounded-full backdrop-blur-[6px]">Carbon neutral</span>
          </div>
        </div>
      </div>
    </section>
  )
}
