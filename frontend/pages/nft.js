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
