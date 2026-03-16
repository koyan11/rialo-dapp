// Contract addresses - update after deployment
export const CONTRACT_ADDRESSES = {
  RLO: "0x4a4946A86e8C02766639c1A0578bBdd5ae8fC046",
  BTC: "0xE4F9d210e8Cee704481F482b5408fDb8Ceef5D69",
  USDT: "0x70891Decd5092A92effcFf68FE1De3FC0D661f59",
  USDC: "0x802db034979d8eE4570a9756b518f655081f4985",
  NFT: "0x1540c85cc15B5aE408BcCf30e08b75b50e6E33e4",
  Staking: "0x0000000000000000000000000000000000000006",
  Swap: "0x0000000000000000000000000000000000000007",
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
