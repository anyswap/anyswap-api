const ethers = require('ethers')
// console.log(ethers)
function fromTime (timestamp) {
  if (timestamp.toString().length >=10 && timestamp.toString().length < 13) {
    timestamp = Number(timestamp) * 1000
  } else if (timestamp.toString().length > 13) {
    timestamp = timestamp.toString().substring(0, 13)
  }
  return Number(timestamp)
}

function toTime (timestamp) {
  // console.log(timestamp.toString().length)
  if (timestamp.toString().length >= 13) {
    timestamp = timestamp.toString().substring(0, 10)
  }
  return Number(timestamp)
}

function smallToBigSort() {
  return (a, b) => {
    for (let obj in arguments) {
      if (Number(a[arguments[obj]]) > Number(b[arguments[obj]])) {
        obj = undefined
        return 1
      }
      obj = undefined
    }
    return -1
  }
}

function bigToSmallSort() {
  return (a, b) => {
    for (let obj in arguments) {
      if (Number(a[arguments[obj]]) > Number(b[arguments[obj]])) {
        obj = undefined
        return -1
      }
      obj = undefined
    }
    return 1
  }
}

function timeChange (data) {
  // let time = data.date ? new Date(data.date.toString().length > 10 ? data.date : (Number(data.date) * 1000)) : new Date()
  let time = data.date ? new Date(fromTime(data.date)) : new Date()
  let formatType = data.format ? data.format : '/'
  let Y = time.getFullYear()
  let M = (time.getMonth() + 1) < 10 ? ('0' + (time.getMonth() + 1)) : (time.getMonth() + 1)
  let D = time.getDate() < 10 ? ('0' + time.getDate()) : time.getDate()
  let h = time.getHours() < 10 ? ('0' + time.getHours()) : time.getHours()
  let m = time.getMinutes() < 10 ? ('0' + time.getMinutes()) : time.getMinutes()
  let s = time.getSeconds() < 10 ? ('0' + time.getSeconds()) : time.getSeconds()
  // console.log(Date.parse(data.date))
  // console.log(new Date(Date.parse(data.date)).getDate())
  if (data.type === 'yyyy-mm-dd') {
    time = Y + formatType + M + formatType + D
  } else if (data.type === 'yyyy-mm-dd hh:mm') {
    time = Y + formatType + M + formatType + D + ' ' + h + ':' + m
  } else if (data.type === 'yyyy-mm-dd hh:mm:ss') {
    time = Y + formatType + M + formatType + D + ' ' + h + ':' + m + ':' + s
  } else if (data.type === 'yyyy-mm-dd hh') {
    time = Y + formatType + M + formatType + D + ' ' + h
  } else if (data.type === 'yyyy-mm') {
    time = Y + formatType + M
  } else if (data.type === 'yyyy') {
    time = Y
  }
  formatType = Y = M = D = h = m = undefined
  return time
}

function fromWei (amount, baseDecimals = 18, displayDecimals = 18, useLessThan = true) {
  // console.log(amount)
  if (amount === '-') return '0'
  if (!amount || isNaN(amount)) return '0'
  amount = ethers.utils.bigNumberify(amount)
  displayDecimals = Math.min(displayDecimals, baseDecimals)
  if (baseDecimals > 18 || displayDecimals > 18 || displayDecimals > baseDecimals) {
    throw Error(`Invalid combination of baseDecimals '${baseDecimals}' and displayDecimals '${displayDecimals}.`)
  }

  // if balance is falsy, return undefined
  if (!amount) {
    return undefined
  }
  // if amount is 0, return
  else if (amount.isZero()) {
    return '0'
  }

  else {
    // amount of 'wei' in 1 'ether'
    const baseAmount = ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(baseDecimals))

    const minimumDisplayAmount = baseAmount.div(
      ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(displayDecimals))
    )

    // if balance is less than the minimum display amount
    if (amount.lt(minimumDisplayAmount)) {
      return useLessThan
        ? `<${ethers.utils.formatUnits(minimumDisplayAmount, baseDecimals)}`
        : `${ethers.utils.formatUnits(amount, baseDecimals)}`
    }
    // if the balance is greater than the minimum display amount
    else {
      const stringAmount = ethers.utils.formatUnits(amount, baseDecimals)

      // if there isn't a decimal portion
      if (!stringAmount.match(/\./)) {
        return stringAmount
      }
      // if there is a decimal portion
      else {
        const [wholeComponent, decimalComponent] = stringAmount.split('.')
        const roundedDecimalComponent = ethers.utils
          .bigNumberify(decimalComponent.padEnd(baseDecimals, '0'))
          .toString()
          .padStart(baseDecimals, '0')
          .substring(0, displayDecimals)

        // decimals are too small to show
        if (roundedDecimalComponent === '0'.repeat(displayDecimals)) {
          return wholeComponent
        }
        // decimals are not too small to show
        else {
          return `${wholeComponent}.${roundedDecimalComponent.toString().replace(/0*$/, '')}`
        }
      }
    }
  }
}

function compare (x, y) {
  if (x < y) {
    return 1
  } else if (x > y) {
    return -1
  } else {
    return 0
  }
}
function compareReverse (y, x) {
  if (x < y) {
    return 1
  } else if (x > y) {
    return -1
  } else {
    return 0
  }
}

function chainIDToName (chainID) {
  switch (Number(chainID)) {
    case 56:
      return 'BNB'
    case 32659:
      return 'FSN'
    default:
      return 'FSN'
  }
}

function nameToChainID (name) {
  switch (name) {
    case 'BNB':
      return 56
    case 'FSN':
      return 32659
    default:
      return 32659
  }
}

function getPair (trade) {
  let obj = {}
  trade = formatPairs(trade)
  if (trade.indexOf('USDT') !== -1) {
    obj = {
      pair: trade.split('_')[1],
      base: trade.split('_')[0],
    }
  } else {
    obj = {
      pair: trade.split('_')[0],
      base: trade.split('_')[1],
    }
  }
  return obj
}

function formatPairs (pair) {
  return pair.replace('a', '').replace('-BEP20', '').replace('-bep20', '')
}

function formatDecimal (num, decimal) {
  num = num.toString()
  let index = num.indexOf('.')
  if (index !== -1) {
      num = num.substring(0, decimal + index + 1)
  } else {
      num = num.substring(0)
  }
  return parseFloat(num).toFixed(decimal)
}

function formatNumTodec (num) {
  num = Number(num)
  if (num >= 1) {
    return formatDecimal(num, 2)
  } else {
    return formatDecimal(num, 6)
  }
}

// global.test = '测试'
module.exports = {
  fromTime,
  toTime,
  smallToBigSort,
  bigToSmallSort,
  timeChange,
  fromWei,
  compare,
  compareReverse,
  chainIDToName,
  nameToChainID,
  getPair,
  formatPairs,
  formatDecimal,
  formatNumTodec
}