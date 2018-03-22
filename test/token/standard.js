import assertRevert from '../helpers/assertRevert';

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(web3.BigNumber))
  .should();

export default function (Token, accounts) {
  let token;

  beforeEach(async function () {
    token = await Token.new();
    await token.setSaleAgent(accounts[0]);
  });

  it('should return the correct allowance amount after approval', async function () {
    await token.approve(accounts[1], 100);
    const allowance = await token.allowance(accounts[0], accounts[1]);
    assert.equal(allowance, 100);
  });

  it('should return correct balances after transfer', async function () {
    await token.mint(accounts[0], 100);
    await token.transfer(accounts[1], 100);
    const balance0 = await token.balanceOf(accounts[0]);
    assert.equal(balance0, 0);
    const balance1 = await token.balanceOf(accounts[1]);
    assert.equal(balance1, 100);
  });

  it('should throw an error when trying to transfer more than balance', async function () {
    await token.mint(accounts[0], 100);
    await assertRevert(token.transfer(accounts[1], 101));
  });

  it('should return correct balances after transfering from another account', async function () {
    await token.mint(accounts[0], 100);
    await token.finishMinting();
    await token.approve(accounts[1], 100);
    await token.transferFrom(accounts[0], accounts[2], 100, {from: accounts[1]});
    const balance0 = await token.balanceOf(accounts[0]);
    assert.equal(balance0, 0);
    const balance1 = await token.balanceOf(accounts[2]);
    assert.equal(balance1, 100);
    const balance2 = await token.balanceOf(accounts[1]);
    assert.equal(balance2, 0);
  });

  it('should throw an error when trying to transfer more than allowed', async function () {
    await token.mint(accounts[0], 100);
    await token.finishMinting();
    await token.approve(accounts[1], 99);
    await assertRevert(token.transferFrom(accounts[0], accounts[2], 100, {from: accounts[1]}));
  });

  it('should throw an error when trying to transferFrom more than _from has', async function () {
    await token.mint(accounts[0], 100);
    const balance0 = await token.balanceOf(accounts[0]);
    await token.approve(accounts[1], balance0 + 1);
    await assertRevert(token.transferFrom(accounts[0], accounts[2], balance0 + 1, {from: accounts[1]}));
  });

  describe('validating allowance updates to spender', function () {
    let preApproved;

    it('should start with zero', async function () {
      preApproved = await token.allowance(accounts[0], accounts[1]);
      assert.equal(preApproved, 0);
    });

    it('should increase by 50 then decrease by 10', async function () {
      await token.increaseApproval(accounts[1], 50);
      const postIncrease = await token.allowance(accounts[0], accounts[1]);
      preApproved.plus(50).should.be.bignumber.equal(postIncrease);
      await token.decreaseApproval(accounts[1], 10);
      const postDecrease = await token.allowance(accounts[0], accounts[1]);
      postIncrease.minus(10).should.be.bignumber.equal(postDecrease);
    });
  });

  it('should increase by 50 then set to 0 when decreasing by more than 50', async function () {
    await token.approve(accounts[1], 50);
    await token.decreaseApproval(accounts[1], 60);
    const postDecrease = await token.allowance(accounts[0], accounts[1]);
    postDecrease.should.be.bignumber.equal(0);
  });

  it('should throw an error when trying to transfer to 0x0', async function () {
    await token.mint(accounts[0], 100);
    await token.finishMinting();
    await assertRevert(token.transfer(0x0, 100));
  });

  it('should throw an error when trying to transfer to 0x0 from another account', async function () {
    await token.mint(accounts[0], 100);
    await token.finishMinting();
    await token.approve(accounts[1], 100);
    await assertRevert(token.transferFrom(accounts[0], 0x0, 100, {from: accounts[1]}));
  });
}
