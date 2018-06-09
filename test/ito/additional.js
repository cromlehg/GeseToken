import ether from '../helpers/ether';
import tokens from '../helpers/tokens';
import {advanceBlock} from '../helpers/advanceToBlock';
import {increaseTimeTo, duration} from '../helpers/increaseTime';
import latestTime from '../helpers/latestTime';
import EVMRevert from '../helpers/EVMRevert';

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
    await crowdsale.setBountyTokensWallet(this.BountyTokensWallet);
    await crowdsale.setAdvisorsTokensWallet(this.AdvisorsTokensWallet);
    await crowdsale.setTeamTokensWallet(this.TeamTokensWallet);
    await crowdsale.setReservedTokensWallet(this.ReservedTokensWallet);
    await crowdsale.setBountyTokensPercent(this.BountyTokensPercent);
    await crowdsale.setAdvisorsTokensPercent(this.AdvisorsTokensPercent);
    await crowdsale.setTeamTokensPercent(this.TeamTokensPercent);
    await crowdsale.setReservedTokensPercent(this.ReservedTokensPercent);
  });

  it('should mintTokensByETHExternal by owner', async function () {
    const owner = await crowdsale.owner();
    await crowdsale.mintTokensByETHExternal(wallets[4], ether(1), {from: owner}).should.be.fulfilled;
    const balance = await token.balanceOf(wallets[4]);
    balance.should.bignumber.equal(this.price.times(1.33));
  });

  it('should mintTokensByETHExternal by Direct Mint Agend', async function () {
    const owner = await crowdsale.owner();
    await crowdsale.setDirectMintAgent(wallets[2], {from: owner});
    await crowdsale.mintTokensByETHExternal(wallets[5], ether(1), {from: wallets[2]}).should.be.fulfilled;
    const balance = await token.balanceOf(wallets[5]);
    balance.should.bignumber.equal(this.price.times(1.33));
  });

  it('should mintTokensExternal by owner', async function () {
    const owner = await crowdsale.owner();
    await crowdsale.mintTokensExternal(wallets[4], tokens(100), {from: owner}).should.be.fulfilled;
    const balance = await token.balanceOf(wallets[4]);
    balance.should.bignumber.equal(tokens(100));
  });

  it('should mintTokensExternal by Direct Mint Agent', async function () {
    const owner = await crowdsale.owner();
    await crowdsale.setDirectMintAgent(wallets[3], {from: owner});
    await crowdsale.mintTokensExternal(wallets[6], tokens(100), {from: wallets[3]}).should.be.fulfilled;
    const balance = await token.balanceOf(wallets[6]);
    balance.should.bignumber.equal(tokens(100));
  });

  it('should use wallet for investments', async function () {
    const investment = ether(1);
    const pre = web3.eth.getBalance(this.wallet);
    const owner = await crowdsale.owner();
    await crowdsale.sendTransaction({value: investment, from: wallets[1]});
    const post = web3.eth.getBalance(this.wallet);
    post.minus(pre).should.bignumber.equal(investment);
  });

  it('should mintTokensExternal and lock tokens depends on LockAfterManuallyMint', async function () {
    const owner = await crowdsale.owner();
    await crowdsale.mintTokensExternal(wallets[9], tokens(100), {from: owner});
    await crowdsale.setLockAfterManuallyMint(false, {from: owner});
    await crowdsale.mintTokensExternal(wallets[10], tokens(100), {from: owner});
    await crowdsale.finish({from: owner});
    await token.transfer(wallets[5], tokens(100), {from: wallets[9]}).should.be.rejectedWith(EVMRevert);
    await token.transfer(wallets[5], tokens(100), {from: wallets[10]}).should.be.fulfilled;
  });

  it('should mintTokensByETHExternal and lock tokens depends on LockAfterManuallyMint', async function () {
    const owner = await crowdsale.owner();
    await crowdsale.mintTokensByETHExternal(wallets[9], ether(1), {from: owner});
    await crowdsale.setLockAfterManuallyMint(false, {from: owner});
    await crowdsale.mintTokensByETHExternal(wallets[10], ether(1), {from: owner});
    await crowdsale.finish({from: owner});
    await token.transfer(wallets[5], tokens(100), {from: wallets[9]}).should.be.rejectedWith(EVMRevert);
    await token.transfer(wallets[5], tokens(100), {from: wallets[10]}).should.be.fulfilled;
  });

  it('should transfer from unlocked address accounts during crowdsale', async function () {
    const owner = await crowdsale.owner();
    await crowdsale.sendTransaction({value: ether(1), from: wallets[7]});
    await crowdsale.sendTransaction({value: ether(1), from: wallets[8]});
    await token.unlockAddressDuringITO(wallets[7], {from: owner});    
    await token.transfer(wallets[9], 100, {from: wallets[7]}).should.be.fulfilled;
    await token.transfer(wallets[9], 100, {from: wallets[8]}).should.be.rejectedWith(EVMRevert);
    const balance = await token.balanceOf(wallets[9]);
    assert.equal(balance, 100);
  });

  it('should transfer from unlocked address accounts after crowdsale', async function () {
    const owner = await crowdsale.owner();
    await crowdsale.sendTransaction({value: ether(1), from: wallets[7]});
    await crowdsale.sendTransaction({value: ether(1), from: wallets[8]});
    await crowdsale.finish({from: owner});
    await token.unlockAddressAfterITO(wallets[7], {from: owner});    
    await token.transfer(wallets[9], 100, {from: wallets[7]}).should.be.fulfilled;
    await token.transfer(wallets[9], 100, {from: wallets[8]}).should.be.rejectedWith(EVMRevert);
    const balance = await token.balanceOf(wallets[9]);
    assert.equal(balance, 100);
  });

  it('should unlock batch address accounts after crowdsale', async function () {
    const owner = await crowdsale.owner();
    await crowdsale.sendTransaction({value: ether(1), from: wallets[6]});
    await crowdsale.sendTransaction({value: ether(1), from: wallets[7]});
    await crowdsale.sendTransaction({value: ether(1), from: wallets[8]});
    await crowdsale.finish({from: owner});
    await token.unlockBatchOfAddressesAfterITO([wallets[6], wallets[7], wallets[8]], {from: owner});    
    await token.transfer(wallets[9], 100, {from: wallets[6]}).should.be.fulfilled;
    await token.transfer(wallets[9], 100, {from: wallets[7]}).should.be.fulfilled;
    await token.transfer(wallets[9], 100, {from: wallets[8]}).should.be.fulfilled;
    const balance = await token.balanceOf(wallets[9]);
    assert.equal(balance, 300);
  });

}
