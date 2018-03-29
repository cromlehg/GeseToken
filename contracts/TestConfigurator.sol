pragma solidity ^0.4.18;

import './ownership/Ownable.sol';

contract GeseToken {
  function setSaleAgent(address newSaleAgent) public;
  function transferOwnership(address newOwner) public;
}

contract PreITO {
  function setStart(uint newStart) public;
  function setPeriod(uint newPeriod) public;
  function setPrice(uint newPrice) public;
  function setMinInvestedLimit(uint newMinInvestedLimit) public;
  function setSoftcap(uint newSoftcap) public;
  function setHardcap(uint newHardcap) public;
  function setWallet(address newWallet) public;
  function setNextSaleAgent(address newICO) public;
  function setReferalsMinInvestLimit(uint newRefereralsMinInvestLimit) public;
  function setRefererPercent(uint newRefererPercent) public;
  function setToken(address newToken) public;
  function transferOwnership(address newOwner) public;
}

contract ITO {
  function setStart(uint newStart) public;
  function addMilestone(uint period, uint bonus) public;
  function setPrice(uint newPrice) public;
  function setMinInvestedLimit(uint newMinInvestedLimit) public;
  function setHardcap(uint newHardcap) public;
  function setWallet(address newWallet) public;
  function setBountyTokensWallet(address newBountyWallet) public;
  function setAdvisorsTokensWallet(address newAdvisorsTokenWallet) public;
  function setTeamTokensWallet(address newTeamTokensWallet) public;
  function setReservedTokensWallet(address newReservedTokensWallet) public;
  function setBountyTokensPercent(uint newBountyTokensPercent) public;
  function setAdvisorsTokensPercent(uint newAdvisorsTokenPercent) public;
  function setTeamTokensPercent(uint newTeamTokensPercent) public;
  function setReservedTokensPercent(uint newReservedTokensPercent) public;
  function setReferalsMinInvestLimit(uint newRefereralsMinInvestLimit) public;
  function setRefererPercent(uint newRefererPercent) public;
  function setToken(address newToken) public;
  function transferOwnership(address newOwner) public;
}

contract TestConfigurator is Ownable {
  GeseToken public token;
  PreITO public preITO;
  ITO public ito;

  function setToken(address _token) public onlyOwner {
    token = GeseToken(_token);
  }

  function setPreITO(address _preITO) public onlyOwner {
    preITO = PreITO(_preITO);
  }

  function setITO(address _ito) public onlyOwner {
    ito = ITO(_ito);
  }

  function deploy() public onlyOwner {
    preITO.setWallet(0x8fD94be56237EA9D854B23B78615775121Dd1E82);
    preITO.setStart(1522108800);
    preITO.setPeriod(15);
    preITO.setPrice(786700);
    preITO.setMinInvestedLimit(100000000000000000);
    preITO.setHardcap(3818000000000000000000);
    preITO.setSoftcap(3640000000000000000000);
    preITO.setReferalsMinInvestLimit(100000000000000000);
    preITO.setRefererPercent(5);
    preITO.setToken(token);

    token.setSaleAgent(preITO);
    preITO.setNextSaleAgent(ito);

    ito.setStart(1522108800);
    ito.addMilestone(5, 33);
    ito.addMilestone(5, 18);
    ito.addMilestone(5, 11);
    ito.addMilestone(5, 5);
    ito.addMilestone(10, 0);
    ito.setPrice(550000);
    ito.setMinInvestedLimit(100000000000000000);
    ito.setHardcap(49090000000000000000000);
    ito.setWallet(0x8fD94be56237EA9D854B23B78615775121Dd1E82);
    ito.setBountyTokensWallet(0x8Ba7Aa817e5E0cB27D9c146A452Ea8273f8EFF29);
    ito.setAdvisorsTokensWallet(0x24a7774d0eba02846580A214eeca955214cA776C);
    ito.setTeamTokensWallet(0xaa8ed6878a202eF6aFC518a64D2ccB8D73f1f2Ca);
    ito.setReservedTokensWallet(0xaa8ed6878a202eF6aFC518a64D2ccB8D73f1f2Ca);
    ito.setBountyTokensPercent(5);
    ito.setAdvisorsTokensPercent(10);
    ito.setTeamTokensPercent(10);
    ito.setReservedTokensPercent(10);
    ito.setReferalsMinInvestLimit(100000000000000000);
    ito.setRefererPercent(5);
    ito.setToken(token);

    token.transferOwnership(owner);
    preITO.transferOwnership(owner);
    ito.transferOwnership(owner);
  }
}
