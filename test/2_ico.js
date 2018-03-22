import ether from './helpers/ether';
import tokens from './helpers/tokens';
import unixTime from './helpers/unixTime';
import {duration} from './helpers/increaseTime';

import capped from './ico/capped';
import common from './ico/common';
import milestonebonus from './ico/milestonebonus';
import bounty from './ico/bounty';
import additional from './ico/additional';

const token = artifacts.require('BuyAndSellToken.sol');
const crowdsale = artifacts.require('ICO.sol');

contract('ICO - common test', function (accounts) {
  before(config);
  common(token, crowdsale, accounts);
});

contract('ICO - capped crowdsale test', function (accounts) {
  before(config);
  capped(token, crowdsale, accounts);
});

contract('ICO - milestone bonus test', function (accounts) {
  before(config);
  milestonebonus(token, crowdsale, accounts);
});

contract('ICO - bounty test', function (accounts) {
  before(config);
  bounty(token, crowdsale, accounts);
});

contract('ICO - additional features test', function (accounts) {
  before(config);
  additional(token, crowdsale, accounts);
});

function config() {
  // variables list based on info from README
  this.start = unixTime('10 Apr 2018 00:00:00 GMT');
  this.period = 28;
  this.price = tokens(4500);
  this.hardcap = ether(24000);
  this.minInvestedLimit = ether(0.1);
  this.wallet = '0x98882D176234AEb736bbBDB173a8D24794A3b085';
  this.BountyTokensWallet = '0x28732f6dc12606D529a020b9ac04C9d6f881D3c5';
  this.AdvisorsTokensWallet = '0x28732f6dc12606D529a020b9ac04C9d6f881D3c5';
  this.DevelopersTokensWallet = '0x28732f6dc12606D529a020b9ac04C9d6f881D3c5';
  this.BountyTokensPercent = 3;
  this.AdvisorsTokensPercent = 2;
  this.DevelopersTokensPercent = 20;

  // variables for additional testing convinience
  this.end = this.start + duration.days(this.period);
  this.beforeStart = this.start - duration.seconds(10);
  this.afterEnd = this.end + duration.seconds(1);
}
