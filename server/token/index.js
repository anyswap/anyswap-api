const pathLink = require('path').resolve('.')
const config = require(pathLink + '/config')
const coinInfo = require(pathLink + '/config/coinInfo.js')
const logger = require(pathLink + '/server/public/methods/log4js.js').getLogger('tickers')
const $$  = require(pathLink + '/server/public/methods/tools.js')
const async = require('async')

const express = require('express'); //1
const router = express(); //2

// const { deflate, unzip } = require('zlib')

router.get('/token', (request, response) => {
  let params = request.query
  if (params.chainId && coinInfo[params.chainId]) {
    response.send(coinInfo[params.chainId])
  } else if (params.chainId && !coinInfo[params.chainId]) {
    response.send({})
  } else {
    response.send(coinInfo)
  }
  // console.log(response)
  // deflate(JSON.stringify(coinInfo), (err, buffer) => {
  //   if (err) {
  //     console.error('An error occurred:', err);
  //     process.exitCode = 1;
  //   }
  //   // console.log(buffer);
  //   // console.log(buffer.length);
  //   // console.log(buffer.toString('base64').length);
  //   // console.log(JSON.stringify(coinInfo).length);
  //   response.render(buffer)
  //   unzip(buffer, (err, data) => {
  //     console.log(err)
  //     console.log(data)
  //   })
  // })
})

module.exports = router