const pathLink = require('path').resolve('.')
require(pathLink + '/server/public/db')
const config = require(pathLink + '/config')
const logger = require(pathLink + '/server/public/methods/log4js.js').getLogger('tickers')
const $$  = require(pathLink + '/server/public/methods/tools.js')
const mongoose = require('mongoose')
const async = require('async')

const express = require('express'); //1
const router = express(); //2

const TxnsCharts = mongoose.model('TxnsCharts')

let tickersObj ={}

function getTickers () {
  const NOW_TIME = Date.now()
  const query24h = {timestamp: {$gte: ((NOW_TIME / 1000) - (60 * 60 * 24))}}
  TxnsCharts.aggregate([
    {$match: {
      ...query24h,
    }},
    {$sort: {'timestamp': 1, index: 1} },
    {$group: {
      _id: '$pairs',
      last_price: {$last: '$market'},
      target_volume: {$sum: '$fv'},
      base_volume: {$sum: '$tv'},
      // bid: {$last: '$market'},
      // ask: {$last: '$market'},
      high: {$max: '$market'},
      low: {$min: '$market'},
      open: {$first: '$market'},
      // close: {$last: '$market'},
    }},
    {$sort: {'timestamp': 1} },
  ]).exec((err, res) => {
    if (err) {
      logger.error(err)
    } else {
      for (let obj of res) {
        let obj1 = {
          ticker_id: obj._id + '_FSN',
          base_currency: obj._id,
          target_currency: 'FSN',
          last_price: obj.last_price,
          base_volume: obj.base_volume,
          target_volume: obj.target_volume,
          bid: obj.last_price,
          ask: obj.last_price,
          high: obj.high,
          low: obj.low,
          open: obj.open,
          close: obj.last_price,
        }
        if (obj._id.indexOf('USDT') !== -1) {
          obj1 = {
            ticker_id: 'FSN_' + obj._id,
            base_currency: 'FSN',
            target_currency: obj._id,
            last_price: 1 / obj.last_price,
            base_volume: obj.target_volume,
            target_volume: obj.base_volume,
            bid: 1 / obj.last_price,
            ask: 1 / obj.last_price,
            high: 1 / obj.low,
            low: 1 / obj.high,
            open: 1 / obj.open,
            close: 1 / obj.last_price,
          }
        }
        tickersObj[obj1.ticker_id] = obj1
      }
    }
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
    let obj1 = tickersObj[obj]
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
  if (params.ticker_id && tickersObj[params.ticker_id]) {
    let obj1 = tickersObj[params.ticker_id]
    let pairsObj = {
      base_id: obj1.target_currency,
      quote_id: obj1.ticker_id,
      last_price: obj1.last_price,
      base_volume: obj1.base_volume,
      quote_volume: obj1.target_volume,
      isFrozen: 1
    }
    response.send(pairsObj)
  } else if (params.ticker_id && !tickersObj[params.ticker_id]) {
    response.send({})
  } else {
    let pairsObj = {}
    for (let obj in tickersObj) {
      // arr.push(tickersObj[obj])
      let obj1 = tickersObj[obj]
      pairsObj[obj] = {
        base_id: obj1.target_currency,
        quote_id: obj1.ticker_id,
        last_price: obj1.last_price,
        base_volume: obj1.base_volume,
        quote_volume: obj1.target_volume,
        isFrozen: 0
      }
    }
    response.send(pairsObj)
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
  if (params.ticker_id && tickersObj[params.ticker_id]) {
    let obj1 = tickersObj[params.ticker_id]
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
  } else if (params.ticker_id && !tickersObj[params.ticker_id]) {
    response.send({})
  } else {
    let arr = []
    for (let obj in tickersObj) {
      let obj1 = tickersObj[obj]
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
    response.send(arr)
  }
})

module.exports = router