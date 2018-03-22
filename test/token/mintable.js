import expectThrow from '../helpers/expectThrow';

export default function (Token, accounts) {
  let token;

  beforeEach(async function () {
    token = await Token.new();
    await token.setSaleAgent(accounts[1]);
  });

  it('should start with a totalSupply of 0', async function () {
    const totalSupply = await token.totalSupply();
    assert.equal(totalSupply, 0);
  });

  it('should return mintingFinished false after construction', async function () {
    const mintingFinished = await token.mintingFinished();
    assert.equal(mintingFinished, false);
  });

  it('should mint a given amount of tokens to a given address', async function () {
    const result = await token.mint(accounts[2], 100, {from: accounts[1]});
    assert.equal(result.logs[0].event, 'Mint');
    assert.equal(result.logs[0].args.to.valueOf(), accounts[2]);
    assert.equal(result.logs[0].args.amount.valueOf(), 100);

    const balance0 = await token.balanceOf(accounts[2]);
    assert(balance0, 100);

    const totalSupply = await token.totalSupply();
    assert(totalSupply, 100);
  });

  it('should fail to mint after call to finishMinting', async function () {
    await token.finishMinting({from: accounts[1]}).should.be.fulfilled;
    const mintingFinished = await token.mintingFinished({from: accounts[1]});
    assert.equal(mintingFinished, true);
    await expectThrow(token.mint(accounts[2], 100, {from: accounts[1]}));
  });
}
