const pathLink = require('path').resolve('.')

const express = require('express'); //1
const router = express(); //2

const {TradeInfos} = require(pathLink + '/server/public/db/summaryDB')
// const { deflate, unzip } = require('zlib')

let tokenList = {}

function getAllToken () {
  TradeInfos.find({}, {token: 1, exchange: 1, decimals: 1, name: 1,symbol: 1, chainID: 1}).sort({timestamp: -1}).exec((err, res) => {
    if (!err && res.length > 0) {
      for (let obj of res) {
        if (!tokenList[obj.chainID]) {
          tokenList[obj.chainID] = {}
        }
        tokenList[obj.chainID][obj.symbol] = {
          "token": obj.token,
          "exchange": obj.exchange,
          "decimals": obj.decimals,
          "name": obj.name,
          // "chainID": obj.token,
          // "symbol": obj.token,
        }
      }
    }
    setTimeout(() => {
      getAllToken()
    }, 1000 * 60 * 10)
  })
}
getAllToken()

router.get('/tokens', (request, response) => {
  response.send(tokenList)
})

module.exports = router