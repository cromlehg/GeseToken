import ether from '../helpers/ether';
import tokens from '../helpers/tokens';
import {advanceBlock} from '../helpers/advanceToBlock';
import {increaseTimeTo, duration} from '../helpers/increaseTime';
import latestTime from '../helpers/latestTime';
import EVMRevert from '../helpers/EVMRevert';
import unixTime from '../helpers/unixTime';

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(web3.BigNumber))
  .should();

export default function (Token, Crowdsale, wallets) {
  let token;
  let crowdsale;

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  beforeEach(async function () {
    token = await Token.new();
    crowdsale = await Crowdsale.new();
    await token.setSaleAgent(crowdsale.address);
    await crowdsale.setToken(token.address);
    await crowdsale.setStart(this.start);
    await crowdsale.setPrice(this.price);
    await crowdsale.setHardcap(this.hardcap);
    await crowdsale.setMinInvestedLimit(this.minInvestedLimit);
    await crowdsale.addMilestone(5, 33);
    await crowdsale.addMilestone(5, 18);
    await crowdsale.addMilestone(5, 11);
    await crowdsale.addMilestone(5, 5);
    await crowdsale.addMilestone(10, 0);
    await crowdsale.setWallet(this.wallet);
    await crowdsale.setBountyTokensWallet(this.BountyTokensWallet);
    await crowdsale.setAdvisorsTokensWallet(this.AdvisorsTokensWallet);
    await crowdsale.setTeamTokensWallet(this.TeamTokensWallet);
    await crowdsale.setReservedTokensWallet(this.ReservedTokensWallet);
    await crowdsale.setBountyTokensPercent(this.BountyTokensPercent);
    await crowdsale.setAdvisorsTokensPercent(this.AdvisorsTokensPercent);
    await crowdsale.setTeamTokensPercent(this.TeamTokensPercent);
    await crowdsale.setReservedTokensPercent(this.ReservedTokensPercent);
  });

  it('crowdsale should be a saleAgent for token', async function () {
    const owner = await token.saleAgent();
    owner.should.equal(crowdsale.address);
  });

  it('end should be equal to start + duration', async function () {
    const start = await crowdsale.start();
    const end = await crowdsale.endSaleDate();
    end.should.bignumber.equal(start.plus(duration.days(this.period)));
  });

  it('should reject payments before start', async function () {
    await crowdsale.setStart(this.start + duration.seconds(1));
    await crowdsale.sendTransaction({value: ether(1), from: wallets[3]}).should.be.rejectedWith(EVMRevert);
  });

  it('should accept payments after start', async function () {
    await increaseTimeTo(this.start + duration.seconds(2));
    await crowdsale.sendTransaction({value: ether(1), from: wallets[3]}).should.be.fulfilled;
  });

  it('should reject payments after finish', async function () {
    await crowdsale.sendTransaction({value: ether(1), from: wallets[3]}).should.be.fulfilled;
    const owner = await crowdsale.owner();
    await crowdsale.finish({from: owner}).should.be.fulfilled;
    await crowdsale.sendTransaction({value: ether(1), from: wallets[3]}).should.be.rejectedWith(EVMRevert);
  });

  it('should assign tokens to sender', async function () {
    await crowdsale.sendTransaction({value: ether(1), from: wallets[3]});
    const balance = await token.balanceOf(wallets[3]);
    balance.should.be.bignumber.equal(this.price.times(1.33));
  });

  it('should reject payments after end', async function () {
    await increaseTimeTo(this.afterEnd);
    await crowdsale.sendTransaction({value: ether(1), from: wallets[3]}).should.be.rejectedWith(EVMRevert);
  });
}
