const SEGMENTS = [
  'SYSTEM.STATUS: DECENTRALIZED',
  'NODES: ACTIVE',
  'PROTOCOL: v2.0.18',
];

export default function StatusBanner() {
  return (
    <div className="w-full border-b border-emerald-500/20 bg-emerald-500/5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-1 font-mono text-[10px] tracking-widest text-emerald-600 uppercase dark:text-emerald-400">
        {SEGMENTS.map((segment) => (
          <span key={segment} className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {segment}
          </span>
        ))}
      </div>
    </div>
  );
}
