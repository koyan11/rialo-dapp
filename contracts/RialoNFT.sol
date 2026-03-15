// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract RialoNFT is ERC721Enumerable, Ownable, ReentrancyGuard {
    using Strings for uint256;

    uint256 public constant MAX_SUPPLY = 10_000;
    uint256 public constant MAX_PER_WALLET = 10;
    uint256 public mintPrice = 0.01 ether;
    string public baseURI;
    uint256 private _nextTokenId = 1;

    mapping(address => uint256) public mintedPerWallet;

    event NFTMinted(address indexed to, uint256 indexed tokenId);

    constructor(address initialOwner, string memory _baseURI)
        ERC721("Rialo NFT", "RNFT")
        Ownable(initialOwner)
    {
        baseURI = _baseURI;
    }

    function mint(uint256 quantity) external payable nonReentrant {
        require(quantity > 0, "RialoNFT: Quantity must be > 0");
        require(_nextTokenId + quantity - 1 <= MAX_SUPPLY, "RialoNFT: Exceeds max supply");
        require(mintedPerWallet[msg.sender] + quantity <= MAX_PER_WALLET, "RialoNFT: Exceeds wallet limit");
        require(msg.value >= mintPrice * quantity, "RialoNFT: Insufficient ETH");

        mintedPerWallet[msg.sender] += quantity;
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(msg.sender, tokenId);
            emit NFTMinted(msg.sender, tokenId);
        }
    }

    function freeMint() external nonReentrant {
        require(_nextTokenId <= MAX_SUPPLY, "RialoNFT: Exceeds max supply");
        require(mintedPerWallet[msg.sender] == 0, "RialoNFT: Already minted free NFT");
        mintedPerWallet[msg.sender] += 1;
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        emit NFTMinted(msg.sender, tokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return bytes(baseURI).length > 0
            ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json"))
            : "";
    }

    function walletTokens(address wallet) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(wallet);
        uint256[] memory tokens = new uint256[](balance);
        for (uint256 i = 0; i < balance; i++) {
            tokens[i] = tokenOfOwnerByIndex(wallet, i);
        }
        return tokens;
    }

    function totalMinted() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    function setMintPrice(uint256 _price) external onlyOwner {
        mintPrice = _price;
    }

    function withdraw() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "RialoNFT: Withdraw failed");
    }
}
