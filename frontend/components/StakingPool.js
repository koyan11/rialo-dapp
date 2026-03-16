import { useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { parseEther, formatEther } from "viem";
import { CONTRACT_ADDRESSES, STAKING_ABI, ERC20_ABI } from "../utils/contracts";
import toast from "react-hot-toast";

export default function StakingPool({ pool }) {
  const { address } = useAccount();
  const [stakeAmount, setStakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [tab, setTab] = useState("stake");
  const { writeContractAsync } = useWriteContract();

  const { data: userInfo } = useReadContract({
    address: CONTRACT_ADDRESSES.STAKING,
    abi: STAKING_ABI,
    functionName: "userInfo",
    args: [BigInt(pool.pid), address || "0x0000000000000000000000000000000000000000"],
    query: { enabled: !!address },
  });

  const { data: pendingReward } = useReadContract({
    address: CONTRACT_ADDRESSES.STAKING,
    abi: STAKING_ABI,
    functionName: "pendingReward",
    args: [BigInt(pool.pid), address || "0x0000000000000000000000000000000000000000"],
    enabled: !!address,
  });

  const stakedAmount = userInfo ? formatEther(userInfo[0]) : "0";
  const reward = pendingReward ? parseFloat(formatEther(pendingReward)).toFixed(6) : "0";

  const handleStake = async () => {
    if (!stakeAmount || !address) return;
    try {
      const amount = parseEther(stakeAmount);
      await writeContractAsync({ address: pool.address, abi: ERC20_ABI, functionName: "approve", args: [CONTRACT_ADDRESSES.STAKING, amount] });
      await writeContractAsync({ address: CONTRACT_ADDRESSES.STAKING, abi: STAKING_ABI, functionName: "stake", args: [BigInt(pool.pid), amount] });
      toast.success(`Staked ${stakeAmount} ${pool.symbol}!`);
      setStakeAmount("");
    } catch (e) { toast.error(e.shortMessage || "Staking failed"); }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !address) return;
    try {
      await writeContractAsync({ address: CONTRACT_ADDRESSES.STAKING, abi: STAKING_ABI, functionName: "withdraw", args: [BigInt(pool.pid), parseEther(withdrawAmount)] });
      toast.success(`Withdrawn ${withdrawAmount} ${pool.symbol}!`);
      setWithdrawAmount("");
    } catch (e) { toast.error(e.shortMessage || "Withdraw failed"); }
  };

  const handleClaim = async () => {
    if (!address) return;
    try {
      await writeContractAsync({ address: CONTRACT_ADDRESSES.STAKING, abi: STAKING_ABI, functionName: "claimReward", args: [BigInt(pool.pid)] });
      toast.success("Rewards claimed!");
    } catch (e) { toast.error(e.shortMessage || "Claim failed"); }
  };

  return (
    <div className="glass p-6 hover:glow transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: pool.color }}>
            {pool.symbol[0]}
          </div>
          <div>
            <div className="font-semibold">{pool.name}</div>
            <div className="text-xs text-[var(--text-muted)]">Earn RLO</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-accent">{pool.apr}%</div>
          <div className="text-xs text-[var(--text-muted)]">APR</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-[var(--bg)] rounded-xl p-3">
          <div className="text-xs text-[var(--text-muted)]">Staked</div>
          <div className="font-semibold text-sm">{parseFloat(stakedAmount).toFixed(4)} {pool.symbol}</div>
        </div>
        <div className="bg-[var(--bg)] rounded-xl p-3">
          <div className="text-xs text-[var(--text-muted)]">Pending RLO</div>
          <div className="font-semibold text-sm text-accent">{reward}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-[var(--bg)] rounded-xl p-1">
        {["stake", "withdraw"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? "bg-accent text-white" : "text-[var(--text-muted)] hover:text-[var(--text)]"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "stake" ? (
        <div className="space-y-3">
          <input className="input-field" placeholder={`Amount ${pool.symbol}`} value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} type="number" min="0" />
          <button className="btn-accent w-full" onClick={handleStake} disabled={!stakeAmount || !address}>Stake {pool.symbol}</button>
        </div>
      ) : (
        <div className="space-y-3">
          <input className="input-field" placeholder={`Amount ${pool.symbol}`} value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} type="number" min="0" />
          <button className="btn-ghost w-full" onClick={handleWithdraw} disabled={!withdrawAmount || !address}>Withdraw {pool.symbol}</button>
        </div>
      )}

      <button className="btn-accent w-full mt-3" onClick={handleClaim} disabled={!address || reward === "0"} style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
        Claim {reward} RLO
      </button>
    </div>
  );
}
