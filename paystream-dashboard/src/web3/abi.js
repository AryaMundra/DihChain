export const PAYSTREAM_ABI = [
  "function depositTreasury(uint256 amount)",
  "function startStream(address employee,uint256 monthlySalary,uint256 taxPercent)",
  "function pauseStream(address employee)",
  "function cancelStream(address employee)",
  "function withdraw()",
  "function payBonus(address employee,uint256 amount)",
  "function updateTaxVault(address newVault)",
  "function treasuryBalance() view returns(uint256)",
  "function earned(address employee) view returns(uint256)",
  "function owner() view returns(address)"
];

export const ERC20_ABI = [
  "function approve(address spender,uint256 amount) returns(bool)",
  "function allowance(address owner,address spender) view returns(uint256)",
  "function balanceOf(address account) view returns(uint256)",
  "function transfer(address to,uint256 amount) returns(bool)",
  "function transferFrom(address from,address to,uint256 amount) returns(bool)",
  "function decimals() view returns(uint8)",
  "function symbol() view returns(string)",
  "function name() view returns(string)"
];