// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Staking is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable rewardToken; // RLO

    struct PoolInfo {
        IERC20 token;
        uint256 aprBps;       // basis points, e.g. 1000 = 10%
        uint256 totalStaked;
        bool active;
    }

    struct UserInfo {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastUpdateTime;
    }

    PoolInfo[] public pools;
    // poolId => user => UserInfo
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;

    event Staked(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdrawn(address indexed user, uint256 indexed pid, uint256 amount);
    event RewardClaimed(address indexed user, uint256 indexed pid, uint256 reward);
    event PoolAdded(uint256 indexed pid, address token, uint256 aprBps);

    constructor(address _rewardToken, address initialOwner) Ownable(initialOwner) {
        rewardToken = IERC20(_rewardToken);
    }

    function addPool(address _token, uint256 _aprBps) external onlyOwner {
        pools.push(PoolInfo({
            token: IERC20(_token),
            aprBps: _aprBps,
            totalStaked: 0,
            active: true
        }));
        emit PoolAdded(pools.length - 1, _token, _aprBps);
    }

    function setPoolAPR(uint256 pid, uint256 _aprBps) external onlyOwner {
        pools[pid].aprBps = _aprBps;
    }

    function pendingReward(uint256 pid, address _user) public view returns (uint256) {
        UserInfo storage user = userInfo[pid][_user];
        if (user.amount == 0) return user.rewardDebt;
        PoolInfo storage pool = pools[pid];
        uint256 elapsed = block.timestamp - user.lastUpdateTime;
        uint256 reward = (user.amount * pool.aprBps * elapsed) / (10000 * 365 days);
        return user.rewardDebt + reward;
    }

    function stake(uint256 pid, uint256 amount) external nonReentrant {
        require(pid < pools.length, "Staking: Invalid pool");
        require(pools[pid].active, "Staking: Pool not active");
        require(amount > 0, "Staking: Amount must be > 0");

        PoolInfo storage pool = pools[pid];
        UserInfo storage user = userInfo[pid][msg.sender];

        // Accumulate pending reward before updating
        if (user.amount > 0) {
            uint256 pending = pendingReward(pid, msg.sender);
            user.rewardDebt = pending;
        }

        pool.token.safeTransferFrom(msg.sender, address(this), amount);
        user.amount += amount;
        user.lastUpdateTime = block.timestamp;
        pool.totalStaked += amount;

        emit Staked(msg.sender, pid, amount);
    }

    function withdraw(uint256 pid, uint256 amount) external nonReentrant {
        require(pid < pools.length, "Staking: Invalid pool");
        UserInfo storage user = userInfo[pid][msg.sender];
        require(user.amount >= amount, "Staking: Insufficient staked");

        PoolInfo storage pool = pools[pid];

        // Accumulate reward
        user.rewardDebt = pendingReward(pid, msg.sender);
        user.lastUpdateTime = block.timestamp;
        user.amount -= amount;
        pool.totalStaked -= amount;

        pool.token.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, pid, amount);
    }

    function claimReward(uint256 pid) external nonReentrant {
        require(pid < pools.length, "Staking: Invalid pool");
        UserInfo storage user = userInfo[pid][msg.sender];

        uint256 reward = pendingReward(pid, msg.sender);
        require(reward > 0, "Staking: No reward");

        user.rewardDebt = 0;
        user.lastUpdateTime = block.timestamp;

        rewardToken.safeTransfer(msg.sender, reward);
        emit RewardClaimed(msg.sender, pid, reward);
    }

    function claimAllRewards() external nonReentrant {
        uint256 totalReward = 0;
        for (uint256 pid = 0; pid < pools.length; pid++) {
            UserInfo storage user = userInfo[pid][msg.sender];
            uint256 reward = pendingReward(pid, msg.sender);
            if (reward > 0) {
                user.rewardDebt = 0;
                user.lastUpdateTime = block.timestamp;
                totalReward += reward;
                emit RewardClaimed(msg.sender, pid, reward);
            }
        }
        require(totalReward > 0, "Staking: No rewards to claim");
        rewardToken.safeTransfer(msg.sender, totalReward);
    }

    function poolLength() external view returns (uint256) {
        return pools.length;
    }

    function depositRewards(uint256 amount) external onlyOwner {
        rewardToken.safeTransferFrom(msg.sender, address(this), amount);
    }
}
