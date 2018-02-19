var SingleBet = artifacts.require("./SingleBet.sol");

module.exports = function(deployer) {
  deployer.deploy(SingleBet, '0x4badd354e0edda5ebdc7ca00e084be02449db03f', 'Arsenal', 'United');
};
