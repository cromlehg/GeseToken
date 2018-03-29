import ether from './helpers/ether';
import tokens from './helpers/tokens';
import unixTime from './helpers/unixTime';
import {duration} from './helpers/increaseTime';

import capped from './preito/capped';
import common from './preito/common';
import refundable from './preito/refundable';
import refererbonus from './preito/refererbonus';
import additional from './preito/additional';

const token = artifacts.require('GeseToken.sol');
const crowdsale = artifacts.require('PreITO.sol');

contract('PreITO - common test', function (accounts) {
  before(config);
  common(token, crowdsale, accounts);
});

contract('PreITO - capped crowdsale test', function (accounts) {
  before(config);
  capped(token, crowdsale, accounts);
});

contract('PreITO - refundable crowdsale test', function (accounts) {
  before(config);
  refundable(token, crowdsale, accounts);
});

contract('PreITO - referer bonus crowdsale test', function (accounts) {
  before(config);
  refererbonus(token, crowdsale, accounts);
});

contract('PreITO - additional features test', function (accounts) {
  before(config);
  additional(token, crowdsale, accounts);
});

function config() {
  // variables list based on info from README
  this.start = unixTime('15 May 2018 00:00:00 GMT');
  this.period = 15;
  this.price = tokens(7867);
  this.softcap = ether(3640);
  this.hardcap = ether(3818);
  this.minInvestedLimit = ether(0.1);
  this.wallet = '0xa86780383E35De330918D8e4195D671140A60A74';
  this.refererPercent = 5;
  this.referalsMinInvestLimit = ether(1);

  // variables for additional testing convinience
  this.end = this.start + duration.days(this.period);
  this.beforeStart = this.start - duration.seconds(10);
  this.afterEnd = this.end + duration.seconds(1);
}
