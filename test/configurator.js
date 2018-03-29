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
const Token = artifacts.require('GeseToken.sol');
const PreITO = artifacts.require('PreITO.sol');
const ITO = artifacts.require('ITO.sol');

contract('Configurator integration test', function (accounts) {
  let configurator;
  let token;
  let preito;
  let ito;

  const manager = '0x675eDE27cafc8Bd07bFCDa6fEF6ac25031c74766';

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
    configurator = await Configurator.new();
    await configurator.deploy();

    const tokenAddress = await configurator.token();
    const preitoAddress = await configurator.preITO();
    const itoAddress = await configurator.ito();

    token = await Token.at(tokenAddress);
    preito = await PreITO.at(preitoAddress);
    ito = await ITO.at(itoAddress);
  });

  it('contracts should have token address', async function () {
    const tokenOwner = await token.owner();
    tokenOwner.should.bignumber.equal(manager);
  });

  it('contracts should have preITO address', async function () {
    const preitoOwner = await preito.owner();
    preitoOwner.should.bignumber.equal(manager);
  });

  it('contracts should have ITO address', async function () {
    const itoOwner = await ito.owner();
    itoOwner.should.bignumber.equal(manager);
  });

  it('preITO and ITO should have start time as described in README', async function () {
    const preitoStart = await preito.start();
    preitoStart.should.bignumber.equal((new Date('15 May 2018 00:00:00 GMT')).getTime() / 1000);
    const itoStart = await ito.start();
    itoStart.should.bignumber.equal((new Date('01 Jun 2018 00:00:00 GMT')).getTime() / 1000);
  });

  it ('preTCO and ITO should have price as described in README', async function () {
    const preitoPrice = await preito.price();
    preitoPrice.should.bignumber.equal(tokens(7867));
    const itoPrice = await ito.price();
    itoPrice.should.bignumber.equal(tokens(5500));
  });

  it ('preITO should have softcap as described in README', async function () {
    const preitoSoftcap = await preito.softcap();
    preitoSoftcap.should.bignumber.equal(ether(3640));
  });

  it ('preITO and ITO should have hardcap as described in README', async function () {
    const preitoHardcap = await preito.hardcap();
    preitoHardcap.should.bignumber.equal(ether(3818));
    const itoHardcap = await ito.hardcap();
    itoHardcap.should.bignumber.equal(ether(49090));
  });

  it ('preITO and ITO should have minimal insvested limit as described in README', async function () {
    const preitoMinInvest = await ito.minInvestedLimit();
    preitoMinInvest.should.bignumber.equal(ether(0.1));
    const itoMinInvest = await ito.minInvestedLimit();
    itoMinInvest.should.bignumber.equal(ether(0.1));
  });

  it ('bounty, advisors, team, reserved percent should be as described in README', async function () {
    const bountyPercent = await ito.bountyTokensPercent();
    bountyPercent.should.bignumber.equal(5);
    const advisorsPercent = await ito.advisorsTokensPercent();
    advisorsPercent.should.bignumber.equal(10);
    const teamPercent = await ito.teamTokensPercent();
    teamPercent.should.bignumber.equal(10);
    const reservedPercent = await ito.reservedTokensPercent();
    reservedPercent.should.bignumber.equal(10);
  });

  it ('preITO and ITO should have wallets as described in README', async function () {
    const preitoWallet = await preito.wallet();
    preitoWallet.should.bignumber.equal('0xa86780383E35De330918D8e4195D671140A60A74');
    const itoWallet = await ito.wallet();
    itoWallet.should.bignumber.equal('0x98882D176234AEb736bbBDB173a8D24794A3b085');
  });

  it ('bounty wallet, advisors wallet, team wallet, reserved wallet should be as described in README', async function () {
    const bountyWallet = await ito.bountyTokensWallet();
    bountyWallet.should.bignumber.equal('0x28732f6dc12606D529a020b9ac04C9d6f881D3c5');
    const advisorsWallet = await ito.advisorsTokensWallet();
    advisorsWallet.should.bignumber.equal('0x28732f6dc12606D529a020b9ac04C9d6f881D3c5');
    const teamWallet = await ito.teamTokensWallet();
    teamWallet.should.bignumber.equal('0x28732f6dc12606D529a020b9ac04C9d6f881D3c5');
    const reservedWallet = await ito.reservedTokensWallet();
    reservedWallet.should.bignumber.equal('0x28732f6dc12606D529a020b9ac04C9d6f881D3c5');
  });
});

