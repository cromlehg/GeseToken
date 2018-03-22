require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    test: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gas: 0xfffffffffff,
      gasPrice: 0x01
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
