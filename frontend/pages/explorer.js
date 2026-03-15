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
