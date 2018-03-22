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

    preITO.setWallet(0xa86780383E35De330918D8e4195D671140A60A74);
    preITO.setStart(1518393600);
    preITO.setPrice(9000000000000000000000);
    preITO.setMinInvestedLimit(100000000000000000);
    preITO.setToken(token);
    preITO.setHardcap(16000000000000000000000);
    preITO.setSoftcap(500000000000000000000);

    token.setSaleAgent(preITO);

    ito = new ITO();

    ito.addMilestone(7, 25);
    ito.addMilestone(7, 15);
    ito.addMilestone(14, 10);
    ito.setMinInvestedLimit(100000000000000000);
    ito.setToken(token);
    ito.setPrice(4500000000000000000000);
    ito.setWallet(0x98882D176234AEb736bbBDB173a8D24794A3b085);
    ito.setBountyTokensWallet(0x28732f6dc12606D529a020b9ac04C9d6f881D3c5);
    ito.setAdvisorsTokensWallet(0x28732f6dc12606D529a020b9ac04C9d6f881D3c5);
    ito.setDevelopersTokensWallet(0x28732f6dc12606D529a020b9ac04C9d6f881D3c5);
    ito.setStart(1520640000);
    ito.setHardcap(24000000000000000000000);
    ito.setAdvisorsTokensPercent(2);
    ito.setBountyTokensPercent(3);
    ito.setDevelopersTokensPercent(20);

    preITO.setNextSaleAgent(ito);

    address manager = 0x675eDE27cafc8Bd07bFCDa6fEF6ac25031c74766;

    token.transferOwnership(manager);
    preITO.transferOwnership(manager);
    ito.transferOwnership(manager);
  }

}

