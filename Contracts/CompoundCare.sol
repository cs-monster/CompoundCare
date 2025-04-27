// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// contract CompoundCare {
//     address public owner;
//     uint256 public totalInvestments;
//     uint256 public constant INTEREST_RATE = 5; // 5% interest
//     uint256 public constant COMPOUND_FREQUENCY = 1 days;
    
//     struct Investment {
//         uint256 amount;
//         uint256 startTime;
//         uint256 lastCompoundTime;
//     }
    
//     mapping(address => Investment) public investments;
    
//     event Invested(address indexed investor, uint256 amount);
    
//     constructor() {
//         owner = msg.sender;
//     }
    
//     function invest() external payable {
//         require(msg.value > 0, "Minimum 1 wei");
//         Investment storage userInvestment = investments[msg.sender];
//         userInvestment.amount += msg.value;
//         if (userInvestment.startTime == 0) {
//             userInvestment.startTime = block.timestamp;
//             userInvestment.lastCompoundTime = block.timestamp;
//         }
//         totalInvestments += msg.value;
//         emit Invested(msg.sender, msg.value);
//     }
    
//     function calculateEarnings(address investor) public view returns (uint256) {
//         Investment memory userInvestment = investments[investor];
//         if (userInvestment.amount == 0) return 0;
//         uint256 periods = (block.timestamp - userInvestment.lastCompoundTime) / COMPOUND_FREQUENCY;
//         uint256 earnings = userInvestment.amount;
//         for (uint i = 0; i < periods && i < 100; i++) {
//             earnings += (earnings * INTEREST_RATE) / 100;
//         }
//         return earnings - userInvestment.amount;
//     }
// }