// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MingAirdrop {
    // 合约的创建者
    address public owner;

    // Ming 代币合约地址
    address public mingTokenAddress;

    // Merkle 树的根
    bytes32 public merkleRoot;

    // 已领取的用户列表
    mapping(address => bool) public claimed;

    constructor(address _mingTokenAddress, bytes32 _merkleRoot) {
        owner = msg.sender;
        mingTokenAddress = _mingTokenAddress;
        merkleRoot = _merkleRoot;
    }

    // 领取 Ming 代币
    function claim(bytes32[] calldata merkleProof, address user) external {
        // 确认该用户未领取
        require(!claimed[user], "Already claimed");

        // 验证该用户在空投地址集合中
        bytes32 node = keccak256(abi.encodePacked(user));
        require(
            MerkleProof.verify(merkleProof, merkleRoot, node),
            "Invalid proof"
        );

        // 更新状态并发送代币
        claimed[user] = true;
        ERC20 mingToken = ERC20(mingTokenAddress);
        mingToken.transfer(user, 1e18);
    }
}
