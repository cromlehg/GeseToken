import assertRevert from '../helpers/assertRevert';

export default function (Token, accounts) {
  let token;

  beforeEach(async function () {
    token = await Token.new();
    await token.setSaleAgent(accounts[1]);
  });

  it('should return correct balances after transfer', async function () {
    await token.mint(accounts[1], 100, {from: accounts[1]});
    await token.transfer(accounts[2], 100, {from: accounts[1]});
    const balance1 = await token.balanceOf(accounts[1]);
    assert.equal(balance1, 0);
    const balance2 = await token.balanceOf(accounts[2]);
    assert.equal(balance2, 100);
  });

  it('should throw an error when trying to transfer more than balance', async function () {
    await token.mint(accounts[1], 100, {from: accounts[1]});
    await assertRevert(token.transfer(accounts[1], 101));
  });

  it('should throw an error when trying to transfer to 0x0', async function () {
    await token.mint(accounts[1], 100, {from: accounts[1]});
    await assertRevert(token.transfer(0x0, 100));
  });
}
