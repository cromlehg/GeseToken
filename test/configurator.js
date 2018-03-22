import ether from './helpers/ether';
import tokens from './helpers/tokens';
import {advanceBlock} from './helpers/advanceToBlock';
import {increaseTimeTo, duration} from './helpers/increaseTime';
import latestTime from './helpers/latestTime';
import EVMRevert from './helpers/EVMRevert';

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(web3.BigNumber))
  .should();

const Configurator = artifacts.require('Configurator.sol');
const Token = artifacts.require('BuyAndSellToken.sol');
const PreICO = artifacts.require('PreICO.sol');
const ICO = artifacts.require('ICO.sol');

contract('Configurator integration test', function (accounts) {
  let configurator;
  let token;
  let preico;
  let ico;

  const manager = '0x675eDE27cafc8Bd07bFCDa6fEF6ac25031c74766';

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
    configurator = await Configurator.new();
    await configurator.deploy();

    const tokenAddress = await configurator.token();
    const preicoAddress = await configurator.preICO();
    const icoAddress = await configurator.ico();

    token = await Token.at(tokenAddress);
    preico = await PreICO.at(preicoAddress);
    ico = await ICO.at(icoAddress);
  });

  it('contracts should have token address', async function () {
    const tokenOwner = await token.owner();
    tokenOwner.should.bignumber.equal(manager);
  });

  it('contracts should have preICO address', async function () {
    const preicoOwner = await preico.owner();
    preicoOwner.should.bignumber.equal(manager);
  });

  it('contracts should have ICO address', async function () {
    const icoOwner = await ico.owner();
    icoOwner.should.bignumber.equal(manager);
  });

  it('preICO and ICO should have start time as described in README', async function () {
    const preicoStart = await preico.start();
    preicoStart.should.bignumber.equal((new Date('12 Feb 2018 00:00:00 GMT')).getTime() / 1000);
    const icoStart = await ico.start();
    icoStart.should.bignumber.equal((new Date('10 Mar 2018 00:00:00 GMT')).getTime() / 1000);
  });

  it ('preICO and ICO should have price as described in README', async function () {
    const preicoPrice = await preico.price();
    preicoPrice.should.bignumber.equal(tokens(9000));
    const icoPrice = await ico.price();
    icoPrice.should.bignumber.equal(tokens(4500));
  });

  it ('preICO should have softcap as described in README', async function () {
    const preicoSoftcap = await preico.softcap();
    preicoSoftcap.should.bignumber.equal(ether(500));
  });

  it ('preICO and ICO should have hardcap as described in README', async function () {
    const preicoHardcap = await preico.hardcap();
    preicoHardcap.should.bignumber.equal(ether(16000));
    const icoHardcap = await ico.hardcap();
    icoHardcap.should.bignumber.equal(ether(24000));
  });

  it ('preICO and ICO should have minimal insvested limit as described in README', async function () {
    const preicoMinInvest = await ico.minInvestedLimit();
    preicoMinInvest.should.bignumber.equal(ether(0.1));
    const icoMinInvest = await ico.minInvestedLimit();
    icoMinInvest.should.bignumber.equal(ether(0.1));
  });

  it ('bounty, advisors, developers percent should be as described in README', async function () {
    const bountyPercent = await ico.bountyTokensPercent();
    bountyPercent.should.bignumber.equal(3);
    const advisorsPercent = await ico.advisorsTokensPercent();
    advisorsPercent.should.bignumber.equal(2);
    const developersPercent = await ico.developersTokensPercent();
    developersPercent.should.bignumber.equal(20);
  });

  it ('preICO and ICO should have wallets as described in README', async function () {
    const preicoWallet = await preico.wallet();
    preicoWallet.should.bignumber.equal('0xa86780383E35De330918D8e4195D671140A60A74');
    const icoWallet = await ico.wallet();
    icoWallet.should.bignumber.equal('0x98882D176234AEb736bbBDB173a8D24794A3b085');
  });

  it ('bounty wallet, advisors wallet and developers wallet should be as described in README', async function () {
    const bountyWallet = await ico.bountyTokensWallet();
    bountyWallet.should.bignumber.equal('0x28732f6dc12606D529a020b9ac04C9d6f881D3c5');
    const advisorsWallet = await ico.advisorsTokensWallet();
    advisorsWallet.should.bignumber.equal('0x28732f6dc12606D529a020b9ac04C9d6f881D3c5');
    const developersWallet = await ico.developersTokensWallet();
    developersWallet.should.bignumber.equal('0x28732f6dc12606D529a020b9ac04C9d6f881D3c5');
  });
});

