import ether from '../helpers/ether';
import tokens from '../helpers/tokens';
import {advanceBlock} from '../helpers/advanceToBlock';
import {duration} from '../helpers/increaseTime';
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
    await crowdsale.setPeriod(this.period);
    await crowdsale.setPrice(this.price);
    await crowdsale.setSoftcap(this.softcap);
    await crowdsale.setHardcap(this.hardcap);
    await crowdsale.setMinInvestedLimit(this.minInvestedLimit);
    await crowdsale.setWallet(this.wallet);
    await crowdsale.setRefererPercent(this.refererPercent);
    await crowdsale.setReferalsMinInvestLimit(this.referalsMinInvestLimit);
  });

  it('should add referer bonus', async function () {	
    await crowdsale.sendTransaction({value: ether(1), from: wallets[6], data: wallets[5]}).should.be.fulfilled;	
    const refbalance = await token.balanceOf(wallets[5]);
    const balance = await token.balanceOf(wallets[6]);	
    refbalance.should.be.bignumber.equal(balance * 0.05);
  });

  it('should not add referer bonus if investment less then min', async function () { 
    await crowdsale.sendTransaction({value: ether(0.1), from: wallets[6], data: wallets[5]}).should.be.fulfilled; 
    const refbalance = await token.balanceOf(wallets[5]);
    refbalance.should.be.bignumber.equal(0);
  });
  
   it('should works normal if referer is not specified', async function () {  
    await crowdsale.sendTransaction({value: ether(1), from: wallets[6], data: ''}).should.be.fulfilled; 
    const balance = await token.balanceOf(wallets[6]);
    balance.should.be.bignumber.equal(this.price.times(1));	
  }); 
  
  it('investor сannot accrue bonus to himself', async function () {  
    await crowdsale.sendTransaction({value: ether(1), from: wallets[6], data: wallets[6]}).should.be.rejectedWith(EVMRevert); 
  });

  it('token contract сannot get referer bonus', async function () {  
    const referer = token.address;
    await crowdsale.sendTransaction({value: ether(1), from: wallets[6], data: referer}).should.be.rejectedWith(EVMRevert); 	
  });  

  it('crowdsale contract сannot get referer bonus', async function () {  
    const referer = crowdsale.address;
    await crowdsale.sendTransaction({value: ether(1), from: wallets[6], data: referer}).should.be.rejectedWith(EVMRevert); 
  }); 
}
