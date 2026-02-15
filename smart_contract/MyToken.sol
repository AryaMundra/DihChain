// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title MyToken - A basic ERC20 Token on HeLa Chain
/// @custom:dev-run-script ./scripts/deploy.js

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Dihadi", "Dih") {
       _mint(msg.sender, initialSupply * 10 ** decimals());
    }
}