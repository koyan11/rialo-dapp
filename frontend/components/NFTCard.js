export default function NFTCard({ tokenId, imageUrl, name }) {
  return (
    <div className="glass overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer">
      <div className="aspect-square bg-gradient-to-br from-accent/20 to-purple-900/20 flex items-center justify-center relative overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name || `NFT #${tokenId}`} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-2">🎨</div>
            <div className="text-sm text-[var(--text-muted)]">Rialo NFT</div>
          </div>
        )}
        <div className="absolute top-2 right-2 badge text-xs">#{tokenId}</div>
      </div>
      <div className="p-3">
        <div className="font-semibold text-sm">{name || `Rialo NFT #${tokenId}`}</div>
        <div className="text-xs text-[var(--text-muted)] mt-1">Token ID: {tokenId}</div>
      </div>
    </div>
  );
}
