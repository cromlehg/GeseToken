pragma solidity ^0.4.18;

import './AssembledCommonSale.sol';

contract ITO is AssembledCommonSale {

  address public bountyTokensWallet;

  address public advisorsTokensWallet;
  
  address public teamTokensWallet;

  address public reservedTokensWallet;

  uint public bountyTokensPercent;
  
  uint public advisorsTokensPercent;

  uint public teamTokensPercent;

  uint public reservedTokensPercent;

  function setBountyTokensPercent(uint newBountyTokensPercent) public onlyOwner {
    bountyTokensPercent = newBountyTokensPercent;
  }
  
  function setAdvisorsTokensPercent(uint newAdvisorsTokensPercent) public onlyOwner {
    advisorsTokensPercent = newAdvisorsTokensPercent;
  }

  function setTeamTokensPercent(uint newTeamTokensPercent) public onlyOwner {
    teamTokensPercent = newTeamTokensPercent;
  }

  function setReservedTokensPercent(uint newReservedTokensPercent) public onlyOwner {
    reservedTokensPercent = newReservedTokensPercent;
  }

  function setBountyTokensWallet(address newBountyTokensWallet) public onlyOwner {
    bountyTokensWallet = newBountyTokensWallet;
  }

  function setAdvisorsTokensWallet(address newAdvisorsTokensWallet) public onlyOwner {
    advisorsTokensWallet = newAdvisorsTokensWallet;
  }

  function setTeamTokensWallet(address newTeamTokensWallet) public onlyOwner {
    teamTokensWallet = newTeamTokensWallet;
  }

  function setReservedTokensWallet(address newReservedTokensWallet) public onlyOwner {
    reservedTokensWallet = newReservedTokensWallet;
  }

  function finish() public onlyOwner {
    uint summaryTokensPercent = bountyTokensPercent.add(advisorsTokensPercent).add(teamTokensPercent).add(reservedTokensPercent);
    uint mintedTokens = token.totalSupply();
    uint allTokens = mintedTokens.mul(percentRate).div(percentRate.sub(summaryTokensPercent));
    uint advisorsTokens = allTokens.mul(advisorsTokensPercent).div(percentRate);
    uint bountyTokens = allTokens.mul(bountyTokensPercent).div(percentRate);
    uint teamTokens = allTokens.mul(teamTokensPercent).div(percentRate);
    uint reservedTokens = allTokens.mul(reservedTokensPercent).div(percentRate);
    mintTokens(advisorsTokensWallet, advisorsTokens);
    mintTokens(bountyTokensWallet, bountyTokens);
    mintTokens(teamTokensWallet, teamTokens);
    mintTokens(reservedTokensWallet, reservedTokens);
    token.finishMinting();
  }

}
