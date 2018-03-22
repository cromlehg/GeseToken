import assertRevert from '../helpers/assertRevert';

export default function (Token, accounts) {
  let token;

  beforeEach(async function () {
    token = await Token.new();
  });

  it('should have an owner', async function () {
    const owner = await token.owner();
    assert.isTrue(owner !== 0);
  });

  it('changes owner after transfer', async function () {
    const other = accounts[1];
    await token.transferOwnership(other);
    const owner = await token.owner();
    assert.isTrue(owner === other);
  });

  it('should prevent non-owners from transfering', async function () {
    const other = accounts[2];
    const owner = await token.owner();
    assert.isTrue(owner !== other);
    await assertRevert(token.transferOwnership(other, {from: other}));
  });

  it('should guard ownership against stuck state', async function () {
    const originalOwner = await token.owner();
    await assertRevert(token.transferOwnership(null, {from: originalOwner}));
  });
}
