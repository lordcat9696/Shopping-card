const columns = [
  { title: 'Shop', links: ['All products', 'Underwear', 'Reusables', 'Accessories'] },
  { title: 'About', links: ['Our promise', 'Materials', 'Journal', 'Contact'] },
  { title: 'Help', links: ['Shipping', 'Returns', 'Size guide', 'FAQ'] },
]

export function Footer() {
  return (
    <footer className="bg-primary-dark text-[rgba(244,238,222,0.8)] pt-[72px] pb-7">
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12">
        <div>
          <a href="/" className="font-display font-black uppercase tracking-wide text-bg text-[28px]">
            Maison<sup className="text-[12px] opacity-70">®</sup> Verde
          </a>
          <p className="mt-4 max-w-[320px] text-[14px] text-[rgba(244,238,222,0.65)] leading-relaxed">
            Thoughtful everyday essentials — made from certified organic materials in small batches. Kind to your body, the planet, and the people who make them.
          </p>
        </div>
        {columns.map(col => (
          <div key={col.title}>
            <h4 className="font-display font-extrabold uppercase tracking-[0.16em] text-[12px] text-bg mb-4">
              {col.title}
            </h4>
            <ul className="grid gap-2.5">
              {col.links.map(l => (
                <li key={l}>
                  <a href="#" className="text-[14px] text-[rgba(244,238,222,0.7)] hover:text-bg">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] border-t border-[rgba(244,238,222,0.12)] mt-12 pt-6 flex justify-between items-center text-[12px] text-[rgba(244,238,222,0.5)]">
        <span>© 2026 Maison Verde. All rights reserved.</span>
        <span>Privacy · Terms · Accessibility</span>
      </div>
    </footer>
  )
}
