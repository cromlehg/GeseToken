pragma solidity ^0.4.18;

import './ownership/Ownable.sol';
import './ERC20Cutted.sol';

contract TokenDistributor is Ownable { 
    
  ERC20Cutted public token;
    
  function setToken(address tokenAddr) public onlyOwner {
    token = ERC20Cutted(tokenAddr);
  }
 
  function addReceivers(address[] receivers, uint[] balances) public onlyOwner {
    for(uint i = 0; i < receivers.length; i++) {
      token.transfer(receivers[i], balances[i]);
    }
  } 
  
  function retrieveCurrentTokensToOwner() public {
    retrieveTokens(owner, address(token));
  }

  function retrieveTokens(address to, address anotherToken) public onlyOwner {
    ERC20Cutted alienToken = ERC20Cutted(anotherToken);
    alienToken.transfer(to, alienToken.balanceOf(this));
  }

}
