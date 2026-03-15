import { formatEther } from "ethers";

export default function TokenCard({ token, balance }) {
  const formatted = balance
    ? parseFloat(formatEther(balance)).toLocaleString(undefined, { maximumFractionDigits: 4 })
    : "—";

  return (
    <div className="stat-card flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${token.color}, ${token.color}88)` }}
      >
        {token.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-[var(--text-muted)] font-medium">{token.name}</div>
        <div className="text-xl font-bold truncate">{formatted}</div>
      </div>
      <div className="badge">{token.symbol}</div>
    </div>
  );
}
