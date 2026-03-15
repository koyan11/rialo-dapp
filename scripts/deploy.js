const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // ─── Deploy Tokens ───────────────────────────────────────────────────────────
  console.log("1/7 Deploying RialoToken (RLO)...");
  const RialoToken = await ethers.getContractFactory("RialoToken");
  const rlo = await RialoToken.deploy(deployer.address);
  await rlo.waitForDeployment();
  console.log("   RLO:", await rlo.getAddress());

  console.log("2/7 Deploying MockBTC...");
  const MockBTC = await ethers.getContractFactory("MockBTC");
  const btc = await MockBTC.deploy(deployer.address);
  await btc.waitForDeployment();
  console.log("   BTC:", await btc.getAddress());

  console.log("3/7 Deploying MockUSDT...");
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const usdt = await MockUSDT.deploy(deployer.address);
  await usdt.waitForDeployment();
  console.log("   USDT:", await usdt.getAddress());

  console.log("4/7 Deploying MockUSDC...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy(deployer.address);
  await usdc.waitForDeployment();
  console.log("   USDC:", await usdc.getAddress());

  // ─── Deploy NFT ──────────────────────────────────────────────────────────────
  console.log("5/7 Deploying RialoNFT...");
  const RialoNFT = await ethers.getContractFactory("RialoNFT");
  const nft = await RialoNFT.deploy(deployer.address, "ipfs://YOUR_IPFS_CID/");
  await nft.waitForDeployment();
  console.log("   NFT:", await nft.getAddress());

  // ─── Deploy Staking ──────────────────────────────────────────────────────────
  console.log("6/7 Deploying Staking...");
  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(await rlo.getAddress(), deployer.address);
  await staking.waitForDeployment();
  console.log("   Staking:", await staking.getAddress());

  // Add staking pools
  await staking.addPool(await rlo.getAddress(), 1000);   // RLO 10%
  await staking.addPool(await btc.getAddress(), 800);    // BTC 8%
  await staking.addPool(await usdt.getAddress(), 600);   // USDT 6%
  await staking.addPool(await usdc.getAddress(), 600);   // USDC 6%
  console.log("   Staking pools configured.");

  // Deposit initial rewards (1M RLO)
  const rewardAmount = ethers.parseEther("1000000");
  await rlo.approve(await staking.getAddress(), rewardAmount);
  await staking.depositRewards(rewardAmount);
  console.log("   Staking rewards deposited.");

  // ─── Deploy Swap ─────────────────────────────────────────────────────────────
  console.log("7/7 Deploying Swap...");
  const Swap = await ethers.getContractFactory("Swap");
  const swap = await Swap.deploy(deployer.address);
  await swap.waitForDeployment();
  console.log("   Swap:", await swap.getAddress());

  const ETH_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeeeE";
  // Set prices (USD, 18 decimals)
  await swap.setTokenPrice(ETH_ADDRESS, ethers.parseEther("3000"));
  await swap.setTokenPrice(await rlo.getAddress(), ethers.parseEther("0.10"));
  await swap.setTokenPrice(await btc.getAddress(), ethers.parseEther("60000"));
  await swap.setTokenPrice(await usdt.getAddress(), ethers.parseEther("1"));
  await swap.setTokenPrice(await usdc.getAddress(), ethers.parseEther("1"));

  // Add ETH liquidity (0.5 ETH)
  await swap.addLiquidityETH({ value: ethers.parseEther("0.5") });

  // Add token liquidity
  const liqAmount = ethers.parseEther("500000");
  await rlo.approve(await swap.getAddress(), liqAmount);
  await swap.addLiquidity(await rlo.getAddress(), liqAmount);
  await btc.approve(await swap.getAddress(), ethers.parseEther("10"));
  await swap.addLiquidity(await btc.getAddress(), ethers.parseEther("10"));
  await usdt.approve(await swap.getAddress(), ethers.parseEther("100000"));
  await swap.addLiquidity(await usdt.getAddress(), ethers.parseEther("100000"));
  await usdc.approve(await swap.getAddress(), ethers.parseEther("100000"));
  await swap.addLiquidity(await usdc.getAddress(), ethers.parseEther("100000"));
  console.log("   Swap liquidity added.");

  // ─── Print Summary ───────────────────────────────────────────────────────────
  const addresses = {
    RLO: await rlo.getAddress(),
    BTC: await btc.getAddress(),
    USDT: await usdt.getAddress(),
    USDC: await usdc.getAddress(),
    NFT: await nft.getAddress(),
    STAKING: await staking.getAddress(),
    SWAP: await swap.getAddress(),
  };

  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log(JSON.stringify(addresses, null, 2));
  console.log("\nCopy these into: frontend/utils/contracts.js");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
