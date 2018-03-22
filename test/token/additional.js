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
}
