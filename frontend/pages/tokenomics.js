const TOKENS_DATA = [
  { symbol: "RLO",  name: "Rialo Token",        supply: "1,000,000,000", color: "#4f46e5", use: "Governance, staking rewards, faucet" },
  { symbol: "BTC",  name: "Bitcoin Test",        supply: "1,000,000,000", color: "#F7931A", use: "Swap & staking demo, BTC simulation" },
  { symbol: "USDT", name: "Tether Test",         supply: "1,000,000,000", color: "#26A17B", use: "Stable swap pair, staking demo"       },
  { symbol: "USDC", name: "USD Coin Test",       supply: "1,000,000,000", color: "#2775CA", use: "Stable swap pair, staking demo"       },
];

const RLO_ALLOCATION = [
  { label: "Community / Public",  pct: 40, color: "#4f46e5" },
  { label: "Staking Rewards",     pct: 25, color: "#818cf8" },
  { label: "Team & Advisors",     pct: 15, color: "#c084fc" },
  { label: "Treasury",            pct: 10, color: "#e879f9" },
  { label: "Faucet Reserve",      pct: 10, color: "#f0abfc" },
];

function DonutChart({ segments }) {
  let offset = 0;
  const r = 80, cx = 100, cy = 100, circ = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48">
      {segments.map((s) => {
        const dash = (s.pct / 100) * circ;
        const gap  = circ - dash;
        const el = (
          <circle key={s.label} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth="28"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          />
        );
        offset += dash;
        return el;
      })}
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-current text-xs font-bold">RLO</text>
    </svg>
  );
}

export default function Tokenomics() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Tokenomics</h1>
      <p className="text-[var(--text-muted)] mb-10">Overview of the Rialo token ecosystem on Sepolia testnet.</p>

      {/* Token cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {TOKENS_DATA.map((t) => (
          <div key={t.symbol} className="glass p-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold mb-3" style={{ background: t.color }}>{t.symbol[0]}</div>
            <div className="font-bold">{t.symbol}</div>
            <div className="text-xs text-[var(--text-muted)] mb-2">{t.name}</div>
            <div className="text-sm font-semibold">{t.supply}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">{t.use}</div>
          </div>
        ))}
      </div>

      {/* RLO allocation */}
      <div className="glass p-8 mb-8">
        <h2 className="text-xl font-bold mb-6">RLO Token Allocation</h2>
        <div className="flex flex-col md:flex-row items-center gap-10">
          <DonutChart segments={RLO_ALLOCATION} />
          <div className="flex-1 space-y-3 w-full">
            {RLO_ALLOCATION.map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <span className="text-sm">{s.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-24 bg-[var(--bg)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                  <span className="text-sm font-bold w-10 text-right">{s.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Staking APR table */}
      <div className="glass p-6">
        <h2 className="text-xl font-bold mb-5">Staking Rewards</h2>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[var(--border)] text-[var(--text-muted)]">
            {["Token","APR","Reward Token","Lock Period"].map(h=><th key={h} className="text-left py-2 px-3 font-medium">{h}</th>)}
          </tr></thead>
          <tbody>
            {[["RLO","10%","RLO","None"],["BTC","8%","RLO","None"],["USDT","6%","RLO","None"],["USDC","6%","RLO","None"]].map(([t,apr,r,lock])=>(
              <tr key={t} className="border-b border-[var(--border)] hover:bg-[var(--bg)]">
                <td className="py-3 px-3"><span className="badge">{t}</span></td>
                <td className="py-3 px-3 font-bold text-accent">{apr}</td>
                <td className="py-3 px-3">{r}</td>
                <td className="py-3 px-3 text-green-400">{lock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
