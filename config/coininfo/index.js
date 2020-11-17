const pathLink = require("path").resolve(".")
const FSN = require(pathLink + '/config/coininfo/fusion')
const BSC = require(pathLink + '/config/coininfo/binance')
const FTM = require(pathLink + '/config/coininfo/fantom')

module.exports = {
  "32659": {
    ...FSN
  },
  "56": {
    ...BSC
  },
  "250": {
    ...FTM
  }
}