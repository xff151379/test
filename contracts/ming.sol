// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Ming is ERC20 {
    constructor() ERC20("Ming", "MING") {
        uint256 initialSupply = 1000000 * 10**18;
        _mint(msg.sender, initialSupply);
    }
}
