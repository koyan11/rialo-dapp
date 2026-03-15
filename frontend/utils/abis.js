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
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
];

export const RLO_ABI = [
  ...ERC20_ABI,
  "function claimFaucet()",
  "function timeUntilNextClaim(address user) view returns (uint256)",
  "function lastFaucetClaim(address) view returns (uint256)",
  "function FAUCET_AMOUNT() view returns (uint256)",
  "function FAUCET_COOLDOWN() view returns (uint256)",
  "event FaucetClaimed(address indexed user, uint256 amount, uint256 timestamp)",
];

export const NFT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function totalMinted() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function mint(uint256 quantity) payable",
  "function mintedPerWallet(address) view returns (uint256)",
  "function tokensByOwner(address owner) view returns (uint256[])",
  "function MINT_PRICE() view returns (uint256)",
  "function MAX_SUPPLY() view returns (uint256)",
  "function MAX_PER_WALLET() view returns (uint256)",
  "function mintActive() view returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
];

export const STAKING_ABI = [
  "function pools(uint256) view returns (address stakingToken, uint256 aprBps, uint256 totalStaked, bool active)",
  "function userInfo(uint256 pid, address user) view returns (uint256 amount, uint256 rewardDebt, uint256 lastStakeTime)",
  "function getUserInfo(uint256 pid, address user) view returns (uint256 amount, uint256 pending, uint256 lastStakeTime)",
  "function pendingReward(uint256 pid, address user) view returns (uint256)",
  "function stake(uint256 pid, uint256 amount)",
  "function withdraw(uint256 pid, uint256 amount)",
  "function claimReward(uint256 pid)",
  "function poolLength() view returns (uint256)",
  "event Staked(address indexed user, uint256 indexed pid, uint256 amount)",
  "event Withdrawn(address indexed user, uint256 indexed pid, uint256 amount)",
  "event RewardClaimed(address indexed user, uint256 indexed pid, uint256 amount)",
];

export const SWAP_ABI = [
  "function getAmountOut(address fromToken, address toToken, uint256 amountIn) view returns (uint256)",
  "function swapETHToToken(address toToken, uint256 minAmountOut) payable",
  "function swapTokenToETH(address fromToken, uint256 amountIn, uint256 minAmountOut)",
  "function swapTokenToToken(address fromToken, address toToken, uint256 amountIn, uint256 minAmountOut)",
  "function tokenPriceUSD(address token) view returns (uint256)",
  "function liquidity(address token) view returns (uint256)",
  "event SwapExecuted(address indexed user, address indexed fromToken, address indexed toToken, uint256 amountIn, uint256 amountOut)",
];
