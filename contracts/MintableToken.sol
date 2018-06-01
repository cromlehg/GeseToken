pragma solidity ^0.4.18;

import './ownership/Ownable.sol';
import './token/StandardToken.sol';

contract MintableToken is StandardToken, Ownable {

  event Mint(address indexed to, uint256 amount);

  event MintFinished();

  bool public mintingFinished = false;

  address public saleAgent;

  mapping(address => bool) public lockedAddressesAfterITO;

  mapping(address => bool) public unlockedAddressesDuringITO;

  address[] public tokenHolders;

  modifier onlyOwnerOrSaleAgent() {
    require(msg.sender == saleAgent || msg.sender == owner);
    _;
  }

  function unclockAddressDuringITO(address addressToUnlock) public onlyOwnerOrSaleAgent {
    unlockedAddressesDuringITO[addressToUnlock] = true;
  }

  function lockAddressAfterITO(address addressToLock) public onlyOwnerOrSaleAgent {
    lockedAddressesAfterITO[addressToLock] = true;
  }

  function unlockAddressAfterITO(address addressToUnlock) public onlyOwnerOrSaleAgent {
    lockedAddressesAfterITO[addressToUnlock] = false;
  }

  function unlockBatchOfAddressesAfterITO(address[] addressesToUnlock) public onlyOwnerOrSaleAgent {
    for(uint i = 0; i < addressesToUnlock.length; i++) lockedAddressesAfterITO[addressesToUnlock[i]] = false;
  }


  modifier notLocked() {
    require((mintingFinished && !lockedAddressesAfterITO[msg.sender]) ||
            msg.sender == saleAgent || 
            msg.sender == owner ||
            (!mintingFinished && unlockedAddressesDuringITO[msg.sender]));
    _;
  }

  function setSaleAgent(address newSaleAgnet) public onlyOwnerOrSaleAgent {
    saleAgent = newSaleAgnet;
  }

  function mint(address _to, uint256 _amount) public returns (bool) {
    require((msg.sender == saleAgent || msg.sender == owner) && !mintingFinished);
    if(balances[msg.sender] == 0) tokenHolders.push(msg.sender);
    totalSupply = totalSupply.add(_amount);
    balances[_to] = balances[_to].add(_amount);
    Mint(_to, _amount);
    return true;
  }

  /**
   * @dev Function to stop minting new tokens.
   * @return True if the operation was successful.
   */
  function finishMinting() public returns (bool) {
    require((msg.sender == saleAgent || msg.sender == owner) && !mintingFinished);
    mintingFinished = true;
    MintFinished();
    return true;
  }

  function transfer(address _to, uint256 _value) public notLocked returns (bool) {
    return super.transfer(_to, _value);
  }

  function transferFrom(address from, address to, uint256 value) public notLocked returns (bool) {
    return super.transferFrom(from, to, value);
  }

}
