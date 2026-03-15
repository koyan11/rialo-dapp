// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RialoToken is ERC20, Ownable, ReentrancyGuard {
    uint256 public constant FAUCET_AMOUNT = 1000 * 10 ** 18;
    uint256 public constant COOLDOWN = 24 hours;
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18;

    mapping(address => uint256) public lastFaucetClaim;

    event FaucetClaimed(address indexed user, uint256 amount, uint256 timestamp);

    constructor(address initialOwner) ERC20("Rialo Token", "RLO") Ownable(initialOwner) {
        _mint(initialOwner, 900_000_000 * 10 ** 18);
        _mint(address(this), 100_000_000 * 10 ** 18);
    }

    function claimFaucet() external nonReentrant {
        require(block.timestamp >= lastFaucetClaim[msg.sender] + COOLDOWN, "RLO: Cooldown not finished");
        require(balanceOf(address(this)) >= FAUCET_AMOUNT, "RLO: Faucet empty");
        lastFaucetClaim[msg.sender] = block.timestamp;
        _transfer(address(this), msg.sender, FAUCET_AMOUNT);
        emit FaucetClaimed(msg.sender, FAUCET_AMOUNT, block.timestamp);
    }

    function getNextClaimTime(address user) external view returns (uint256) {
        if (lastFaucetClaim[user] == 0) return 0;
        uint256 next = lastFaucetClaim[user] + COOLDOWN;
        return next > block.timestamp ? next : 0;
    }

    function refillFaucet(uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "RLO: Exceeds max supply");
        _mint(address(this), amount);
    }

    function mintTo(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "RLO: Exceeds max supply");
        _mint(to, amount);
    }
}
