import ether from './helpers/ether';
import tokens from './helpers/tokens';
import unixTime from './helpers/unixTime';
import {duration} from './helpers/increaseTime';

import maintest from './testtokendistributor/tokendistributor';

const token = artifacts.require('GeseToken.sol');
const crowdsale = artifacts.require('ITO.sol');
const tokendistributor = artifacts.require('TokenDistributor.sol');

contract('TokenDistributor test', function (accounts) {
  before(config);
  maintest(token, crowdsale, tokendistributor, accounts);
});

function config() {
  // variables list based on info from README
  this.start = unixTime('01 Jun 2018 00:00:00 GMT');
  this.period = 30;
  this.price = tokens(5500);
  this.hardcap = ether(49090);
  this.minInvestedLimit = ether(0.1);
  this.wallet = '0x98882D176234AEb736bbBDB173a8D24794A3b085';
  this.BountyTokensWallet = '0x28732f6dc12606D529a020b9ac04C9d6f881D3c5';
  this.AdvisorsTokensWallet = '0x28732f6dc12606D529a020b9ac04C9d6f881D3c5';
  this.TeamTokensWallet = '0x28732f6dc12606D529a020b9ac04C9d6f881D3c5';
  this.ReservedTokensWallet = '0x28732f6dc12606D529a020b9ac04C9d6f881D3c5';
  this.BountyTokensPercent = 5;
  this.AdvisorsTokensPercent = 10;
  this.TeamTokensPercent = 10;
  this.ReservedTokensPercent = 10;
  this.refererPercent = 5;
  this.referalsMinInvestLimit = ether(0.1);

  // variables for additional testing convinience
  this.end = this.start + duration.days(this.period);
  this.beforeStart = this.start - duration.seconds(10);
  this.afterEnd = this.end + duration.seconds(1);
}
