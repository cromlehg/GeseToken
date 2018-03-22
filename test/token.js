import additional from './token/additional';
import basic from './token/basic';
import mintable from './token/mintable';
import ownable from './token/ownable';
import standard from './token/standard';

const token = artifacts.require('BuyAndSellToken.sol');

contract('BuyAndSellToken - BasicToken test', function (accounts) {
  basic(token, accounts);
});
contract('BuyAndSellToken - StandardToken test', function (accounts) {
  standard(token, accounts);
});
contract('BuyAndSellToken - Mintable test', function (accounts) {
  mintable(token, accounts);
});
contract('BuyAndSellToken - Ownable test', function (accounts) {
  ownable(token, accounts);
});
contract('BuyAndSellToken - Additional conditions test', function (accounts) {
  additional(token, accounts);
});
