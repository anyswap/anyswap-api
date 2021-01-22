const pathLink = require("path").resolve(".")
const FSN = require(pathLink + '/config/coininfo/fusion')
const BSC = require(pathLink + '/config/coininfo/binance')
const FTM = require(pathLink + '/config/coininfo/fantom')
const ETH = require(pathLink + '/config/coininfo/ethereum')
const HT = require(pathLink + '/config/coininfo/huobi')

module.exports = {
  "32659": {
    ...FSN
  },
  "56": {
    ...BSC
  },
  "250": {
    ...FTM
  },
  "1": {
    ...ETH
  },
  "128": {
    ...HT
  }
}