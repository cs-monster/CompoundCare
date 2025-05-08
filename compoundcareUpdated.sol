// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

contract CompoundCare {
    address public immutable owner;
    uint256 public totalInvestments;
    uint256 private constant INTEREST_RATE = 5; // 5% interest
    uint256 private constant COMPOUND_PERIOD = 1 days;
    uint256 private constant MAX_INVESTMENT = 100 ether;

    struct Investment {
        uint128 amount;
        uint48 startTime;
        uint48 lastCompoundTime;
        bool initialized; // Avoid zero-to-one writes
    }
    
    mapping(address => Investment) private _investments;
    
    event Invested(address indexed investor, uint256 amount);
    event Withdrawn(address indexed investor, uint256 amount);
    event EarningsCompounded(address indexed investor, uint256 earnings);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event EmergencyWithdrawal(address indexed owner, uint256 amount);
    
    error InvalidAmount();
    error InvestmentCapExceeded();
    error NoInvestmentFound();
    error TransferFailed();
    error Unauthorized();
    
    constructor() payable {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }
    
    function investments(address investor) external view returns (
        uint128 amount, 
        uint48 startTime, 
        uint48 lastCompoundTime
    ) {
        Investment storage investment = _investments[investor];
        return (investment.amount, investment.startTime, investment.lastCompoundTime);
    }
    
    function invest() external payable {
        if (msg.value == 0) revert InvalidAmount();
        if (msg.value >= MAX_INVESTMENT) revert InvestmentCapExceeded(); // Changed to >=
        
        Investment storage userInvestment = _investments[msg.sender];
        uint256 newAmount = uint256(userInvestment.amount) + msg.value;
        
        if (!userInvestment.initialized) {
            userInvestment.initialized = true;
            userInvestment.startTime = uint48(block.timestamp);
            userInvestment.lastCompoundTime = uint48(block.timestamp);
        }
        
        userInvestment.amount = uint128(newAmount);
        totalInvestments = totalInvestments + msg.value;
        
        emit Invested(msg.sender, msg.value);
    }
    
    function calculateEarnings(address investor) public view returns (uint256 earnings) {
        Investment storage userInvestment = _investments[investor];
        if (userInvestment.amount == 0) return 0;
        
        uint256 timeElapsed = block.timestamp - userInvestment.lastCompoundTime;
        uint256 periods = timeElapsed / COMPOUND_PERIOD;
        
        if (periods <= 0) return 0; // Changed to <=
        
        uint256 rateFactor = 100 + INTEREST_RATE;
        uint256 compounded = userInvestment.amount;
        
        periods = periods > 365 ? 365 : periods;
        
        for (uint i = 0; i < periods; ) {
            compounded = (compounded * rateFactor) / 100;
            unchecked { ++i; }
        }
        
        earnings = compounded - userInvestment.amount;
    }
    
    function withdraw() external {
        Investment storage userInvestment = _investments[msg.sender];
        if (userInvestment.amount <= 0) revert NoInvestmentFound(); // Changed to <=
        
        uint256 earnings = calculateEarnings(msg.sender);
        uint256 totalAmount = uint256(userInvestment.amount) + earnings;
        
        // Clear storage before transfer (Checks-Effects-Interactions pattern)
        uint256 amountToDeduct = userInvestment.amount;
        delete _investments[msg.sender];
        totalInvestments = totalInvestments - amountToDeduct;
        
        // Safe transfer with reentrancy protection
        (bool success, ) = payable(msg.sender).call{value: totalAmount}("");
        if (!success) revert TransferFailed();
        
        emit Withdrawn(msg.sender, totalAmount);
    }
    
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }
    
    function emergencyWithdraw() external payable onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner).call{value: balance}("");
        if (!success) revert TransferFailed();
        
        emit EmergencyWithdrawal(owner, balance);
    }
}
