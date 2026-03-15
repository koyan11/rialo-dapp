# Rialo DApp 🚀

> Full-stack Web3 ecosystem on **Ethereum Sepolia Testnet**  
> NFT Minting · Faucet · Multi-Token Swap · Staking · Dashboard · Explorer

---

## Stack
| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, TailwindCSS, Wagmi v2, RainbowKit, Ethers.js |
| Contracts | Solidity 0.8.20, Hardhat, OpenZeppelin 5 |
| Wallet | MetaMask / WalletConnect |
| Network | Ethereum Sepolia Testnet |

---

## Project Structure
```
rialo-dapp/
├── contracts/
│   ├── RialoToken.sol   # RLO ERC20 + Faucet (24h cooldown)
│   ├── MockBTC.sol      # BTC ERC20
│   ├── MockUSDT.sol     # USDT ERC20
│   ├── MockUSDC.sol     # USDC ERC20
│   ├── RialoNFT.sol     # ERC721 – 10,000 supply, free first mint
│   ├── Staking.sol      # Multi-token staking → earn RLO
│   └── Swap.sol         # Fixed-rate oracle DEX
├── scripts/
│   └── deploy.js
├── frontend/
│   ├── pages/           # index, dashboard, faucet, nft, swap, staking, explorer, tokenomics
│   ├── components/      # Navbar, SwapPanel, StakingPool, NFTCard, TokenCard, ThemeToggle
│   ├── utils/           # contracts.js (ABIs + addresses), wagmiConfig.js
│   └── styles/
├── hardhat.config.js
└── .env.example
```

---

## Quick Start

### 1 — Clone & install dependencies

```bash
git clone <your-repo>
cd rialo-dapp

# Install contract dev dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2 — Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
PRIVATE_KEY=0xYOUR_WALLET_PRIVATE_KEY
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_KEY
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=YOUR_WALLETCONNECT_ID
```

> **Get a free WalletConnect Project ID:** https://cloud.walletconnect.com  
> **Get Sepolia ETH:** https://sepoliafaucet.com

### 3 — Compile contracts

```bash
npm run compile
```

### 4 — Deploy to Sepolia

```bash
npm run deploy:sepolia
```

The script prints all contract addresses. Copy them into:

```
frontend/utils/contracts.js  →  CONTRACT_ADDRESSES object
```

### 5 — Run the frontend

```bash
cd frontend
npm run dev
```

Open http://localhost:3000

---

## Deploy to Vercel

```bash
cd frontend
npx vercel --prod
```

Add environment variables in Vercel dashboard:
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_ALCHEMY_ID` (optional, for better RPC)

---

## Smart Contract Summary

| Contract | Symbol | Supply | Key Feature |
|----------|--------|--------|-------------|
| RialoToken | RLO | 1,000,000,000 | Faucet 1,000/day, 24h cooldown |
| MockBTC    | BTC | 1,000,000,000 | ERC20 test token |
| MockUSDT   | USDT | 1,000,000,000 | ERC20 test token |
| MockUSDC   | USDC | 1,000,000,000 | ERC20 test token |
| RialoNFT   | RNFT | 10,000 | Free first mint, 0.01 ETH after |
| Staking    | —    | —      | RLO 10%, BTC 8%, USDT/USDC 6% APR |
| Swap       | —    | —      | Fixed oracle, 0.3% fee |

---

## Local Hardhat Node (optional)

```bash
# Terminal 1 — start local node
npm run node

# Terminal 2 — deploy locally
npm run deploy:local
```

---

## Verify Contracts on Etherscan (optional)

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

---

## License
MIT
