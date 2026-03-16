import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";

const SWAP_ADDRESS = "0x6Df06B7bAd7ADAc58D83A4B7341c5Cd8B8675Fd3";
const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";

const TOKENS = [
  { symbol: "ETH", name: "Ethereum", address: ETH_ADDRESS, icon: "Ξ" },
  { symbol: "RLO", name: "Rialo Token", address: "0xD36af4490FD77F26E5da7Ec9D1BAF9cf98EbE9f2", icon: "R" },
  { symbol: "BTC", name: "Bitcoin Test", address: "0x2aCdF5D229831684C58DA42308EDC835dEa9Ee35", icon: "₿" },
  { symbol: "USDT", name: "Tether Test", address: "0xCE20D75C44146696ef4cBCF93C76DA711F91f84c", icon: "₮" },
  { symbol: "USDC", name: "USD Coin Test", address: "0xDEE5806DF86b9F8293e8c89f969B1b10d7c460A7", icon: "$" },
];

function pad(hex, len=64) { return hex.replace('0x','').padStart(len,'0'); }
function selector(sig) {
  // precomputed selectors
  const sels = {
    'getAmountOut(address,address,uint256)': '0x4aa4a4b8',
    'swapETHToToken(address,uint256)': '0x5c11d795',
    'swapTokenToETH(address,uint256,uint256)': '0x18cbafe5',
    'swapTokenToToken(address,address,uint256,uint256)': '0x38ed1739',
    'approve(address,uint256)': '0x095ea7b3',
  };
  return sels[sig] || '0x00000000';
}

export default function SwapPanel() {
  const { address } = useAccount();
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!amountIn || isNaN(amountIn) || parseFloat(amountIn) <= 0) { setAmountOut(""); return; }
    getQuote();
  }, [amountIn, fromToken, toToken]);

  const getQuote = async () => {
    if (!window.ethereum) return;
    try {
      const amtBig = BigInt(Math.floor(parseFloat(amountIn) * 1e18));
      const data = '0x4aa4a4b8' + pad(fromToken.address) + pad(toToken.address) + pad(amtBig.toString(16));
      const result = await window.ethereum.request({ method: 'eth_call', params: [{ to: SWAP_ADDRESS, data }, 'latest'] });
      if (result && result !== '0x') {
        const out = BigInt('0x' + result.slice(2, 66));
        setAmountOut((Number(out) / 1e18).toFixed(6));
      }
    } catch(e) { console.error('quote error', e); setAmountOut(""); }
  };

  const sendTx = async (to, data, value='0x0') => {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{ from: address, to, data, gas: '0x493E0', value }],
    });
    toast.success('Transaction sent!');
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const receipt = await window.ethereum.request({ method: 'eth_getTransactionReceipt', params: [txHash] });
      if (receipt) return receipt.status === '0x1';
    }
    return false;
  };

  const handleSwap = async () => {
    if (!address || !amountIn || !amountOut) return;
    try {
      setIsPending(true);
      const amtBig = BigInt(Math.floor(parseFloat(amountIn) * 1e18));
      const minOut = BigInt(Math.floor(parseFloat(amountOut) * 0.95 * 1e18));
      const amtHex = '0x' + amtBig.toString(16);

      if (fromToken.address === ETH_ADDRESS) {
        const data = '0x5c11d795' + pad(toToken.address) + pad(minOut.toString(16));
        await sendTx(SWAP_ADDRESS, data, amtHex);
      } else if (toToken.address === ETH_ADDRESS) {
        const appData = '0x095ea7b3' + pad(SWAP_ADDRESS) + pad(amtBig.toString(16));
        await sendTx(fromToken.address, appData);
        const data = '0x18cbafe5' + pad(fromToken.address) + pad(amtBig.toString(16)) + pad(minOut.toString(16));
        await sendTx(SWAP_ADDRESS, data);
      } else {
        const appData = '0x095ea7b3' + pad(SWAP_ADDRESS) + pad(amtBig.toString(16));
        await sendTx(fromToken.address, appData);
        const data = '0x38ed1739' + pad(fromToken.address) + pad(toToken.address) + pad(amtBig.toString(16)) + pad(minOut.toString(16));
        await sendTx(SWAP_ADDRESS, data);
      }
      toast.success('Swap successful!');
      setAmountIn(""); setAmountOut("");
    } catch(e) { console.error(e); toast.error(e.message || 'Swap failed'); }
    finally { setIsPending(false); }
  };

  const flip = () => { const t = fromToken; setFromToken(toToken); setToToken(t); setAmountIn(""); setAmountOut(""); };

  return (
    <div className="glass p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-6">Swap Tokens</h2>
      <div className="bg-[var(--bg)] rounded-xl p-4 mb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[var(--text-muted)]">From</span>
          <select value={fromToken.symbol} onChange={e => setFromToken(TOKENS.find(t => t.symbol === e.target.value))} className="input-field w-auto text-sm font-semibold">
            {TOKENS.filter(t => t.symbol !== toToken.symbol).map(t => <option key={t.symbol} value={t.symbol}>{t.icon} {t.symbol}</option>)}
          </select>
        </div>
        <input className="w-full bg-transparent text-2xl font-bold outline-none" placeholder="0.0" value={amountIn} onChange={e => setAmountIn(e.target.value)} type="number" min="0" />
      </div>
      <div className="flex justify-center my-2">
        <button onClick={flip} className="w-10 h-10 rounded-xl border border-[var(--border)] hover:border-accent flex items-center justify-center">⇅</button>
      </div>
      <div className="bg-[var(--bg)] rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[var(--text-muted)]">To</span>
          <select value={toToken.symbol} onChange={e => setToToken(TOKENS.find(t => t.symbol === e.target.value))} className="input-field w-auto text-sm font-semibold">
            {TOKENS.filter(t => t.symbol !== fromToken.symbol).map(t => <option key={t.symbol} value={t.symbol}>{t.icon} {t.symbol}</option>)}
          </select>
        </div>
        <div className="text-2xl font-bold text-accent">{amountOut || "0.0"}</div>
      </div>
      {amountIn && amountOut && (
        <div className="text-xs text-[var(--text-muted)] text-center mb-4">
          1 {fromToken.symbol} ≈ {(parseFloat(amountOut)/parseFloat(amountIn)).toFixed(4)} {toToken.symbol} • 0.3% fee
        </div>
      )}
      <button className="btn-accent w-full text-base" onClick={handleSwap} disabled={!amountIn || !address || !amountOut || isPending}>
        {!address ? "Connect Wallet" : isPending ? "Swapping..." : !amountIn ? "Enter Amount" : "Swap"}
      </button>
    </div>
  );
}