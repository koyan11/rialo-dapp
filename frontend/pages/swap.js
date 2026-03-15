import SwapPanel from "../components/SwapPanel";

export default function SwapPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2 text-center">Swap</h1>
      <p className="text-[var(--text-muted)] text-center mb-10">Exchange tokens instantly at fixed oracle prices.</p>
      <SwapPanel />
      <div className="mt-8 glass p-5 text-sm text-[var(--text-muted)]">
        <h3 className="font-semibold text-[var(--text)] mb-3">Price Reference (Mock Oracle)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[["ETH","$3,000"],["RLO","$0.10"],["BTC","$60,000"],["USDT","$1.00"],["USDC","$1.00"]].map(([sym,price]) => (
            <div key={sym} className="bg-[var(--bg)] rounded-xl p-3 flex justify-between">
              <span className="font-medium">{sym}</span>
              <span>{price}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs">0.3% flat fee on all swaps. 5% max slippage applied automatically.</p>
      </div>
    </div>
  );
}
