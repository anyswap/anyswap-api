const pathLink = require('path').resolve('.')
const logger = require(pathLink + '/server/public/methods/log4js.js').getLogger('orderbook')
const $$  = require(pathLink + '/server/public/methods/tools.js')
const ethers = require('ethers')
const async = require('async')
const express = require('express'); //1
const router = express(); //2
const web3 = require(pathLink + '/server/public/web3/index.js')
const ERC20 = require(pathLink + '/server/public/ABI/erc20.json')

const ANY_TOKEN = '0x0c74199d22f732039e843366a236ff4f61986b32'

const ADDRESS = [
  '0x3f7a5b59ebada1ba45319ee2d6e8aaaab7dc1862',
  '0x71c56b08f562f53d0fb617a23f94ab2c9f8e4703',
  '0xe29972f7a35d89e9ee40f36983021d96340c4863',
  '0xa96a3a188da5b1f958e75c169a4a5e22b63f3273',
  '0x2175546b3121e15ff270d974259644f865c670c3',
  '0xf2834163568277d4d3aa93cf15e54700c91ca312'
]

let supply = '0',
    totalSupply = ethers.utils.bigNumberify(0)

function getSupply () {
  let contract = new web3.eth.Contract(ERC20, ANY_TOKEN)
  let anyNum = ethers.utils.bigNumberify(0)
  async.waterfall([
    (cb) => {
      contract.methods.totalSupply().call((err, res) => {
        if (err) {
          cb(err)
        } else {
          // console.log(res)
          totalSupply = ethers.utils.bigNumberify(res)
          cb(null, res)
        }
      })
    },
    (totalSupply, cb) => {
      async.eachSeries(ADDRESS, (address, callback) => {
        contract.methods.balanceOf(address).call({from: address}, (err, res) => {
          if (err) {
            callback(err)
          } else {
            // console.log(res)
            anyNum = anyNum.add(ethers.utils.bigNumberify(res))
            callback(null, res)
          }
        })
      }, (err, res) => {
        if (err) {
          cb(err)
        } else {
          cb(null, totalSupply)
        }
      })
    }, 
    (totalSupply, cb) => {
      supply = ethers.utils.bigNumberify(totalSupply).mod(anyNum)
      supply = $$.fromWei(supply,18,6)
      cb(null, supply)
    }
  ], (err, res) => {
    if (err) {
      setTimeout(() => {
        getSupply()
      }, 10000)
    } else {
      setTimeout(() => {
        getSupply()
      }, 1000 * 60 * 10)
    }
  })
}

getSupply()

router.get('/supply', (request, response) => {
  // console.log(supply)
  response.send({
    TotalSupply: $$.fromWei(totalSupply,18,6),
    CirculatingSupply: supply
  })
})

router.get('/Circulatingsupply', (request, response) => {
  // console.log(supply)
  response.send(supply)
})


router.get('/totalsupply', (request, response) => {
  // console.log(supply)
  response.send($$.fromWei(totalSupply,18,6))
})

module.exports = router