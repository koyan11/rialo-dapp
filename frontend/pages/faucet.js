import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatEther } from "viem";
import { CONTRACT_ADDRESSES, RLO_ABI } from "../utils/contracts";
import toast from "react-hot-toast";

function Countdown({ target }) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const tick = () => {
      const diff = Number(target) * 1000 - Date.now();
      setRemaining(diff > 0 ? diff : 0);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (remaining <= 0) return <span className="text-green-400 font-semibold">Ready to claim!</span>;
  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  const s = Math.floor((remaining % 60_000) / 1_000);
  return (
    <div className="flex gap-3 justify-center text-center">
      {[["Hours", h], ["Min", m], ["Sec", s]].map(([label, val]) => (
        <div key={label} className="glass px-4 py-3 min-w-[64px]">
          <div className="text-2xl font-mono font-bold text-accent">{String(val).padStart(2, "0")}</div>
          <div className="text-xs text-[var(--text-muted)]">{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Faucet() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync, data: txHash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const { data: nextClaim, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.RLO,
    abi: RLO_ABI,
    functionName: "getNextClaimTime",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    enabled: !!address,
  });

  const { data: rloBalance, refetch: refetchBal } = useReadContract({
    address: CONTRACT_ADDRESSES.RLO,
    abi: RLO_ABI,
    functionName: "balanceOf",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    enabled: !!address,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("🎉 1,000 RLO claimed successfully!");
      refetch(); refetchBal();
    }
  }, [isSuccess]);

  const canClaim = !nextClaim || nextClaim === 0n;

  const handleClaim = async () => {
    if (!isConnected) return toast.error("Connect your wallet first");
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.RLO,
        abi: RLO_ABI,
        functionName: "claimFaucet",
      });
    } catch (e) {
      toast.error(e.shortMessage || "Claim failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">🪙</div>
      <h1 className="text-3xl font-bold mb-2">RLO Faucet</h1>
      <p className="text-[var(--text-muted)] mb-10">Claim 1,000 RLO tokens every 24 hours to use across the Rialo ecosystem.</p>

      <div className="glass p-8 mb-6">
        {isConnected ? (
          <>
            <div className="mb-6">
              <div className="text-sm text-[var(--text-muted)] mb-1">Your RLO Balance</div>
              <div className="text-3xl font-bold gradient-text">
                {rloBalance ? parseFloat(formatEther(rloBalance)).toLocaleString() : "0"} RLO
              </div>
            </div>

            {canClaim ? (
              <button
                className="btn-accent w-full text-base py-4 mb-4"
                onClick={handleClaim}
                disabled={isPending}
              >
                {isPending ? "⏳ Claiming..." : "⚡ Claim 1,000 RLO"}
              </button>
            ) : (
              <div className="mb-4">
                <p className="text-sm text-[var(--text-muted)] mb-4">Next claim available in:</p>
                <Countdown target={nextClaim} />
              </div>
            )}

            <p className="text-xs text-[var(--text-muted)]">24-hour cooldown per wallet • 1,000 RLO per claim</p>
          </>
        ) : (
          <p className="text-[var(--text-muted)]">Connect your wallet to claim RLO.</p>
        )}
      </div>

      <div className="glass p-4 text-left">
        <h3 className="font-semibold mb-3 text-sm">What can you do with RLO?</h3>
        <ul className="space-y-2 text-sm text-[var(--text-muted)]">
          {["Swap RLO for ETH, BTC, USDT, USDC", "Stake RLO to earn 10% APR", "Pay for NFT mints", "Explore the Rialo ecosystem"].map((item) => (
            <li key={item} className="flex items-center gap-2"><span className="text-accent">✓</span>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
