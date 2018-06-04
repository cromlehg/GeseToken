pragma solidity ^0.4.18;

import './ReferersCommonSale.sol';
import './SoftcapFeature.sol';
import './NextSaleAgentFeature.sol';

contract PreITO is NextSaleAgentFeature, SoftcapFeature, ReferersCommonSale {

  uint public period;

  function calculateTokens(uint _invested) internal returns(uint) {
    return _invested.mul(price).div(1 ether);
  }

  function setPeriod(uint newPeriod) public onlyOwner {
    period = newPeriod;
  }

  function endSaleDate() public view returns(uint) {
    return start.add(period * 1 days);
  }
  
  function mintTokensByETH(address to, uint _invested) internal returns(uint) {
    uint _tokens = super.mintTokensByETH(to, _invested);
    updateBalance(to, _invested);
    return _tokens;
  }

  function finish() public onlyOwner {
    if (updateRefundState()) {
      token.finishMinting();
    } else {
      withdraw();
      token.setSaleAgent(nextSaleAgent);
    }
  }

  function fallback() internal minInvestLimited(msg.value) returns(uint) {
    require(now >= start && now < endSaleDate());
    token.lockAddressAfterITO(msg.sender);
    uint tokens = mintTokensByETH(msg.sender, msg.value);
    if(msg.value >= referalsMinInvestLimit) {
      address referer = getInputAddress();
      if(referer != address(0)) {
        require(referer != address(token) && referer != msg.sender && referer != address(this));
        mintTokens(referer, tokens.mul(refererPercent).div(percentRate));
      }
    }
    return tokens;
  }

}
