// Contract addresses - update after deployment
export const CONTRACT_ADDRESSES = {
  RLO: "0xD36af4490FD77F26E5da7Ec9D1BAF9cf98EbE9f2",
  BTC: "0x2aCdF5D229831684C58DA42308EDC835dEa9Ee35",
  USDT: "0xCE20D75C44146696ef4cBCF93C76DA711F91f84c",
  USDC: "0xDEE5806DF86b9F8293e8c89f969B1b10d7c460A7",
  NFT: "0xD637D6F511BE8F4a898c76458808180034478910d",
  Staking: "0x0a5035F9ea0872c46290C887529F07bdc751CF63",
  Swap: "0x899ce9aE815D70157dEAc6e81A58e251ede5dC07",
};

export const ETH_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEE";

export const TOKENS = [
  { symbol: "ETH", name: "Ethereum", address: ETH_ADDRESS, decimals: 18, color: "#627EEA" },
  { symbol: "RLO", name: "Rialo Token", address: CONTRACT_ADDRESSES.RLO, decimals: 18, color: "#4f46e5" },
  { symbol: "BTC", name: "Bitcoin Test", address: CONTRACT_ADDRESSES.BTC, decimals: 8, color: "#F7931A" },
  { symbol: "USDT", name: "Tether Test", address: CONTRACT_ADDRESSES.USDT, decimals: 6, color: "#26A17B" },
  { symbol: "USDC", name: "USD Coin Test", address: CONTRACT_ADDRESSES.USDC, decimals: 6, color: "#2775CA" },
];

export const STAKING_POOLS = [
  { pid: 0, symbol: "RLO", name: "Rialo Token", address: CONTRACT_ADDRESSES.RLO, decimals: 18, apr: 10, color: "#4f46e5" },
  { pid: 1, symbol: "BTC", name: "Bitcoin Test", address: CONTRACT_ADDRESSES.BTC, decimals: 8, apr: 8, color: "#F7931A" },
  { pid: 2, symbol: "USDT", name: "Tether Test", address: CONTRACT_ADDRESSES.USDT, decimals: 6, apr: 6, color: "#26A17B" },
  { pid: 3, symbol: "USDC", name: "USD Coin Test", address: CONTRACT_ADDRESSES.USDC, decimals: 6, apr: 6, color: "#2775CA" },
];
