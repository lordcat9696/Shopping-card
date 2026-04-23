/**
 * "Boost! đột phá thấm hút" — cream bg, headline trái + 3 photo cards.
 */
export function FeatureShowcase() {
  return (
    <section className="bg-bg py-20 border-t border-border-soft">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)]">
          <div className="gap-10 items-center mb-12" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr' }}>
            <div>
              <span className="font-display font-bold uppercase tracking-[0.24em] text-[12px] text-primary/60">
                Công nghệ vải
              </span>
              <h2 className="font-display font-black uppercase text-primary text-[clamp(36px,5vw,72px)] leading-[0.92] tracking-[-0.015em] mt-3">
                Boost!<br />
                <em className="not-italic" style={{ color: 'var(--color-accent)' }}>Đột phá thấm hút.</em>
              </h2>
            </div>
            <p className="text-muted text-[16px] leading-relaxed max-w-[520px]">
              Công nghệ Exdry 3 lớp kết hợp dệt lưới vi điểm — khô nhanh 3× so với cotton,
              không bí bách, ôm body vẫn giữ được sự thoải mái khi di chuyển cường độ cao.
            </p>
          </div>

          <div className="gap-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <PhotoCard
              tag="Lớp ngoài"
              title="Thoáng khí Airflow"
              body="Dệt lưới vi điểm, lưu thông khí liên tục, giữ da mát suốt buổi tập."
              image="/products/ao-tanktop-pickleball-driveshot.jpg"
              accent="#C5E17A"
            />
            <PhotoCard
              tag="Lớp giữa"
              title="Thấm hút Exdry"
              body="Kéo ẩm ra khỏi da trong 3 giây, khô nhanh gấp 3 lần cotton thường."
              image="/products/short-nam-6inch-pickleball-smash.jpg"
              accent="#9DC88D"
            />
            <PhotoCard
              tag="Lớp trong"
              title="Chống trầy chafe"
              body="Đường may flatlock phẳng, ôm body không cấn, không cọ xát."
              image="/products/vay-knit-aline-pickleball.jpg"
              accent="#7FB069"
            />
          </div>
        </div>
    </section>
  )
}

function PhotoCard({
  tag, title, body, image, accent,
}: {
  tag: string
  title: string
  body: string
  image: string
  accent: string
}) {
  return (
    <article className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-border-soft">
        <img src={image} alt="" className="w-full h-full object-cover" />
        <span
          className="absolute top-4 left-4 font-display font-bold uppercase tracking-[0.18em] text-[10px] py-1.5 px-2.5 rounded-full"
          style={{ backgroundColor: accent, color: '#162C21' }}
        >
          {tag}
        </span>
      </div>
      <h3 className="font-display font-black uppercase text-primary text-[18px] tracking-[-0.01em] leading-tight">
        {title}
      </h3>
      <p className="text-[14px] text-muted leading-relaxed">{body}</p>
    </article>
  )
}

