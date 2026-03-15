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
