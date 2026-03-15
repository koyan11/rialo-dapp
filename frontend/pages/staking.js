import { useAccount, useWriteContract } from "wagmi";
import { STAKING_POOLS, CONTRACT_ADDRESSES, STAKING_ABI } from "../utils/contracts";
import StakingPool from "../components/StakingPool";
import toast from "react-hot-toast";

export default function StakingPage() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const claimAll = async () => {
    if (!isConnected) return toast.error("Connect wallet first");
    try {
      await writeContractAsync({ address: CONTRACT_ADDRESSES.STAKING, abi: STAKING_ABI, functionName: "claimAllRewards" });
      toast.success("All rewards claimed!");
    } catch (e) { toast.error(e.shortMessage || "Nothing to claim"); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Staking</h1>
          <p className="text-[var(--text-muted)]">Stake tokens and earn RLO rewards.</p>
        </div>
        {isConnected && (
          <button className="btn-accent px-6 py-3" onClick={claimAll} style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
            ⚡ Claim All Rewards
          </button>
        )}
      </div>

      {/* APR Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {STAKING_POOLS.map((p) => (
          <div key={p.pid} className="glass p-4 text-center">
            <div className="text-2xl font-extrabold" style={{ color: p.color }}>{p.apr}%</div>
            <div className="text-sm text-[var(--text-muted)] mt-1">{p.symbol} APR</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {STAKING_POOLS.map((pool) => (
          <StakingPool key={pool.pid} pool={pool} />
        ))}
      </div>

      <div className="glass p-5 mt-8 text-sm text-[var(--text-muted)]">
        <p>⚠️ This is a testnet demo. Rewards are calculated per-second based on APR. Claim at any time. No lockup period.</p>
      </div>
    </div>
  );
}
