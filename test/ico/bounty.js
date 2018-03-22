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
    await crowdsale.addMilestone(7, 25);
    await crowdsale.addMilestone(7, 15);
    await crowdsale.addMilestone(14, 10);
    await crowdsale.setWallet(this.wallet);
    await crowdsale.setBountyTokensWallet(wallets[3]);
    await crowdsale.setAdvisorsTokensWallet(wallets[4]);
    await crowdsale.setDevelopersTokensWallet(wallets[5]);
    await crowdsale.setBountyTokensPercent(this.BountyTokensPercent);
    await crowdsale.setAdvisorsTokensPercent(this.AdvisorsTokensPercent);
    await crowdsale.setDevelopersTokensPercent(this.DevelopersTokensPercent);

  });

  it('should correctly calculate bonuses for founders and bounty', async function () {
    await crowdsale.sendTransaction({value: ether(1), from: wallets[1]});
    await crowdsale.sendTransaction({value: ether(99), from: wallets[2]});
    const owner = await crowdsale.owner();
    await crowdsale.finish({from: owner});

    const firstInvestorTokens = await token.balanceOf(wallets[1]);
    const secondInvestorTokens = await token.balanceOf(wallets[2]);
    const bountyTokens = await token.balanceOf(wallets[3]);
    const advisorsTokens = await token.balanceOf(wallets[4]);
    const developersTokens = await token.balanceOf(wallets[5]);
    const totalTokens = firstInvestorTokens
      .plus(secondInvestorTokens)
      .plus(bountyTokens)
      .plus(advisorsTokens)
      .plus(developersTokens);
    assert.equal(bountyTokens.div(totalTokens), this.BountyTokensPercent / 100);
    assert.equal(advisorsTokens.div(totalTokens), this.AdvisorsTokensPercent / 100);
    assert.equal(developersTokens.div(totalTokens), this.DevelopersTokensPercent / 100);
  });
}
