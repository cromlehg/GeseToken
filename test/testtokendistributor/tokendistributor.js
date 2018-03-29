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

export default function (Token, Crowdsale, TokenDistributor, wallets) {
  let token;
  let crowdsale;
  let tokendistributor;

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  beforeEach(async function () {
    token = await Token.new();
    crowdsale = await Crowdsale.new();
    tokendistributor = await TokenDistributor.new();
    await token.setSaleAgent(crowdsale.address);
    await crowdsale.setToken(token.address);
    await crowdsale.setStart(latestTime());
    await token.transferOwnership(wallets[1]);

    await tokendistributor.setToken(token.address);
    await tokendistributor.transferOwnership(wallets[1]);

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
    await crowdsale.transferOwnership(wallets[1]);
  });

  it ('should retrieve tokens to addresses in list', async function () {
    await crowdsale.sendTransaction({value: ether(1), from: wallets[1]});
    await crowdsale.finish({from: wallets[1]});

    const totalbalance = tokens(500);
    await token.transfer(tokendistributor.address, totalbalance, {from: wallets[1]});

    const receivers = [wallets[2],wallets[3]];
    const balances = [tokens(100), tokens(200)];
    await tokendistributor.addReceivers(receivers, balances, {from: wallets[1]});

    const balance_1 = await token.balanceOf(tokendistributor.address);
    const balance_2 = await token.balanceOf(wallets[2]);
    const balance_3 = await token.balanceOf(wallets[3]);

    balance_1.should.be.bignumber.equal(totalbalance.sub(balance_2).sub(balance_3));
    balance_2.should.be.bignumber.equal(balances[0]);
    balance_3.should.be.bignumber.equal(balances[1]);  
  });

  it ('should reject if not enough tokens', async function () {
    await crowdsale.sendTransaction({value: ether(1), from: wallets[1]});
    await crowdsale.finish({from: wallets[1]});

    const totalbalance = tokens(100);
    await token.transfer(tokendistributor.address, totalbalance, {from: wallets[1]});

    const receivers = [wallets[2],wallets[3]];
    const balances = [tokens(100), tokens(200)];
    await tokendistributor.addReceivers(receivers, balances, {from: wallets[1]}).should.be.rejectedWith(EVMRevert);

    const balance_1 = await token.balanceOf(tokendistributor.address);
    const balance_2 = await token.balanceOf(wallets[2]);
    const balance_3 = await token.balanceOf(wallets[3]);

    balance_1.should.be.bignumber.equal(totalbalance);
    balance_2.should.be.bignumber.equal(0);
    balance_3.should.be.bignumber.equal(0); 
  });

  it ('should retrieve current tokens to owner', async function () {
    await crowdsale.sendTransaction({value: ether(1), from: wallets[1]});
    await crowdsale.finish({from: wallets[1]});

    const totalbalance = tokens(500);
    await token.transfer(tokendistributor.address, totalbalance, {from: wallets[1]});

    const before = await token.balanceOf(tokendistributor.address);
    before.should.be.bignumber.equal(totalbalance);

    const receivers = [wallets[2],wallets[3]];
    const balances = [tokens(100), tokens(200)];
    await tokendistributor.addReceivers(receivers, balances, {from: wallets[1]});
    await tokendistributor.retrieveCurrentTokensToOwner({from: wallets[1]});

    const after = await token.balanceOf(tokendistributor.address);
    after.should.be.bignumber.equal(0);
  });

}
