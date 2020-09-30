const pathLink = require('path').resolve('.')
const $$  = require(pathLink + '/server/public/methods/tools.js')
const logger = require(pathLink + '/server/public/methods/log4js.js').getLogger('assets')
const async = require('async')
const web3 = require(pathLink + '/server/public/web3/index.js')

const express = require('express'); //1
const router = express(); //2

const coininfo = require(pathLink + '/config/coininfo/index.json')

function formatID (chainID, id) {
  chainID = Number(chainID)
  let label = '0'
  switch (chainID) {
    case 56:
      label = '2'
      break
    case 32659:
      label = '1'
      break
  }
  return label + web3.utils.padLeft(id, 4)
}

let assetsList = {}

function initAssets () {
  let arr = []
  let repeatArr = []
  for (let chainID in coininfo) {
    let coinList = coininfo[chainID]
    for (let obj in coinList) {
      let pair = $$.formatPairs(obj)
      if (!repeatArr.includes(pair)) {
        repeatArr.push(pair)
        arr.push({
          "name": coinList[obj].name.toLowerCase(),
          "unified_cryptoasset_id": formatID(chainID, coinList[obj].id),
          "can_withdraw": coinList[obj].isWithdraw ? true : false,
          "can_deposit": coinList[obj].isDeposit ? true : false,
          "min_withdraw": coinList[obj].minWithdraw.toString(),
          "max_withdraw": coinList[obj].maxWithdraw.toString(),
          "maker_fee": coinList[obj].sell.toString(),
          "taker_fee": coinList[obj].buy.toString(),
          "pair": pair
        })
      }
    }
  }
  arr = arr.sort($$.smallToBigSort('unified_cryptoasset_id'))
  console.log(arr)
  for (let obj of arr) {
    let pair = obj.pair
    obj.pair = undefined
    assetsList[pair] = obj
  }
}
initAssets()

router.get('/assets', (request, response) => {
  
  response.send(assetsList)
})

module.exports = router