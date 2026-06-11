const logos = [
  { icon: '◆', name: 'Nova Labs' },
  { icon: '▲', name: 'Acme Inc.' },
  { icon: '✦', name: 'Zentry' },
  { icon: '◎', name: 'Leaply' },
  { icon: '⚡', name: 'Volt' },
  { icon: '●', name: 'Cobalt' },
];

export function LogoStrip() {
  return (
    <section className="py-12 bg-white" style={{ borderBottom: '1px solid #E8E6F8' }}>
      <div className="mx-auto max-w-5xl px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#6B6888] mb-8">
          Trusted by startup teams building the future
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logos.map(logo => (
            <div key={logo.name} className="flex items-center gap-2" style={{ color: '#9CA3AF' }}>
              <span className="text-sm font-bold">{logo.icon}</span>
              <span className="text-sm font-semibold tracking-tight">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
