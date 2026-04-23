export function Newsletter() {
  return (
    <section className="bg-primary text-bg py-16">
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] grid md:grid-cols-[1.2fr_1fr] gap-10 items-center">
        <div>
          <h3 className="font-display font-black uppercase tracking-[-0.01em] text-[clamp(28px,3.4vw,44px)] leading-none">
            Join the Verde letter.
          </h3>
          <p className="mt-3 max-w-[380px] text-[14px] text-[rgba(244,238,222,0.75)]">
            New drops, field notes, and 10% off your first order. No spam — ever.
          </p>
        </div>
        <form
          onSubmit={e => e.preventDefault()}
          className="flex gap-2.5 border border-[rgba(244,238,222,0.25)] rounded-full p-1.5"
        >
          <input
            type="email"
            required
            placeholder="Your email address"
            aria-label="Email"
            className="flex-1 bg-transparent text-bg px-4 py-2.5 outline-none placeholder:text-[rgba(244,238,222,0.55)]"
          />
          <button
            type="submit"
            className="bg-accent-bright text-primary-dark rounded-full px-5 py-3 font-display font-extrabold uppercase tracking-wider text-[12px]"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  )
}
