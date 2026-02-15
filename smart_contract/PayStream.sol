// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/v4.9.3/contracts/token/ERC20/IERC20.sol";
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/v4.9.3/contracts/access/Ownable.sol";
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/v4.9.3/contracts/security/ReentrancyGuard.sol";


contract PayStreamVault is Ownable, ReentrancyGuard {

    IERC20 public immutable hlusd;
    address public taxVault;

    struct Stream {
        uint256 monthlySalary;     // full salary
        uint256 salaryPerSecond;   // computed once
        uint256 taxPercent;        // e.g., 10 = 10%
        uint256 startTime;
        uint256 lastWithdrawTime;
        bool active;
    }

    mapping(address => Stream) public streams;

    uint256 constant SECONDS_IN_MONTH = 30 days;

    event StreamStarted(address indexed employee, uint256 monthlySalary);
    event Withdrawn(address indexed employee, uint256 amount);
    event StreamPaused(address indexed employee);
    event StreamCancelled(address indexed employee);

    constructor(address _hlusd, address _taxVault) {
        hlusd = IERC20(_hlusd);
        taxVault = _taxVault;
    }

    // ===============================
    // HR FUNCTIONS
    // ===============================

    function depositTreasury(uint256 amount) external onlyOwner {
        require(amount > 0, "Invalid amount");
        hlusd.transferFrom(msg.sender, address(this), amount);
    }

    function startStream(
        address employee,
        uint256 monthlySalary,
        uint256 taxPercent
    ) external onlyOwner {

        require(employee != address(0), "Invalid employee");
        require(!streams[employee].active, "Stream already active");
        require(monthlySalary > 0, "Invalid salary");
        require(taxPercent <= 50, "Too high tax");

        uint256 salaryPerSecond = monthlySalary / SECONDS_IN_MONTH;

        streams[employee] = Stream({
            monthlySalary: monthlySalary,
            salaryPerSecond: salaryPerSecond,
            taxPercent: taxPercent,
            startTime: block.timestamp,
            lastWithdrawTime: block.timestamp,
            active: true
        });

        emit StreamStarted(employee, monthlySalary);
    }

    function pauseStream(address employee) external onlyOwner {
        require(streams[employee].active, "Not active");
        streams[employee].active = false;
        emit StreamPaused(employee);
    }

    function cancelStream(address employee) external onlyOwner {
        require(streams[employee].active, "Not active");
        streams[employee].active = false;
        emit StreamCancelled(employee);
    }

    // ===============================
    // VIEW FUNCTION
    // ===============================

    function earned(address employee) public view returns (uint256) {
        Stream memory s = streams[employee];

        if (!s.active) {
            return 0;
        }

        uint256 timeElapsed = block.timestamp - s.lastWithdrawTime;
        return timeElapsed * s.salaryPerSecond;
    }

    // ===============================
    // WITHDRAW FUNCTION
    // ===============================

    function withdraw() external nonReentrant {

        Stream storage s = streams[msg.sender];
        require(s.active, "No active stream");

        uint256 amount = earned(msg.sender);
        require(amount > 0, "Nothing to withdraw");

        s.lastWithdrawTime = block.timestamp;

        uint256 taxAmount = (amount * s.taxPercent) / 100;
        uint256 employeeAmount = amount - taxAmount;

        require(
            hlusd.balanceOf(address(this)) >= amount,
            "Insufficient treasury"
        );

        hlusd.transfer(msg.sender, employeeAmount);
        hlusd.transfer(taxVault, taxAmount);

        emit Withdrawn(msg.sender, employeeAmount);
    }

    // ===============================
    // BONUS FEATURE
    // ===============================

    function payBonus(address employee, uint256 amount)
        external
        onlyOwner
    {
        require(amount > 0, "Invalid bonus");
        hlusd.transfer(employee, amount);
    }

    // ===============================
    // ADMIN CONFIG
    // ===============================

    function updateTaxVault(address newVault) external onlyOwner {
        require(newVault != address(0), "Invalid address");
        taxVault = newVault;
    }

    function treasuryBalance() external view returns (uint256) {
        return hlusd.balanceOf(address(this));
    }
}