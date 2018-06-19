pragma solidity ^0.4.18;

import './ownership/Ownable.sol';
import './GeseToken.sol';
import './PreITO.sol';
import './ITO.sol';

contract Configurator is Ownable {

  MintableToken public token;

  PreITO public preITO;

  ITO public ito;

  function deploy() public onlyOwner {

    token = new GeseToken();

    preITO = new PreITO();

    preITO.setWallet(0x1B139Ad79ED5F69ca4545EE9c4F1C774FbEc99Fe);
    preITO.setStart(1529971200);
    preITO.setPeriod(14);
    preITO.setPrice(786700);
    preITO.setMinInvestedLimit(100000000000000000);
    preITO.setHardcap(3818000000000000000000);
    preITO.setSoftcap(3640000000000000000000);
    preITO.setReferalsMinInvestLimit(100000000000000000);
    preITO.setRefererPercent(5);
    preITO.setToken(token);

    token.setSaleAgent(preITO);

    ito = new ITO();

    ito.setWallet(0x1B139Ad79ED5F69ca4545EE9c4F1C774FbEc99Fe);
    ito.setStart(1536105600);
    ito.addMilestone(5, 33);
    ito.addMilestone(5, 18);
    ito.addMilestone(5, 11);
    ito.addMilestone(5, 5);
    ito.addMilestone(10, 0);
    ito.setPrice(550000);
    ito.setMinInvestedLimit(100000000000000000);
    ito.setHardcap(49090000000000000000000);
    ito.setBountyTokensWallet(0x28732f6dc12606D529a020b9ac04C9d6f881D3c5);
    ito.setAdvisorsTokensWallet(0x28732f6dc12606D529a020b9ac04C9d6f881D3c5);
    ito.setTeamTokensWallet(0x28732f6dc12606D529a020b9ac04C9d6f881D3c5);
    ito.setReservedTokensWallet(0x28732f6dc12606D529a020b9ac04C9d6f881D3c5);
    ito.setBountyTokensPercent(5);
    ito.setAdvisorsTokensPercent(10);
    ito.setTeamTokensPercent(10);
    ito.setReservedTokensPercent(10);
    ito.setReferalsMinInvestLimit(100000000000000000);
    ito.setRefererPercent(5);
    ito.setToken(token);

    preITO.setNextSaleAgent(ito);

    address manager = 0xEA15Adb66DC92a4BbCcC8Bf32fd25E2e86a2A770;

    token.transferOwnership(manager);
    preITO.transferOwnership(manager);
    ito.transferOwnership(manager);
  }

}

