// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockBTC is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18;

    constructor(address initialOwner) ERC20("Bitcoin Test Token", "BTC") Ownable(initialOwner) {
        _mint(initialOwner, MAX_SUPPLY);
    }

    function mintTo(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "MockBTC: Exceeds max supply");
        _mint(to, amount);
    }
}
