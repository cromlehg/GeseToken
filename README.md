![Gese Token](logo.png "Gese Token")

# Gese Token smart contract

* _Standard_        : [ERC20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md)
* _[Name](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md#name)_            : Gese 
* _[Ticker](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md#symbol)_          : GSE
* _[Decimals](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md#decimals)_        : 18
* _Emission_        : Mintable
* _Crowdsales_      : 2
* _Fiat dependency_ : No
* _Tokens locked_   : Yes

## Smart-contracts description

The tokens for the bounty and the team are minted after the ICO  is finished.  
There is a special function to return 3rd party tokens that were sent by mistake (function retrieveTokens()).  
Each stage has a direct minting function in wei. This is made to support the external payment gateways.

### Contracts contains
1. _GeseToken_ - Token contract
2. _PreITO_ - PreITO contract
3. _ITO_ - ITO contract
4. _Configurator_ - contract with main configuration for production
5. _TokenDistributor_ - airdrop support contract

### How to manage contract
To start working with contract you should follow next steps:
1. Compile it in Remix with enamble optimization flag and compiler 0.4.18
2. Deploy bytecode with MyEtherWallet. Gas 5100000 (actually 5073514).
3. Call 'deploy' function on addres from (3). Gas 4000000 (actually 3979551). 

Contract manager must call finishMinting after each crowdsale milestone!
To support external mint service manager should specify address by calling _setDirectMintAgent_. After that specified address can direct mint tokens by calling _mintTokensByETHExternal_ and _mintTokensExternal_.

### How to invest
To purchase tokens investor should send ETH (more than minimum 0.1 ETH) to corresponding crowdsale contract.
Recommended GAS: 250000, GAS PRICE - 21 Gwei.

### Wallets with ERC20 support
1. MyEtherWallet - https://www.myetherwallet.com/
2. Parity 
3. Mist/Ethereum wallet

EXODUS not support ERC20, but have way to export key into MyEtherWallet - http://support.exodus.io/article/128-how-do-i-receive-unsupported-erc20-tokens

Investor must not use other wallets, coinmarkets or stocks. Can lose money.

## Tokens distribution

* _Bounty tokens percent_       : 5%
* _Advisors_                    : 10%
* _Team tokens percent_         : 10%
* _Reserved tokens percent_     : 10%
* _For sale tokens percent_     : 65%

## AirDrop feature
* Contains airdrop support contracts

## Main network configuration

* _Bounty tokens wallet_        : 
* _Advisors tokens wallet_      : 
* _Team tokens wallet_          :
* _Reserved tokens wallet_      : 
* _Contracts manager_           :

### Links
1. _Token_ -
2. _PreICO_ -
3. _ICO_ -

### Features
* Manually mint tokens by owner or sale agent at any time until token minting finished. 
* Manually mint tokens in ether value by owner or sale agent at corresponding sale contract during current sale processing.  
* 5% referal system  

### Crowdsale stages

#### PreICO
* _Minimal insvested limit_     : 0.1 ETH
* _Base price_                  : 1 ETH = 7867 Tokens
* _Hardcap_                     : 3818 ETH
* _Softcap_                     : 3640 ETH
* _Period_                      : 15 days
* _Start_                       : 15 May 2018 00:00:00 GMT
* _Wallet_                      : 

#### ICO
* _Minimal insvested limit_     : 0.1 ETH
* _Base price_                  : 1 ETH = 5500 Tokens
* _Hardcap_                     : 49 090 ETH
* _Start_                       : 01 Jun 2018 00:00:00 GMT
* _Wallet_                      : 
 
##### Milestones
1. 5 days, bonus +33%
2. 5 days, bonus +18%
3. 5 days, bonus +11% 
4. 5 days, bonus +5% 
5. 10 without bonus 



