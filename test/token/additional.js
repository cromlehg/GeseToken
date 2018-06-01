import assertRevert from '../helpers/assertRevert';
import expectThrow from '../helpers/expectThrow';

export default function (Token, accounts) {
  let token;

  beforeEach(async function () {
    token = await Token.new();
  });

  it('should return the correct address after setting sale agent', async function () {
    await token.setSaleAgent(accounts[1]);
    const saleAgent = await token.saleAgent();
    assert.equal(saleAgent, accounts[1]);
  });

  it('should mint from owner or sale agent accounts only', async function () {
    await token.setSaleAgent(accounts[1]);
    await token.mint(accounts[2], 100, {from: accounts[0]});
    await token.mint(accounts[2], 100, {from: accounts[1]});
    const balance = await token.balanceOf(accounts[2]);
    assert.equal(balance, 200);
    await assertRevert(token.mint(accounts[2], 100, {from: accounts[2]}));
  });

  it('should fail to call finishMinting from non-owner accounts', async function () {
    await expectThrow(token.finishMinting({from: accounts[2]}));
  });

  it('should transfer from owner or sale agent or unlocked address accounts only after call to finishMinting', async function () {
    await token.setSaleAgent(accounts[1]);    
    await token.mint(accounts[0], 100, {from: accounts[0]});
    await token.mint(accounts[1], 100, {from: accounts[0]});
    await token.mint(accounts[2], 100, {from: accounts[0]});
    await token.mint(accounts[3], 100, {from: accounts[0]});
    await token.finishMinting({from: accounts[1]});
    await token.lockAddressAfterITO(accounts[2], {from: accounts[0]});
    await token.lockAddressAfterITO(accounts[3], {from: accounts[0]});
    await token.transfer(accounts[4], 100, {from: accounts[0]}).should.be.fulfilled;
    await token.transfer(accounts[4], 100, {from: accounts[1]}).should.be.fulfilled;
    await assertRevert(token.transfer(accounts[4], 100, {from: accounts[2]}));
    await assertRevert(token.transfer(accounts[4], 100, {from: accounts[3]}));
    await token.unlockAddressAfterITO(accounts[2], {from: accounts[0]});
    await token.transfer(accounts[4], 100, {from: accounts[2]}).should.be.fulfilled;
    const balance = await token.balanceOf(accounts[4]);
    assert.equal(balance, 300);
  });

  it('should transferFrom from owner or sale agent or unlocked address accounts only after call to finishMinting', async function () {
    await token.setSaleAgent(accounts[1]);
    await token.mint(accounts[0], 100, {from: accounts[0]});
    await token.mint(accounts[1], 100, {from: accounts[0]});
    await token.mint(accounts[2], 100, {from: accounts[0]});
    await token.mint(accounts[3], 100, {from: accounts[0]});
    await token.approve(accounts[0], 100, {from: accounts[0]});
    await token.approve(accounts[1], 100, {from: accounts[1]});
    await token.approve(accounts[2], 100, {from: accounts[2]});
    await token.approve(accounts[3], 100, {from: accounts[3]});
    await token.finishMinting({from: accounts[1]});
    await token.lockAddressAfterITO(accounts[2], {from: accounts[0]});
    await token.lockAddressAfterITO(accounts[3], {from: accounts[0]});
    await assertRevert(token.transferFrom(accounts[2], accounts[4], 100, {from: accounts[2]}));
    await assertRevert(token.transferFrom(accounts[3], accounts[4], 100, {from: accounts[3]}));
    await token.unlockAddressAfterITO(accounts[2], {from: accounts[0]});
    await token.transferFrom(accounts[0], accounts[4], 100, {from: accounts[0]}).should.be.fulfilled;
    await token.transferFrom(accounts[1], accounts[4], 100, {from: accounts[1]}).should.be.fulfilled;
    await token.transferFrom(accounts[2], accounts[4], 100, {from: accounts[2]}).should.be.fulfilled;
    const balance = await token.balanceOf(accounts[4]);
    assert.equal(balance, 300);
  });

  it('should transfer from unlocked address accounts if minting is not finished', async function () {
    await token.mint(accounts[2], 100, {from: accounts[0]});
    await token.mint(accounts[3], 100, {from: accounts[0]});
    await token.unclockAddressDuringITO(accounts[2], {from: accounts[0]});
    await token.transfer(accounts[4], 100, {from: accounts[2]}).should.be.fulfilled;
    await assertRevert(token.transfer(accounts[4], 100, {from: accounts[3]}));
    const balance = await token.balanceOf(accounts[4]);
    assert.equal(balance, 100);
  });

  it('should transferFrom from unlocked address accounts if minting is not finished', async function () {
    await token.mint(accounts[2], 100, {from: accounts[0]});
    await token.mint(accounts[3], 100, {from: accounts[0]});
    await token.approve(accounts[2], 100, {from: accounts[2]});
    await token.approve(accounts[3], 100, {from: accounts[3]});
    await token.unclockAddressDuringITO(accounts[2], {from: accounts[0]});
    await token.transferFrom(accounts[2], accounts[4], 100, {from: accounts[2]}).should.be.fulfilled;
    await assertRevert(token.transferFrom(accounts[3], accounts[4], 100, {from: accounts[3]}));
    const balance = await token.balanceOf(accounts[4]);
    assert.equal(balance, 100);
  });

}
