// ─── Contract Addresses (Update after deployment) ────────────────────────────
export const CONTRACT_ADDRESSES = {
  RLO:     "0x0000000000000000000000000000000000000001", // Replace after deploy
  BTC:     "0x0000000000000000000000000000000000000002",
  USDT:    "0x0000000000000000000000000000000000000003",
  USDC:    "0x0000000000000000000000000000000000000004",
  NFT:     "0x0000000000000000000000000000000000000005",
  STAKING: "0x0000000000000000000000000000000000000006",
  SWAP:    "0x0000000000000000000000000000000000000007",
};

export const ETH_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeeeE";

// ─── ABIs ────────────────────────────────────────────────────────────────────
export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

export const RLO_ABI = [
  ...ERC20_ABI,
  "function claimFaucet()",
  "function getNextClaimTime(address user) view returns (uint256)",
  "function lastFaucetClaim(address) view returns (uint256)",
  "function FAUCET_AMOUNT() view returns (uint256)",
  "function COOLDOWN() view returns (uint256)",
  "event FaucetClaimed(address indexed user, uint256 amount, uint256 timestamp)",
];

export const NFT_ABI = [
  "function mint(uint256 quantity) payable",
  "function freeMint()",
  "function mintPrice() view returns (uint256)",
  "function totalMinted() view returns (uint256)",
  "function MAX_SUPPLY() view returns (uint256)",
  "function MAX_PER_WALLET() view returns (uint256)",
  "function mintedPerWallet(address) view returns (uint256)",
  "function walletTokens(address) view returns (uint256[])",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function balanceOf(address) view returns (uint256)",
  "event NFTMinted(address indexed to, uint256 indexed tokenId)",
];

export const STAKING_ABI = [
  "function pools(uint256) view returns (address token, uint256 aprBps, uint256 totalStaked, bool active)",
  "function poolLength() view returns (uint256)",
  "function userInfo(uint256 pid, address user) view returns (uint256 amount, uint256 rewardDebt, uint256 lastUpdateTime)",
  "function pendingReward(uint256 pid, address user) view returns (uint256)",
  "function stake(uint256 pid, uint256 amount)",
  "function withdraw(uint256 pid, uint256 amount)",
  "function claimReward(uint256 pid)",
  "function claimAllRewards()",
  "event Staked(address indexed user, uint256 indexed pid, uint256 amount)",
  "event Withdrawn(address indexed user, uint256 indexed pid, uint256 amount)",
  "event RewardClaimed(address indexed user, uint256 indexed pid, uint256 reward)",
];

export const SWAP_ABI = [
  "function getAmountOut(address tokenIn, address tokenOut, uint256 amountIn) view returns (uint256 amountOut, uint256 fee)",
  "function swapETHToToken(address tokenOut, uint256 minAmountOut) payable",
  "function swapTokenToETH(address tokenIn, uint256 amountIn, uint256 minAmountOut)",
  "function swapTokenToToken(address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut)",
  "function tokenPrice(address) view returns (uint256)",
  "function liquidity(address) view returns (uint256)",
  "event SwappedETHToToken(address indexed user, address indexed token, uint256 ethIn, uint256 tokenOut)",
  "event SwappedTokenToETH(address indexed user, address indexed token, uint256 tokenIn, uint256 ethOut)",
  "event SwappedTokenToToken(address indexed user, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut)",
];

// ─── Token Metadata ──────────────────────────────────────────────────────────
export const TOKENS = [
  { symbol: "ETH",  name: "Ethereum",          address: ETH_ADDRESS,                    decimals: 18, color: "#627EEA", icon: "Ξ" },
  { symbol: "RLO",  name: "Rialo Token",        address: CONTRACT_ADDRESSES.RLO,         decimals: 18, color: "#4f46e5", icon: "R" },
  { symbol: "BTC",  name: "Bitcoin Test",       address: CONTRACT_ADDRESSES.BTC,         decimals: 18, color: "#F7931A", icon: "₿" },
  { symbol: "USDT", name: "Tether Test",        address: CONTRACT_ADDRESSES.USDT,        decimals: 18, color: "#26A17B", icon: "₮" },
  { symbol: "USDC", name: "USD Coin Test",      address: CONTRACT_ADDRESSES.USDC,        decimals: 18, color: "#2775CA", icon: "$" },
];

export const STAKING_POOLS = [
  { pid: 0, symbol: "RLO",  name: "Rialo Token",   apr: 10, address: CONTRACT_ADDRESSES.RLO,  color: "#4f46e5" },
  { pid: 1, symbol: "BTC",  name: "Bitcoin Test",  apr: 8,  address: CONTRACT_ADDRESSES.BTC,  color: "#F7931A" },
  { pid: 2, symbol: "USDT", name: "Tether Test",   apr: 6,  address: CONTRACT_ADDRESSES.USDT, color: "#26A17B" },
  { pid: 3, symbol: "USDC", name: "USD Coin Test", apr: 6,  address: CONTRACT_ADDRESSES.USDC, color: "#2775CA" },
];
