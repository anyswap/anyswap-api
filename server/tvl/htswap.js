const pathLink = require('path').resolve('.')
const $$  = require(pathLink + '/server/public/methods/tools.js')
const web3 = require(pathLink + '/server/public/web3/index.js')
const ethers = require('ethers')
const express = require('express'); //1
const router = express(); //2

const ERC20ABI = require(pathLink + '/config/ABI/erc20.json')
const EXCHANGE_ABI = require(pathLink + '/config/ABI/exchange.json')
const HTRPC = 'https://http-mainnet.hecochain.com'

const HTCFARMTOKEN = "0x6c7985295981c29ff3bf1d09576317eda1cdaec6"
const HTCTokenList = {
  "0xae9b79172b6cd61f1e312b0bf05399f643111900": {
    "symbol": "HTC",
    "name": "HTCToken",
    "decimals": 18,
    "token": "0x734922e7b793b408cd434eedaa407c9c0c575d1e"
  },
  "0x58ded31f93669eac7b18d4d19b0d122fa5e9263d": {
    "symbol": "ANY",
    "name": "Anyswap",
    "decimals": 18,
    "token": "0x538cee985e930557d16c383783ca957fa90b63b3"
  },
  "0x14044302cc082bba6703a30a8eae4062fcf76955": {
    "symbol": "HBTC",
    "name": "Heco-Peg HBTC",
    "decimals": 18,
    "token": "0x66a79d23e58475d2738179ca52cd0b41d73f0bea"
  },
  "0x7b7b9fba56cd7c22d278488985e5713c80a0edfc": {
    "symbol": "HETH",
    "name": "Heco-Peg ETH",
    "decimals": 18,
    "token": "0x64ff637fb478863b7468bc97d30a5bf3a428a1fd"
  },
  "0xe1eacc72830ae81668457bb2b3bd214dab9e3d0f": {
    "symbol": "HUSD",
    "name": "Heco-Peg HUSD",
    "decimals": 8,
    "token": "0x0298c2b32eae4da002a15f36fdf7615bea3da047"
  },
  "0xfefacbe5e6f6438c6a5aa0ec9c0d09be1b130574": {
    "symbol": "HLTC",
    "name": "Heco-Peg HLTC",
    "decimals": 18,
    "token": "0xecb56cf772b5c9a6907fb7d32387da2fcbfb63b4"
  },
  "0x671f6349901a3eff3e7baa757a397647230ad221": {
    "symbol": "HFIL",
    "name": "Heco-Peg HFIL",
    "decimals": 18,
    "token": "0xae3a768f9ab104c69a7cd6041fe16ffa235d1810"
  },
  "0x3ffb3098e978429b27443f22da177f96cae65412": {
    "symbol": "HBCH",
    "name": "Heco-Peg HBCH",
    "decimals": 18,
    "token": "0xef3cebd77e0c52cb6f60875d9306397b5caca375"
  },
  "0x4e7a4f2720115051717706f548ee64c5f0a7a5b3": {
    "symbol": "HDOT",
    "name": "Heco-Peg HDOT",
    "decimals": 18,
    "token": "0xa2c49cee16a5e5bdefde931107dc1fae9f7773e3"
  },
  "0xbf6ef20abba64bdd662ec0f5ac9d9bae6dd325c0": {
    "symbol": "HBSV",
    "name": "Heco-Peg HBSV",
    "decimals": 18,
    "token": "0xc2cb6b5357ccce1b99cd22232942d9a225ea4eb1"
  },
  "0xc4a5f66bab71a42a72b0394d25eb1629d5917646": {
    "symbol": "HXTZ",
    "name": "Heco-Peg HXTZ",
    "decimals": 18,
    "token": "0x45e97dad828ad735af1df0473fc2735f0fd5330c"
  },
}

const SDCFARMTOKEN = "0xde0fda530c441265d65e47bee9ee96d04414c1ca"
const SDCTokenList = {
  "0x39bb62da68fc7f9c1271baba01f5eb636379fa12": {
    "symbol": "SDC",
    "name": "StableCoin",
    "decimals": 18,
    "token": "0xe2f45b8fbcb2b5bb544fe9f796bcfeaa3a4dcdbf"
  },
  "0xae9b79172b6cd61f1e312b0bf05399f643111900": {
    "symbol": "HTC",
    "name": "HTCToken",
    "decimals": 18,
    "token": "0x734922e7b793b408cd434eedaa407c9c0c575d1e"
  },
  "0xe1eacc72830ae81668457bb2b3bd214dab9e3d0f": {
    "symbol": "HUSD",
    "name": "Heco-Peg HUSD",
    "decimals": 8,
    "token": "0x0298c2b32eae4da002a15f36fdf7615bea3da047"
  },
  "0x0298c2b32eae4da002a15f36fdf7615bea3da047": {
    "symbol": "HUSD",
    "name": "Heco-Peg HUSD",
    "decimals": 8,
    "token": "0xe1eacc72830ae81668457bb2b3bd214dab9e3d0f"
  },
  "0x66a79d23e58475d2738179ca52cd0b41d73f0bea": {
    "symbol": "HBTC",
    "name": "Heco-Peg HBTC",
    "decimals": 18,
    "token": "0x14044302cc082bba6703a30a8eae4062fcf76955"
  },
  "0x64ff637fb478863b7468bc97d30a5bf3a428a1fd": {
    "symbol": "HETH",
    "name": "Heco-Peg ETH",
    "decimals": 18,
    "token": "0x7b7b9fba56cd7c22d278488985e5713c80a0edfc"
  },
}

const baseUSDToken = '0xe1eacc72830ae81668457bb2b3bd214dab9e3d0f'
const aloneToken = [
  "0x0298c2b32eae4da002a15f36fdf7615bea3da047",
  "0x66a79d23e58475d2738179ca52cd0b41d73f0bea",
  "0x64ff637fb478863b7468bc97d30a5bf3a428a1fd",
]



let contract = new web3.eth.Contract(ERC20ABI)
const exchangeContract = new web3.eth.Contract(EXCHANGE_ABI)

function getExchangeRate(inputValue, inputDecimals, outputValue, outputDecimals, invert = false) {
  try {
    if (
      inputValue &&
      (inputDecimals || inputDecimals === 0) &&
      outputValue &&
      (outputDecimals || outputDecimals === 0)
    ) {
      const factor = ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(18))

      if (invert) {
        return inputValue
          .mul(factor)
          .mul(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(outputDecimals)))
          .div(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(inputDecimals)))
          .div(outputValue)
      } else {
        return outputValue
          .mul(factor)
          .mul(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(inputDecimals)))
          .div(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(outputDecimals)))
          .div(inputValue)
      }
    }
  } catch {}
}

function getMarketRate(reserveETH, reserveToken, decimals, invert = false) {
  return getExchangeRate(reserveETH, 18, reserveToken, decimals, invert)
}

function getTvlNum (tokenList, aloneTokenList) {
  let totalHt = ethers.constants.Zero, baseUED = ''
  
  for (let lpToken in tokenList) {
    let obj = tokenList[lpToken]
    let exchangeETHBalance = obj.exchangeETHBalance ? ethers.utils.bigNumberify(obj.exchangeETHBalance) : ''
    let exchangeTokenBalancem = obj.exchangeTokenBalancem ? ethers.utils.bigNumberify(obj.exchangeTokenBalancem) : ''
    let lpBalance = obj.lpBalance ? ethers.utils.bigNumberify(obj.lpBalance) : ''
    if (
      exchangeETHBalance
      && exchangeETHBalance.gt(ethers.constants.Zero)
      && exchangeTokenBalancem
      && exchangeTokenBalancem.gt(ethers.constants.Zero)
      && lpBalance
      && lpBalance.gt(ethers.constants.Zero)
    ) {
      let baseAmount = lpBalance.mul(exchangeETHBalance).mul(ethers.utils.bigNumberify(2)).div(obj.totalSupply)
      if (aloneTokenList && aloneTokenList.includes(lpToken)) {
        let mk = getMarketRate(exchangeETHBalance, exchangeTokenBalancem, 18)
        baseAmount = lpBalance.div(mk).mul(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(18)))
      }
      totalHt = totalHt.add(baseAmount)
    }
    if (baseUSDToken === lpToken) {
      baseUED = getMarketRate(exchangeETHBalance, exchangeTokenBalancem, obj.decimals)
    }
  }
  totalHt = totalHt.mul(baseUED).div(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(18)))
  return $$.fromWei(totalHt.toString(),18,2)
}

function getTokenInfo (tokenList, FARMTOKEN, isHavingAlone, aloneTokenList) {
  return new Promise(resolve => {
    web3.setProvider(HTRPC)
    const batch = new web3.BatchRequest()

    let tokenArr = []
    for (let lpToken in tokenList) {
      tokenArr.push({
        ...tokenList[lpToken],
        lpToken: lpToken
      })
    }

    for (let i = 0, len = tokenArr.length; i < len; i++) {
      let obj = tokenArr[i]
      let lpToken = obj.lpToken
      let exchange = '', token = ''
      if (isHavingAlone && aloneTokenList && aloneTokenList.includes(lpToken)) {
        exchange = obj.token
        token = lpToken
      } else {
        exchange = lpToken
        token = obj.token
      }
      contract.options.address = token
      // exchangeTokenBalancem
      let etbData = contract.methods.balanceOf(exchange).encodeABI()
      batch.add(web3.eth.call.request({data: etbData, to: token, from: exchange}, (err, res) => {
        if (!err) {
          tokenList[lpToken].exchangeTokenBalancem = $$.formatWeb3Str(res)[0]
        } else {
          tokenList[lpToken].exchangeTokenBalancem = ''
        }
        if (i === (tokenArr.length - 1)) {
          let totalUSD = getTvlNum(tokenList, aloneTokenList)
          resolve(totalUSD)
        }
      }))
      // exchangeETHBalance 
      batch.add(web3.eth.getBalance.request(exchange, 'latest', (err, res) => {
        if (!err) {
          tokenList[lpToken].exchangeETHBalance = res
        } else {
          tokenList[lpToken].exchangeETHBalance = ''
        }
      }))
  
      contract.options.address = lpToken
      const blData = contract.methods.balanceOf(FARMTOKEN).encodeABI()
      batch.add(web3.eth.call.request({data: blData, to: lpToken}, 'latest', (err, res) => {
        if (!err) {
          tokenList[lpToken].lpBalance = $$.formatWeb3Str(res)[0]
        } else {
          tokenList[lpToken].lpBalance = ''
        }
      }))

      exchangeContract.options.address = lpToken
      const tsData = exchangeContract.methods.totalSupply().encodeABI()
      batch.add(web3.eth.call.request({data: tsData, to: lpToken}, 'latest', (err, ts) => {
        if (!err) {
          tokenList[lpToken].totalSupply = $$.formatWeb3Str(ts)[0]
        } else {
          tokenList[lpToken].totalSupply = ''
        }
      }))
    }
    batch.execute()
  })
}

function getTvl () {
  Promise.all([
    getTokenInfo(HTCTokenList, HTCFARMTOKEN),
    getTokenInfo(SDCTokenList, SDCFARMTOKEN, true, aloneToken),
  ]).then(res => {
    console.log(res)
    let totalUSD = 0
    for (let poolUSD of res) {
      totalUSD += Number(poolUSD)
    }
    console.log(totalUSD)
  })
}
getTvl()