import additional from './token/additional';
import basic from './token/basic';
import mintable from './token/mintable';
import ownable from './token/ownable';
import standard from './token/standard';

const token = artifacts.require('GeseToken.sol');

contract('GeseToken - BasicToken test', function (accounts) {
  basic(token, accounts);
});
contract('GeseToken - StandardToken test', function (accounts) {
  standard(token, accounts);
});
contract('GeseToken - Mintable test', function (accounts) {
  mintable(token, accounts);
});
contract('GeseToken - Ownable test', function (accounts) {
  ownable(token, accounts);
});
contract('GeseToken - Additional conditions test', function (accounts) {
  additional(token, accounts);
});
