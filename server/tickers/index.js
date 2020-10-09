const pathLink = require('path').resolve('.')
const config = require(pathLink + '/config')
const logger = require(pathLink + '/server/public/methods/log4js.js').getLogger('tickers')
const $$  = require(pathLink + '/server/public/methods/tools.js')
const async = require('async')

const express = require('express'); //1
const router = express(); //2

const NODE = require(pathLink + '/config/node.json')

const {TxnsCharts} = require(pathLink + '/server/public/db/summaryDB')

let tickersObj ={}

function getTickers () {
  const NOW_TIME = Date.now()
  const query24h = {timestamp: {$gte: ((NOW_TIME / 1000) - (60 * 60 * 24))}}
  let arr = []
  let tradeObj = {}
  for (let chainID in NODE) {
    arr.push({
      chainID: chainID
    })
    tradeObj[chainID] = {}
  }
  async.eachSeries(arr, (item, cb) => {
    let query = {
      ...query24h,
      chainID: Number(item.chainID)
    }
    // console.log(query)
    TxnsCharts.aggregate([
      {$match: query},
      {$sort: {'timestamp': 1, index: 1} },
      {$group: {
        _id: '$pairs',
        last_price: {$last: '$market'},
        target_volume: {$sum: '$fv'},
        base_volume: {$sum: '$tv'},
        high: {$max: '$market'},
        low: {$min: '$market'},
        open: {$first: '$market'},
      }},
      {$sort: {'timestamp': 1} },
    ]).exec((err, res) => {
      if (err) {
        logger.error(err)
      } else {
        for (let obj of res) {
          let base = $$.chainIDToName(item.chainID)
          let pair = $$.formatPairs(obj._id)
          let lastPrice = $$.formatNumTodec(obj.last_price)
          
          let base_volume = Number(obj.base_volume) <= 1 ? 1 : obj.base_volume.toFixed(0)
          let token_volume = Number(obj.target_volume) <= 1 ? 1 : obj.target_volume.toFixed(0)
          let obj1 = {
            ticker_id: pair + '_' + base,
            base_currency: pair,
            target_currency: base,
            last_price: lastPrice,
            base_volume: base_volume,
            target_volume: token_volume,
            bid: lastPrice,
            ask: lastPrice,
            high: $$.formatNumTodec(obj.high),
            low: $$.formatNumTodec(obj.low),
            open: $$.formatNumTodec(obj.open),
            close: lastPrice,
          }
          if (pair.indexOf('USDT') !== -1) {
            lastPrice = $$.formatNumTodec(1 / obj.last_price)
            obj1 = {
              ticker_id: base + '_' + pair,
              base_currency: base,
              target_currency: pair,
              last_price: lastPrice,
              base_volume: token_volume,
              target_volume: base_volume,
              bid: lastPrice,
              ask: lastPrice,
              high: $$.formatNumTodec(1 / obj.low),
              low: $$.formatNumTodec(1 / obj.high),
              open: $$.formatNumTodec(1 / obj.open),
              close: lastPrice,
            }
          }
          // tickersObj[obj1.ticker_id] = obj1
          tradeObj[item.chainID][obj1.ticker_id] = obj1
        }
      }
      cb(null, '')
    })
  }, () => {
    // console.log(tradeObj)
    tickersObj = tradeObj
    setTimeout(() => {
      getTickers()
    }, 1000 * 10)
  })
  
}

getTickers()

router.get('/Summary', (request, response) => {
  let data = []
  for (let obj in tickersObj) {
    // arr.push(tickersObj[obj])
    // let obj1 = tickersObj[obj]
    let pairObj = tickersObj[obj]
    for (let obj2 in pairObj) {
      let obj1 = pairObj[obj2]
      let change = 0
      if (obj1.open && obj1.close) {
        change = ((obj1.close - obj1.open) / obj1.open) * 100
      }
      data.push({
        "trading_pairs": obj1.ticker_id,
        "last_price": obj1.last_price,
        "lowest_ask": obj1.last_price,
        "highest_bid": obj1.last_price,
        "base_volume": obj1.base_volume,
        "quote_volume": obj1.target_volume,
        "price_change_percent_24h": change,
        "highest_price_24h": obj1.high,
        "lowest_price_24h": obj1.low,
      })
    }
  }
  response.send(data)
})

router.get('/ticker', (request, response) => {
  let params = request.query
  if (params.ticker_id && params.ticker_id.indexOf('_') === -1) {
    response.send({
      error: 'Params is error!'
    })
    return
  }
  if (!params.ticker_id) {
    let pairsObj = {}
    for (let obj in tickersObj) {
      // arr.push(tickersObj[obj])
      let pairObj = tickersObj[obj]
      for (let obj2 in pairObj) {
        let obj1 = pairObj[obj2]
        pairsObj[obj2] = {
          base_id: obj1.target_currency,
          quote_id: obj1.ticker_id,
          last_price: obj1.last_price,
          base_volume: obj1.base_volume,
          quote_volume: obj1.target_volume,
          isFrozen: 0
        }
      }
    }
    response.send(pairsObj)
  } else {
    let pairObj = $$.getPair(params.market_pair)
    let pairs = pairObj.pair
    let chainID = $$.nameToChainID(pairObj.base)
    if (params.ticker_id && tickersObj[chainID][params.ticker_id] && tickersObj[chainID][params.ticker_id]) {
      let obj1 = tickersObj[chainID][params.ticker_id]
      let pairsObj = {
        base_id: obj1.target_currency,
        quote_id: obj1.ticker_id,
        last_price: obj1.last_price,
        base_volume: obj1.base_volume,
        quote_volume: obj1.target_volume,
        isFrozen: 1
      }
      response.send(pairsObj)
    } else {
      response.send({})
    }
  }
})

router.get('/api/tickers', (request, response) => {
  let params = request.query
  if (params.ticker_id && params.ticker_id.indexOf('_') === -1) {
    response.send({
      error: 'Params is error!'
    })
    return
  }
  if (!params.ticker_id) {
    let arr = []
    for (let obj in tickersObj) {
      // let obj1 = tickersObj[obj]
      let pairObj = tickersObj[obj]
      for (let obj2 in pairObj) {
        let obj1 = pairObj[obj2]
        arr.push({
          ticker_id: obj1.ticker_id,
          base_currency: obj1.base_currency + '',
          target_currency: obj1.target_currency + '',
          last_price: obj1.last_price + '',
          base_volume: obj1.base_volume + '',
          target_volume: obj1.target_volume + '',
          bid: obj1.bid + '',
          ask: obj1.ask + '',
          high: obj1.high + '',
          low: obj1.low + '',
        })
      }
    }
    response.send(arr)
  } else {
    let pairObj = $$.getPair(params.market_pair)
    let pairs = pairObj.pair
    let chainID = $$.nameToChainID(pairObj.base)
    if (params.ticker_id && tickersObj[chainID] && tickersObj[chainID][params.ticker_id]) {
      let obj1 = tickersObj[chainID][params.ticker_id]
      let pairsObj = {
        ticker_id: obj1.ticker_id,
        base_currency: obj1.base_currency,
        target_currency: obj1.target_currency,
        last_price: obj1.last_price + '',
        base_volume: obj1.base_volume + '',
        target_volume: obj1.target_volume + '',
        bid: obj1.bid + '',
        ask: obj1.ask + '',
        high: obj1.high + '',
        low: obj1.low + '',
      }
      response.send(pairsObj)
    } else {
      response.send({})
    }
  }
})

module.exports = router