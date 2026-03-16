import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";

const STAKING_ADDRESS = "0xD8F3000250EdC37b1A6c6c201905d26Db10C8f8f";

function pad(val, len=64) { return val.toString(16).replace('0x','').padStart(len,'0'); }

export default function StakingPool({ pool }) {
  const { address } = useAccount();
  const [stakeAmount, setStakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [tab, setTab] = useState("stake");
  const [stakedAmount, setStakedAmount] = useState("0");
  const [reward, setReward] = useState("0");
  const [isPending, setIsPending] = useState(false);

  const fetchData = async () => {
    if (!address || !window.ethereum) return;
    try {
      const pidHex = pad(pool.pid);
      const addrHex = pad(address);
      const userInfoSel = '0x1959a002';
      const r1 = await window.ethereum.request({ method: 'eth_call', params: [{ to: STAKING_ADDRESS, data: userInfoSel + pidHex + addrHex }, 'latest'] });
      if (r1 && r1 !== '0x' && r1.length >= 66) { setStakedAmount((Number(BigInt('0x' + r1.slice(2,66))) / 1e18).toFixed(4)); }
      const pendingSel = '0x90b43b4e';
      const r2 = await window.ethereum.request({ method: 'eth_call', params: [{ to: STAKING_ADDRESS, data: pendingSel + pidHex + addrHex }, 'latest'] });
      if (r2 && r2 !== '0x') { setReward((Number(BigInt(r2)) / 1e18).toFixed(6)); }
    } catch(e) { console.error('fetchData error', e); }
  };

  useEffect(() => { if (address) fetchData(); }, [address]);

  const sendTx = async (to, data) => {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{ from: address, to, data, gas: '0x493E0' }],
    });
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const receipt = await window.ethereum.request({ method: 'eth_getTransactionReceipt', params: [txHash] });
      if (receipt) return receipt.status === '0x1';
    }
    return false;
  };

  const handleStake = async () => {
    if (!stakeAmount || !address) return;
    try {
      setIsPending(true);
      const amt = BigInt(Math.floor(parseFloat(stakeAmount) * 1e18));
      const appData = '0x095ea7b3' + pad(STAKING_ADDRESS) + pad(amt);
      await sendTx(pool.address, appData);
      const stakeData = '0x1e9a6950' + pad(pool.pid) + pad(amt);
      const ok = await sendTx(STAKING_ADDRESS, stakeData);
      if (ok) { toast.success('Staked ' + stakeAmount + ' ' + pool.symbol + '!'); setStakeAmount(""); fetchData(); }
      else toast.error('Staking failed');
    } catch(e) { console.error(e); toast.error(e.message || 'Staking failed'); }
    finally { setIsPending(false); }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !address) return;
    try {
      setIsPending(true);
      const amt = BigInt(Math.floor(parseFloat(withdrawAmount) * 1e18));
      const data = '0x2e1a7d4d' + pad(pool.pid) + pad(amt);
      const ok = await sendTx(STAKING_ADDRESS, data);
      if (ok) { toast.success('Withdrawn!'); setWithdrawAmount(""); fetchData(); }
      else toast.error('Withdraw failed');
    } catch(e) { console.error(e); toast.error(e.message || 'Withdraw failed'); }
    finally { setIsPending(false); }
  };

  const handleClaim = async () => {
    if (!address) return;
    try {
      setIsPending(true);
      const data = '0x0a428523' + pad(pool.pid);
      const ok = await sendTx(STAKING_ADDRESS, data);
      if (ok) { toast.success('Rewards claimed!'); fetchData(); }
      else toast.error('Claim failed');
    } catch(e) { console.error(e); toast.error(e.message || 'Claim failed'); }
    finally { setIsPending(false); }
  };

  return (
    <div className="glass p-6 hover:glow transition-all">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: pool.color }}>{pool.symbol[0]}</div>
          <div><div className="font-semibold">{pool.name}</div><div className="text-xs text-[var(--text-muted)]">Earn RLO</div></div>
        </div>
        <div className="text-right"><div className="text-2xl font-bold text-accent">{pool.apr}%</div><div className="text-xs text-[var(--text-muted)]">APR</div></div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-[var(--bg)] rounded-xl p-3"><div className="text-xs text-[var(--text-muted)]">Staked</div><div className="font-semibold text-sm">{stakedAmount} {pool.symbol}</div></div>
        <div className="bg-[var(--bg)] rounded-xl p-3"><div className="text-xs text-[var(--text-muted)]">Pending RLO</div><div className="font-semibold text-sm text-accent">{reward}</div></div>
      </div>
      <div className="flex gap-1 mb-4 bg-[var(--bg)] rounded-xl p-1">
        {["stake","withdraw"].map(t => (
          <button key={t} onClick={() => setTab(t)} className={"flex-1 py-1.5 rounded-lg text-sm font-medium capitalize transition-all " + (tab===t ? "bg-accent text-white" : "text-[var(--text-muted)]")}>{t}</button>
        ))}
      </div>
      {tab === "stake" ? (
        <div className="space-y-3">
          <input className="input-field" placeholder={"Amount " + pool.symbol} value={stakeAmount} onChange={e => setStakeAmount(e.target.value)} type="number" min="0" />
          <button className="btn-accent w-full" onClick={handleStake} disabled={!stakeAmount || !address || isPending}>Stake {pool.symbol}</button>
        </div>
      ) : (
        <div className="space-y-3">
          <input className="input-field" placeholder={"Amount " + pool.symbol} value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} type="number" min="0" />
          <button className="btn-ghost w-full" onClick={handleWithdraw} disabled={!withdrawAmount || !address || isPending}>Withdraw {pool.symbol}</button>
        </div>
      )}
      <button className="btn-accent w-full mt-3" onClick={handleClaim} disabled={!address || reward === "0" || isPending} style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
        Claim {reward} RLO
      </button>
    </div>
  );
}