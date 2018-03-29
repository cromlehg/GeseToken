import ether from '../helpers/ether';
import tokens from '../helpers/tokens';
import {advanceBlock} from '../helpers/advanceToBlock';
import {increaseTimeTo, duration} from '../helpers/increaseTime';
import latestTime from '../helpers/latestTime';
import EVMRevert from '../helpers/EVMRevert';

require('chai')
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
    await crowdsale.setStart(latestTime());
    await crowdsale.setPrice(this.price);
    await crowdsale.setHardcap(this.hardcap);
    await crowdsale.setMinInvestedLimit(this.minInvestedLimit);
    await crowdsale.addMilestone(5, 33);
    await crowdsale.addMilestone(5, 18);
    await crowdsale.addMilestone(5, 11);
    await crowdsale.addMilestone(5, 5);
    await crowdsale.addMilestone(10, 0);
    await crowdsale.setWallet(this.wallet);
    await crowdsale.setBountyTokensWallet(wallets[3]);
    await crowdsale.setAdvisorsTokensWallet(wallets[4]);
    await crowdsale.setTeamTokensWallet(wallets[5]);
    await crowdsale.setReservedTokensWallet(wallets[6]);
    await crowdsale.setBountyTokensPercent(this.BountyTokensPercent);
    await crowdsale.setAdvisorsTokensPercent(this.AdvisorsTokensPercent);
    await crowdsale.setTeamTokensPercent(this.TeamTokensPercent);
    await crowdsale.setReservedTokensPercent(this.ReservedTokensPercent);

  });

  it('should correctly calculate bonuses', async function () {
    await crowdsale.sendTransaction({value: ether(1), from: wallets[1]});
    await crowdsale.sendTransaction({value: ether(99), from: wallets[2]});
    const owner = await crowdsale.owner();
    await crowdsale.finish({from: owner});

    const firstInvestorTokens = await token.balanceOf(wallets[1]);
    const secondInvestorTokens = await token.balanceOf(wallets[2]);
    const bountyTokens = await token.balanceOf(wallets[3]);
    const advisorsTokens = await token.balanceOf(wallets[4]);
    const teamTokens = await token.balanceOf(wallets[5]);
    const reservedTokens = await token.balanceOf(wallets[6]);
    const totalTokens = firstInvestorTokens
      .plus(secondInvestorTokens)
      .plus(bountyTokens)
      .plus(advisorsTokens)
      .plus(teamTokens)
      .plus(reservedTokens);

    assert.equal(Math.round(bountyTokens.mul(100).div(totalTokens)), this.BountyTokensPercent);
    assert.equal(Math.round(advisorsTokens.mul(100).div(totalTokens)), this.AdvisorsTokensPercent);
    assert.equal(Math.round(teamTokens.mul(100).div(totalTokens)), this.TeamTokensPercent);
    assert.equal(Math.round(reservedTokens.mul(100).div(totalTokens)), this.ReservedTokensPercent);
  });
}
