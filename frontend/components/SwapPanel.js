import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useReadContract, useBalance } from "wagmi";
import { parseEther, formatEther } from "viem";
import { CONTRACT_ADDRESSES, SWAP_ABI, ERC20_ABI, TOKENS, ETH_ADDRESS } from "../utils/contracts";
import toast from "react-hot-toast";

export default function SwapPanel() {
  const { address } = useAccount();
  const [fromToken, setFromToken] = useState(TOKENS[0]); // ETH
  const [toToken, setToToken] = useState(TOKENS[1]);     // RLO
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("");
  const { writeContractAsync } = useWriteContract();

  const amountInBig = amountIn && !isNaN(amountIn) ? parseEther(amountIn) : 0n;

  const { data: quote } = useReadContract({
    address: CONTRACT_ADDRESSES.SWAP,
    abi: SWAP_ABI,
    functionName: "getAmountOut",
    args: [fromToken.address, toToken.address, amountInBig],
    enabled: amountInBig > 0n && fromToken.address !== toToken.address,
  });

  useEffect(() => {
    if (quote) setAmountOut(parseFloat(formatEther(quote[0])).toFixed(6));
    else setAmountOut("");
  }, [quote]);

  const flip = () => {
    const tmp = fromToken;
    setFromToken(toToken);
    setToToken(tmp);
    setAmountIn("");
    setAmountOut("");
  };

  const handleSwap = async () => {
    if (!address || !amountIn) return;
    const minOut = quote ? (quote[0] * 95n) / 100n : 0n; // 5% slippage
    try {
      if (fromToken.address === ETH_ADDRESS) {
        await writeContractAsync({ address: CONTRACT_ADDRESSES.SWAP, abi: SWAP_ABI, functionName: "swapETHToToken", args: [toToken.address, minOut], value: amountInBig });
      } else if (toToken.address === ETH_ADDRESS) {
        await writeContractAsync({ address: fromToken.address, abi: ERC20_ABI, functionName: "approve", args: [CONTRACT_ADDRESSES.SWAP, amountInBig] });
        await writeContractAsync({ address: CONTRACT_ADDRESSES.SWAP, abi: SWAP_ABI, functionName: "swapTokenToETH", args: [fromToken.address, amountInBig, minOut] });
      } else {
        await writeContractAsync({ address: fromToken.address, abi: ERC20_ABI, functionName: "approve", args: [CONTRACT_ADDRESSES.SWAP, amountInBig] });
        await writeContractAsync({ address: CONTRACT_ADDRESSES.SWAP, abi: SWAP_ABI, functionName: "swapTokenToToken", args: [fromToken.address, toToken.address, amountInBig, minOut] });
      }
      toast.success(`Swapped ${amountIn} ${fromToken.symbol} → ${amountOut} ${toToken.symbol}`);
      setAmountIn(""); setAmountOut("");
    } catch (e) { toast.error(e.shortMessage || "Swap failed"); }
  };

  const TokenSelect = ({ value, onChange, exclude }) => (
    <select
      value={value.symbol}
      onChange={(e) => onChange(TOKENS.find((t) => t.symbol === e.target.value))}
      className="input-field w-auto text-sm font-semibold"
    >
      {TOKENS.filter((t) => t.symbol !== exclude?.symbol).map((t) => (
        <option key={t.symbol} value={t.symbol}>{t.icon} {t.symbol}</option>
      ))}
    </select>
  );

  return (
    <div className="glass p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-6">Swap Tokens</h2>

      {/* From */}
      <div className="bg-[var(--bg)] rounded-xl p-4 mb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[var(--text-muted)]">From</span>
          <TokenSelect value={fromToken} onChange={setFromToken} exclude={toToken} />
        </div>
        <input
          className="w-full bg-transparent text-2xl font-bold outline-none"
          placeholder="0.0"
          value={amountIn}
          onChange={(e) => setAmountIn(e.target.value)}
          type="number"
          min="0"
        />
      </div>

      {/* Flip button */}
      <div className="flex justify-center my-2">
        <button onClick={flip} className="w-10 h-10 rounded-xl border border-[var(--border)] hover:border-accent hover:bg-accent/10 flex items-center justify-center transition-all">
          ⇅
        </button>
      </div>

      {/* To */}
      <div className="bg-[var(--bg)] rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[var(--text-muted)]">To</span>
          <TokenSelect value={toToken} onChange={setToToken} exclude={fromToken} />
        </div>
        <div className="text-2xl font-bold text-accent">{amountOut || "0.0"}</div>
      </div>

      {/* Rate */}
      {amountIn && amountOut && (
        <div className="text-xs text-[var(--text-muted)] text-center mb-4">
          1 {fromToken.symbol} ≈ {amountIn > 0 ? (parseFloat(amountOut) / parseFloat(amountIn)).toFixed(4) : "—"} {toToken.symbol} • 0.3% fee
        </div>
      )}

      <button className="btn-accent w-full text-base" onClick={handleSwap} disabled={!amountIn || !address || !quote}>
        {!address ? "Connect Wallet" : !amountIn ? "Enter Amount" : "Swap"}
      </button>
    </div>
  );
}
