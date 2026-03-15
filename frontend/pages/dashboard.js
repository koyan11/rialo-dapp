import { useAccount, useBalance, useReadContract } from "wagmi";
import { formatEther } from "viem";
import { CONTRACT_ADDRESSES, TOKENS, ERC20_ABI, NFT_ABI } from "../utils/contracts";
import TokenCard from "../components/TokenCard";
import Link from "next/link";

function useTokenBalance(address, token) {
  const isETH = token.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeeeE";
  const ethBal = useBalance({ address, query: { enabled: !!address && isETH } });
  const tokenBal = useReadContract({
    address: token.address,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: !!address && !isETH },
  });
  if (isETH) return ethBal.data?.value ?? 0n;
  return tokenBal.data ?? 0n;
}

export default function Dashboard() {
  const { address, isConnected } = useAccount();

  const ethBal  = useTokenBalance(address, TOKENS[0]);
  const rloBal  = useTokenBalance(address, TOKENS[1]);
  const btcBal  = useTokenBalance(address, TOKENS[2]);
  const usdtBal = useTokenBalance(address, TOKENS[3]);
  const usdcBal = useTokenBalance(address, TOKENS[4]);
  const balances = [ethBal, rloBal, btcBal, usdtBal, usdcBal];

  const { data: nftBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.NFT,
    abi: NFT_ABI,
    functionName: "balanceOf",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: !!address },
  });

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
