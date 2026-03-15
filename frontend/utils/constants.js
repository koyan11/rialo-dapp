import contractsJSON from "./contracts.json";

export const CONTRACTS = contractsJSON.contracts;
export const CHAIN_ID = contractsJSON.chainId; // 11155111 Sepolia

export const TOKENS = [
  {
    symbol: "ETH",
    name: "Ethereum",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    logo: "⟠",
    color: "#627EEA",
    isNative: true,
  },
  {
    symbol: "RLO",
    name: "Rialo Token",
    address: CONTRACTS.RialoToken,
    decimals: 18,
    logo: "◈",
    color: "#4f46e5",
    isNative: false,
  },
  {
    symbol: "BTC",
    name: "Bitcoin Test",
    address: CONTRACTS.MockBTC,
    decimals: 18,
    logo: "₿",
    color: "#F7931A",
    isNative: false,
  },
  {
    symbol: "USDT",
    name: "Tether Test",
    address: CONTRACTS.MockUSDT,
    decimals: 18,
    logo: "₮",
    color: "#26A17B",
    isNative: false,
  },
  {
    symbol: "USDC",
    name: "USD Coin Test",
    address: CONTRACTS.MockUSDC,
    decimals: 18,
    logo: "◎",
    color: "#2775CA",
    isNative: false,
  },
];

export const STAKING_POOLS = [
  { poolId: 0, symbol: "RLO", tokenAddress: CONTRACTS.RialoToken, apr: 10, color: "#4f46e5" },
  { poolId: 1, symbol: "BTC", tokenAddress: CONTRACTS.MockBTC,    apr: 8,  color: "#F7931A" },
  { poolId: 2, symbol: "USDT", tokenAddress: CONTRACTS.MockUSDT,  apr: 6,  color: "#26A17B" },
  { poolId: 3, symbol: "USDC", tokenAddress: CONTRACTS.MockUSDC,  apr: 6,  color: "#2775CA" },
];

export const SEPOLIA_EXPLORER = "https://sepolia.etherscan.io";

export const formatAddress = (addr) =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

export const formatBigNum = (val, decimals = 18, fixed = 4) => {
  if (!val) return "0";
  try {
    const num = Number(val) / Math.pow(10, decimals);
    return num.toFixed(fixed);
  } catch { return "0"; }
};
