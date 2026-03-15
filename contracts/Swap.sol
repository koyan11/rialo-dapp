// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Swap
 * @notice Fixed-rate mock oracle DEX for Rialo testnet
 * Prices are denominated in USD (18 decimals):
 *   ETH  = 3000 USD
 *   RLO  = 0.10 USD
 *   BTC  = 60000 USD
 *   USDT = 1 USD
 *   USDC = 1 USD
 */
contract Swap is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public constant FEE_BPS = 30; // 0.3%

    // token address => USD price (18 decimals)
    mapping(address => uint256) public tokenPrice;
    // token address => liquidity in contract
    mapping(address => uint256) public liquidity;

    address public constant ETH_ADDRESS = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeeeE);

    event LiquidityAdded(address indexed token, uint256 amount);
    event LiquidityRemoved(address indexed token, uint256 amount);
    event SwappedETHToToken(address indexed user, address indexed token, uint256 ethIn, uint256 tokenOut);
    event SwappedTokenToETH(address indexed user, address indexed token, uint256 tokenIn, uint256 ethOut);
    event SwappedTokenToToken(address indexed user, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setTokenPrice(address token, uint256 priceUSD18) external onlyOwner {
        tokenPrice[token] = priceUSD18;
    }

    function getAmountOut(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) public view returns (uint256 amountOut, uint256 fee) {
        uint256 priceIn = tokenIn == ETH_ADDRESS ? tokenPrice[ETH_ADDRESS] : tokenPrice[tokenIn];
        uint256 priceOut = tokenOut == ETH_ADDRESS ? tokenPrice[ETH_ADDRESS] : tokenPrice[tokenOut];
        require(priceIn > 0 && priceOut > 0, "Swap: Price not set");

        fee = (amountIn * FEE_BPS) / 10000;
        uint256 amountInAfterFee = amountIn - fee;
        amountOut = (amountInAfterFee * priceIn) / priceOut;
    }

    // ─── ETH → Token ────────────────────────────────────────────────────────────
    function swapETHToToken(address tokenOut, uint256 minAmountOut)
        external
        payable
        nonReentrant
    {
        require(msg.value > 0, "Swap: No ETH sent");
        require(tokenOut != ETH_ADDRESS, "Swap: Use ETH directly");

        (uint256 amountOut, ) = getAmountOut(ETH_ADDRESS, tokenOut, msg.value);
        require(amountOut >= minAmountOut, "Swap: Slippage too high");
        require(IERC20(tokenOut).balanceOf(address(this)) >= amountOut, "Swap: Insufficient liquidity");

        liquidity[ETH_ADDRESS] += msg.value;
        liquidity[tokenOut] -= amountOut;

        IERC20(tokenOut).safeTransfer(msg.sender, amountOut);
        emit SwappedETHToToken(msg.sender, tokenOut, msg.value, amountOut);
    }

    // ─── Token → ETH ────────────────────────────────────────────────────────────
    function swapTokenToETH(address tokenIn, uint256 amountIn, uint256 minAmountOut)
        external
        nonReentrant
    {
        require(amountIn > 0, "Swap: Amount must be > 0");
        require(tokenIn != ETH_ADDRESS, "Swap: Invalid tokenIn");

        (uint256 ethOut, ) = getAmountOut(tokenIn, ETH_ADDRESS, amountIn);
        require(ethOut >= minAmountOut, "Swap: Slippage too high");
        require(address(this).balance >= ethOut, "Swap: Insufficient ETH liquidity");

        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        liquidity[tokenIn] += amountIn;
        liquidity[ETH_ADDRESS] -= ethOut;

        (bool success, ) = msg.sender.call{value: ethOut}("");
        require(success, "Swap: ETH transfer failed");
        emit SwappedTokenToETH(msg.sender, tokenIn, amountIn, ethOut);
    }

    // ─── Token → Token ──────────────────────────────────────────────────────────
    function swapTokenToToken(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) external nonReentrant {
        require(amountIn > 0, "Swap: Amount must be > 0");
        require(tokenIn != tokenOut, "Swap: Same token");
        require(tokenIn != ETH_ADDRESS && tokenOut != ETH_ADDRESS, "Swap: Use ETH functions");

        (uint256 amountOut, ) = getAmountOut(tokenIn, tokenOut, amountIn);
        require(amountOut >= minAmountOut, "Swap: Slippage too high");
        require(IERC20(tokenOut).balanceOf(address(this)) >= amountOut, "Swap: Insufficient liquidity");

        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        liquidity[tokenIn] += amountIn;
        liquidity[tokenOut] -= amountOut;

        IERC20(tokenOut).safeTransfer(msg.sender, amountOut);
        emit SwappedTokenToToken(msg.sender, tokenIn, tokenOut, amountIn, amountOut);
    }

    // ─── Liquidity ───────────────────────────────────────────────────────────────
    function addLiquidityETH() external payable onlyOwner {
        require(msg.value > 0, "Swap: No ETH");
        liquidity[ETH_ADDRESS] += msg.value;
        emit LiquidityAdded(ETH_ADDRESS, msg.value);
    }

    function addLiquidity(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        liquidity[token] += amount;
        emit LiquidityAdded(token, amount);
    }

    function removeLiquidity(address token, uint256 amount) external onlyOwner {
        require(liquidity[token] >= amount, "Swap: Insufficient liquidity");
        liquidity[token] -= amount;
        if (token == ETH_ADDRESS) {
            (bool success, ) = owner().call{value: amount}("");
            require(success, "Swap: ETH transfer failed");
        } else {
            IERC20(token).safeTransfer(owner(), amount);
        }
        emit LiquidityRemoved(token, amount);
    }

    receive() external payable {
        liquidity[ETH_ADDRESS] += msg.value;
    }
}
