import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";

const RLO_ADDRESS = "0x4a4946A86e8C02766639c1A0578bBdd5ae8fC046";

function Countdown({ target }) {
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    const tick = () => { const diff = Number(target) * 1000 - Date.now(); setRemaining(diff > 0 ? diff : 0); };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  if (remaining <= 0) return <span className="text-green-400 font-semibold">Ready to claim!</span>;
  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
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
  const [isPending, setIsPending] = useState(false);
  const [nextClaim, setNextClaim] = useState(0);
  const [rloBalance, setRloBalance] = useState("0");

  const fetchData = async () => {
    if (!address || !window.ethereum) return;
    try {
      const balSig = "0x70a08231" + address.slice(2).padStart(64, "0");
      const balResult = await window.ethereum.request({ method: "eth_call", params: [{ to: RLO_ADDRESS, data: balSig }, "latest"] });
      if (balResult && balResult !== "0x") { const bal = Number(BigInt(balResult)) / 1e18; setRloBalance(bal.toLocaleString()); }
      const claimSig = "0x1a7db3b5" + address.slice(2).padStart(64, "0");
      const claimResult = await window.ethereum.request({ method: "eth_call", params: [{ to: RLO_ADDRESS, data: claimSig }, "latest"] });
      if (claimResult && claimResult !== "0x") { setNextClaim(Number(BigInt(claimResult))); }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { if (isConnected && address) fetchData(); }, [isConnected, address]);

  const canClaim = !nextClaim || nextClaim === 0;

  const handleClaim = async () => {
    if (!isConnected) return toast.error("Connect your wallet first");
    if (!window.ethereum) return toast.error("MetaMask not found");
    try {
      setIsPending(true);
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{ from: address, to: RLO_ADDRESS, data: "0x3501d34d", gas: "0x186A0" }],
      });
      toast.success("Transaction sent! Waiting for confirmation...");
      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 2000));
        const receipt = await window.ethereum.request({ method: "eth_getTransactionReceipt", params: [txHash] });
        if (receipt) {
          if (receipt.status === "0x1") { toast.success("1,000 RLO claimed successfully!"); fetchData(); }
          else { toast.error("Transaction failed"); }
          break;
        }
      }
    } catch (e) { console.error(e); toast.error(e.message || "Claim failed"); }
    finally { setIsPending(false); }
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
              <div className="text-3xl font-bold gradient-text">{rloBalance} RLO</div>
            </div>
            {canClaim ? (
              <button className="btn-accent w-full text-base py-4 mb-4" onClick={handleClaim} disabled={isPending}>
                {isPending ? "Claiming..." : "Claim 1,000 RLO"}
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