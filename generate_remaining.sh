#!/usr/bin/env bash
# ============================================================
#  Rialo DApp — generate_remaining.sh
#  Run from the rialo-dapp/ root:  bash generate_remaining.sh
# ============================================================
set -e
echo "🚀  Generating remaining Rialo DApp files..."

# ── frontend/pages/index.js ──────────────────────────────────────────────────
cat > frontend/pages/index.js << 'EOF'
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const FEATURES = [
  { icon: "🪙", title: "Faucet",      desc: "Claim 1,000 RLO every 24 hours for free.",            href: "/faucet"     },
  { icon: "🖼️", title: "Mint NFT",    desc: "Mint unique Rialo NFTs — first one free.",             href: "/nft"        },
  { icon: "🔄", title: "Swap",        desc: "Swap ETH, RLO, BTC, USDT & USDC instantly.",          href: "/swap"       },
  { icon: "💰", title: "Staking",     desc: "Stake tokens and earn RLO rewards up to 10% APR.",    href: "/staking"    },
  { icon: "📊", title: "Dashboard",   desc: "View all your balances and portfolio at a glance.",   href: "/dashboard"  },
  { icon: "🔍", title: "Explorer",    desc: "Browse on-chain transactions and contract activity.", href: "/explorer"   },
];

const STATS = [
  { label: "Total Supply",   value: "4B",    suffix: "Tokens" },
  { label: "NFT Supply",     value: "10K",   suffix: "NFTs"   },
  { label: "Staking APR",    value: "10%",   suffix: "Max"    },
  { label: "Swap Fee",       value: "0.3%",  suffix: "Flat"   },
];

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-24 pb-20 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="badge mb-6 text-sm px-4 py-2">⚡ Live on Ethereum Sepolia Testnet</div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight max-w-3xl">
          The <span className="gradient-text">Rialo</span> Web3<br/>Ecosystem
        </h1>

        <p className="text-lg md:text-xl text-[var(--text-muted)] mb-10 max-w-xl">
          Mint NFTs, swap tokens, stake to earn, and explore the blockchain — all in one futuristic DApp on Sepolia.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center mb-16">
          {isConnected ? (
            <Link href="/dashboard" className="btn-accent text-base px-8 py-3">Open Dashboard →</Link>
          ) : (
            <ConnectButton label="Connect Wallet to Start" />
          )}
          <Link href="/faucet" className="btn-ghost text-base px-8 py-3">Get Free RLO</Link>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
          {STATS.map((s) => (
            <div key={s.label} className="glass p-4 text-center">
              <div className="text-2xl font-extrabold gradient-text">{s.value}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">{s.label}</div>
              <div className="text-xs text-accent font-medium">{s.suffix}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <h2 className="text-3xl font-bold text-center mb-2">Everything You Need</h2>
        <p className="text-[var(--text-muted)] text-center mb-12">A full Web3 DeFi suite on one testnet.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <Link key={f.href} href={f.href} className="glass p-6 hover:glow transition-all group">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">{f.title}</h3>
              <p className="text-sm text-[var(--text-muted)]">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] text-center py-8 text-sm text-[var(--text-muted)]">
        <p>Rialo DApp — Sepolia Testnet • Built with Next.js, Wagmi, RainbowKit & Solidity</p>
      </footer>
    </div>
  );
}
EOF

# ── frontend/pages/dashboard.js ─────────────────────────────────────────────
cat > frontend/pages/dashboard.js << 'EOF'
import { useAccount, useBalance, useReadContract } from "wagmi";
import { formatEther } from "viem";
import { CONTRACT_ADDRESSES, TOKENS, ERC20_ABI, NFT_ABI } from "../utils/contracts";
import TokenCard from "../components/TokenCard";
import Link from "next/link";

function useTokenBalance(address, tokenAddress) {
  const isETH = tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeeeE";
  const ethBal = useBalance({ address, enabled: !!address && isETH });
  const tokenBal = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    enabled: !!address && !isETH,
  });
  if (isETH) return ethBal.data?.value ?? 0n;
  return tokenBal.data ?? 0n;
}

export default function Dashboard() {
  const { address, isConnected } = useAccount();

  const { data: nftBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.NFT,
    abi: NFT_ABI,
    functionName: "balanceOf",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    enabled: !!address,
  });

  const ethBal   = useTokenBalance(address, TOKENS[0].address);
  const rloBal   = useTokenBalance(address, TOKENS[1].address);
  const btcBal   = useTokenBalance(address, TOKENS[2].address);
  const usdtBal  = useTokenBalance(address, TOKENS[3].address);
  const usdcBal  = useTokenBalance(address, TOKENS[4].address);
  const balances = [ethBal, rloBal, btcBal, usdtBal, usdcBal];

  if (!isConnected) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
      <div className="text-5xl">🔐</div>
      <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
      <p className="text-[var(--text-muted)]">Connect MetaMask to view your dashboard.</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-[var(--text-muted)] mb-8 font-mono text-sm break-all">{address}</p>

      {/* Balances */}
      <h2 className="text-lg font-semibold mb-4">Token Balances</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {TOKENS.map((token, i) => (
          <TokenCard key={token.symbol} token={token} balance={balances[i]} />
        ))}
        <div className="stat-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xl flex-shrink-0">🖼️</div>
          <div>
            <div className="text-sm text-[var(--text-muted)]">NFTs Owned</div>
            <div className="text-2xl font-bold">{nftBalance?.toString() ?? "0"}</div>
          </div>
          <div className="badge ml-auto">RNFT</div>
        </div>
      </div>

      {/* Quick actions */}
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Get RLO",      icon: "🪙", href: "/faucet"  },
          { label: "Mint NFT",     icon: "🖼️", href: "/nft"     },
          { label: "Swap",         icon: "🔄", href: "/swap"    },
          { label: "Stake & Earn", icon: "💰", href: "/staking" },
        ].map((a) => (
          <Link key={a.href} href={a.href} className="glass p-4 flex items-center gap-3 hover:glow transition-all group">
            <span className="text-2xl">{a.icon}</span>
            <span className="font-medium group-hover:text-accent transition-colors">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
EOF

# ── frontend/pages/faucet.js ─────────────────────────────────────────────────
cat > frontend/pages/faucet.js << 'EOF'
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
EOF

# ── frontend/pages/nft.js ────────────────────────────────────────────────────
cat > frontend/pages/nft.js << 'EOF'
import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatEther, parseEther } from "viem";
import { CONTRACT_ADDRESSES, NFT_ABI } from "../utils/contracts";
import NFTCard from "../components/NFTCard";
import toast from "react-hot-toast";

export default function NFTPage() {
  const { address, isConnected } = useAccount();
  const [quantity, setQuantity] = useState(1);
  const { writeContractAsync, data: txHash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const { data: mintPrice }   = useReadContract({ address: CONTRACT_ADDRESSES.NFT, abi: NFT_ABI, functionName: "mintPrice" });
  const { data: totalMinted, refetch: refetchTotal } = useReadContract({ address: CONTRACT_ADDRESSES.NFT, abi: NFT_ABI, functionName: "totalMinted" });
  const { data: maxSupply }   = useReadContract({ address: CONTRACT_ADDRESSES.NFT, abi: NFT_ABI, functionName: "MAX_SUPPLY" });
  const { data: walletMinted, refetch: refetchWallet } = useReadContract({ address: CONTRACT_ADDRESSES.NFT, abi: NFT_ABI, functionName: "mintedPerWallet", args: [address ?? "0x0000000000000000000000000000000000000000"], enabled: !!address });
  const { data: walletTokens, refetch: refetchTokens } = useReadContract({ address: CONTRACT_ADDRESSES.NFT, abi: NFT_ABI, functionName: "walletTokens", args: [address ?? "0x0000000000000000000000000000000000000000"], enabled: !!address });

  useEffect(() => {
    if (isSuccess) { toast.success("🎨 NFT Minted!"); refetchTotal(); refetchWallet(); refetchTokens(); }
  }, [isSuccess]);

  const pricePerNFT = mintPrice ? parseFloat(formatEther(mintPrice)) : 0.01;
  const totalCost   = (pricePerNFT * quantity).toFixed(4);
  const minted      = totalMinted ? Number(totalMinted) : 0;
  const max         = maxSupply ? Number(maxSupply) : 10000;
  const pct         = Math.round((minted / max) * 100);

  const handleMint = async () => {
    if (!isConnected) return toast.error("Connect wallet first");
    try {
      if (walletMinted === 0n) {
        await writeContractAsync({ address: CONTRACT_ADDRESSES.NFT, abi: NFT_ABI, functionName: "freeMint" });
        toast.success("🎉 Free NFT minted!");
      } else {
        await writeContractAsync({ address: CONTRACT_ADDRESSES.NFT, abi: NFT_ABI, functionName: "mint", args: [BigInt(quantity)], value: parseEther(totalCost) });
      }
    } catch (e) { toast.error(e.shortMessage || "Mint failed"); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Mint Rialo NFT</h1>
      <p className="text-[var(--text-muted)] mb-10">Unique on-chain NFTs on Sepolia. First mint is free!</p>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Preview */}
        <div className="glass p-8 flex flex-col items-center justify-center text-center min-h-[320px]">
          <div className="text-8xl mb-4 animate-bounce">🎨</div>
          <div className="text-xl font-bold">Rialo NFT</div>
          <div className="badge mt-2">ERC-721</div>
          <p className="text-sm text-[var(--text-muted)] mt-4 max-w-xs">
            Unique generative artwork stored on IPFS with on-chain ownership on Ethereum Sepolia.
          </p>
        </div>

        {/* Mint panel */}
        <div className="glass p-6 flex flex-col gap-5">
          {/* Supply bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[var(--text-muted)]">Minted</span>
              <span className="font-semibold">{minted.toLocaleString()} / {max.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-[var(--bg)] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-accent to-purple-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">{pct}% minted</div>
          </div>

          {/* Wallet stats */}
          {isConnected && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[var(--bg)] rounded-xl p-3 text-center">
                <div className="text-xs text-[var(--text-muted)]">You own</div>
                <div className="font-bold text-lg">{walletTokens?.length ?? 0}</div>
              </div>
              <div className="bg-[var(--bg)] rounded-xl p-3 text-center">
                <div className="text-xs text-[var(--text-muted)]">Minted</div>
                <div className="font-bold text-lg">{Number(walletMinted ?? 0)}/10</div>
              </div>
            </div>
          )}

          {/* Quantity */}
          {walletMinted !== 0n && (
            <div>
              <label className="text-sm text-[var(--text-muted)] block mb-2">Quantity (max 10)</label>
              <div className="flex items-center gap-3">
                <button className="btn-ghost w-10 h-10 p-0 flex items-center justify-center" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                <button className="btn-ghost w-10 h-10 p-0 flex items-center justify-center" onClick={() => setQuantity(Math.min(10, quantity + 1))}>+</button>
              </div>
            </div>
          )}

          <div className="glass p-4">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Price</span>
              <span className="font-semibold">{walletMinted === 0n ? "FREE 🎁" : `${totalCost} ETH`}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-[var(--text-muted)]">Max per wallet</span>
              <span>10 NFTs</span>
            </div>
          </div>

          <button className="btn-accent w-full text-base py-4" onClick={handleMint} disabled={isPending || !isConnected}>
            {!isConnected ? "Connect Wallet" : isPending ? "⏳ Minting..." : walletMinted === 0n ? "🎁 Free Mint" : `Mint ${quantity} NFT`}
          </button>
        </div>
      </div>

      {/* Gallery */}
      {isConnected && walletTokens && walletTokens.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6">Your NFTs ({walletTokens.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {walletTokens.map((id) => <NFTCard key={id.toString()} tokenId={id.toString()} />)}
          </div>
        </>
      )}
    </div>
  );
}
EOF

# ── frontend/pages/swap.js ───────────────────────────────────────────────────
cat > frontend/pages/swap.js << 'EOF'
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
EOF

# ── frontend/pages/staking.js ────────────────────────────────────────────────
cat > frontend/pages/staking.js << 'EOF'
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
EOF

# ── frontend/pages/explorer.js ───────────────────────────────────────────────
cat > frontend/pages/explorer.js << 'EOF'
import { useEffect, useState } from "react";
import { usePublicClient, useAccount } from "wagmi";
import { CONTRACT_ADDRESSES } from "../utils/contracts";

function shortenHash(h) { return h ? `${h.slice(0,8)}...${h.slice(-6)}` : "—"; }
function shortenAddr(a) { return a ? `${a.slice(0,6)}...${a.slice(-4)}` : "—"; }

export default function Explorer() {
  const { address } = useAccount();
  const client = usePublicClient();
  const [block, setBlock] = useState(null);
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetch() {
      if (!client) return;
      try {
        const latest = await client.getBlock({ includeTransactions: true });
        setBlock(latest);
        const list = (latest.transactions || []).slice(0, 20).map((tx) => ({
          hash: tx.hash,
          from: tx.from,
          to:   tx.to,
          value: tx.value,
          type: tx.to ? "Transfer" : "Deploy",
        }));
        setTxs(list);
      } catch {}
      setLoading(false);
    }
    fetch();
  }, [client]);

  const filtered = txs.filter((tx) =>
    !search || tx.hash.includes(search) || tx.from?.includes(search) || tx.to?.includes(search)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Explorer</h1>
      <p className="text-[var(--text-muted)] mb-8">Sepolia blockchain activity</p>

      {/* Block info */}
      {block && (
        <div className="glass p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Latest Block</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ["Block Number", block.number?.toString()],
              ["Timestamp",    new Date(Number(block.timestamp) * 1000).toLocaleTimeString()],
              ["Transactions", block.transactions?.length?.toString()],
              ["Gas Used",     block.gasUsed?.toString()],
            ].map(([label, val]) => (
              <div key={label} className="bg-[var(--bg)] rounded-xl p-3">
                <div className="text-xs text-[var(--text-muted)]">{label}</div>
                <div className="font-mono font-semibold text-sm mt-1 truncate">{val ?? "—"}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contract addresses */}
      <div className="glass p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Rialo Contract Addresses</h2>
        <div className="space-y-2">
          {Object.entries(CONTRACT_ADDRESSES).map(([name, addr]) => (
            <div key={name} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
              <span className="badge">{name}</span>
              <a href={`https://sepolia.etherscan.io/address/${addr}`} target="_blank" rel="noopener noreferrer"
                className="font-mono text-sm text-accent hover:underline truncate ml-4">{addr}</a>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input className="input-field" placeholder="Search by hash, from, or to address..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Transactions */}
      <div className="glass overflow-hidden">
        <div className="p-4 border-b border-[var(--border)]">
          <h2 className="font-semibold">Recent Transactions ({filtered.length})</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-[var(--text-muted)]">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-muted)]">No transactions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[var(--border)] text-[var(--text-muted)]">
                <tr>{["Tx Hash","From","To","Value (ETH)","Type"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map((tx) => (
                  <tr key={tx.hash} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                    <td className="px-4 py-3">
                      <a href={`https://sepolia.etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-mono">{shortenHash(tx.hash)}</a>
                    </td>
                    <td className="px-4 py-3 font-mono text-[var(--text-muted)]">{shortenAddr(tx.from)}</td>
                    <td className="px-4 py-3 font-mono text-[var(--text-muted)]">{shortenAddr(tx.to)}</td>
                    <td className="px-4 py-3">{tx.value ? (Number(tx.value) / 1e18).toFixed(6) : "0"}</td>
                    <td className="px-4 py-3"><span className="badge">{tx.type}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
EOF

# ── frontend/pages/tokenomics.js ─────────────────────────────────────────────
cat > frontend/pages/tokenomics.js << 'EOF'
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
EOF

echo "✅  All pages generated."

# ── README.md ────────────────────────────────────────────────────────────────
cat > README.md << 'EOF'
# Rialo DApp 🚀

> Full-stack Web3 ecosystem on **Ethereum Sepolia Testnet**  
> NFT Minting · Faucet · Multi-Token Swap · Staking · Dashboard · Explorer

---

## Stack
| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, TailwindCSS, Wagmi v2, RainbowKit, Ethers.js |
| Contracts | Solidity 0.8.20, Hardhat, OpenZeppelin 5 |
| Wallet | MetaMask / WalletConnect |
| Network | Ethereum Sepolia Testnet |

---

## Project Structure
```
rialo-dapp/
├── contracts/
│   ├── RialoToken.sol   # RLO ERC20 + Faucet (24h cooldown)
│   ├── MockBTC.sol      # BTC ERC20
│   ├── MockUSDT.sol     # USDT ERC20
│   ├── MockUSDC.sol     # USDC ERC20
│   ├── RialoNFT.sol     # ERC721 – 10,000 supply, free first mint
│   ├── Staking.sol      # Multi-token staking → earn RLO
│   └── Swap.sol         # Fixed-rate oracle DEX
├── scripts/
│   └── deploy.js
├── frontend/
│   ├── pages/           # index, dashboard, faucet, nft, swap, staking, explorer, tokenomics
│   ├── components/      # Navbar, SwapPanel, StakingPool, NFTCard, TokenCard, ThemeToggle
│   ├── utils/           # contracts.js (ABIs + addresses), wagmiConfig.js
│   └── styles/
├── hardhat.config.js
└── .env.example
```

---

## Quick Start

### 1 — Clone & install dependencies

```bash
git clone <your-repo>
cd rialo-dapp

# Install contract dev dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2 — Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
PRIVATE_KEY=0xYOUR_WALLET_PRIVATE_KEY
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_KEY
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=YOUR_WALLETCONNECT_ID
```

> **Get a free WalletConnect Project ID:** https://cloud.walletconnect.com  
> **Get Sepolia ETH:** https://sepoliafaucet.com

### 3 — Compile contracts

```bash
npm run compile
```

### 4 — Deploy to Sepolia

```bash
npm run deploy:sepolia
```

The script prints all contract addresses. Copy them into:

```
frontend/utils/contracts.js  →  CONTRACT_ADDRESSES object
```

### 5 — Run the frontend

```bash
cd frontend
npm run dev
```

Open http://localhost:3000

---

## Deploy to Vercel

```bash
cd frontend
npx vercel --prod
```

Add environment variables in Vercel dashboard:
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_ALCHEMY_ID` (optional, for better RPC)

---

## Smart Contract Summary

| Contract | Symbol | Supply | Key Feature |
|----------|--------|--------|-------------|
| RialoToken | RLO | 1,000,000,000 | Faucet 1,000/day, 24h cooldown |
| MockBTC    | BTC | 1,000,000,000 | ERC20 test token |
| MockUSDT   | USDT | 1,000,000,000 | ERC20 test token |
| MockUSDC   | USDC | 1,000,000,000 | ERC20 test token |
| RialoNFT   | RNFT | 10,000 | Free first mint, 0.01 ETH after |
| Staking    | —    | —      | RLO 10%, BTC 8%, USDT/USDC 6% APR |
| Swap       | —    | —      | Fixed oracle, 0.3% fee |

---

## Local Hardhat Node (optional)

```bash
# Terminal 1 — start local node
npm run node

# Terminal 2 — deploy locally
npm run deploy:local
```

---

## Verify Contracts on Etherscan (optional)

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

---

## License
MIT
EOF

echo "✅  README.md generated."
echo ""
echo "=================================================="
echo "  All files generated successfully!"
echo "  Next steps:"
echo "  1. cd rialo-dapp && npm install"
echo "  2. cp .env.example .env  (fill in your keys)"
echo "  3. npm run compile"
echo "  4. npm run deploy:sepolia"
echo "  5. Update CONTRACT_ADDRESSES in frontend/utils/contracts.js"
echo "  6. cd frontend && npm install && npm run dev"
echo "=================================================="
