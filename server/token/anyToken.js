const pathLink = require('path').resolve('.')
const config = require(pathLink + '/config')
const coinInfo = require(pathLink + '/config/coinInfo.js')
const logger = require(pathLink + '/server/public/methods/log4js.js').getLogger('tickers')
const $$  = require(pathLink + '/server/public/methods/tools.js')
const async = require('async')

const express = require('express'); //1
const router = express(); //2

router.get('/tokenList', (request, response) => {
  response.send(
    {
      "name": "Anyswap Default List",
      "timestamp": new Date(),
      "version": {
        "major": 1,
        "minor": 3,
        "patch": 1
      },
      "tags": {},
      "logoURI": "ipfs://QmNa8mQkrNKp1WEEeGjFezDmDeodkWRevGFN8JCV7b4Xir",
      "keywords": [
        "anyswap",
        "default"
      ],
      "tokens": [
        {
          "name": "WETH Token",
          "address": "0x84F2EEad1018229Eb4957cb8CdFCB130B0f15e74",
          "symbol": "WETH",
          "decimals": 18,
          "chainId": 4,
          "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB6eD7644C69416d67B522e20bC294A9a9B405B31/logo.png"
        },
        {
          "name": "MyETH Token",
          "address": "0xAD1DdfA07040cDeB360eEF7e3580294F9f7637a4",
          "symbol": "MyETH",
          "decimals": 18,
          "chainId": 4,
          "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB6eD7644C69416d67B522e20bC294A9a9B405B31/logo.png"
        },
        {
          "name": "MyBTC Token",
          "address": "0x3886B869d9c1f2057F615A936E353d32AB4767da",
          "symbol": "MyBTC",
          "decimals": 8,
          "chainId": 4,
          "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB6eD7644C69416d67B522e20bC294A9a9B405B31/logo.png"
        },
      ]
    })
})

module.exports = router