const PREFIX = 'a'

const USDT = PREFIX + 'USDT'
const BTC = PREFIX + 'BTC'
const ETH = PREFIX + 'ETH'
const XRP = PREFIX + 'XRP'
const LTC = PREFIX + 'LTC'
module.exports = {
  '32659': {
    ANY: {
      dec: 18,
      name: 'Anyswap',
      token: '0x0c74199D22f732039e843366a236Ff4F61986B32',
      exchange: '0x049ddc3cd20ac7a2f6c867680f7e21de70aca9c3',
      isSwitch: 1,
      isRedeem: 0,
      redeem_max_num: 1000000,
      redeem_min_num: 20,
      fee: 0.001,
      maxFee: 50,
      minFee: 1,
      deposit: '',
      isDeposit: 0,
      deposit_max_num: 100000,
      deposit_min_num: 0.5,
      coinInfoUrl: ''
    },
    [USDT]: {
      dec: 6,
      name: 'ANY Tether',
      token: '0xc7c64ac6d46be3d6ea318ec6276bb55291f8e496',
      exchange: '0x78917333bec47cee1022b31a136d31feff90d6fb',
      isSwitch: 1,
      isRedeem: 1,
      redeem_max_num: 1000000,
      redeem_min_num: 20,
      fee: 0.001,
      maxFee: 50,
      minFee: 1,
      deposit: '0x94e840798e333cB1974E086B58c10C374E966bc7',
      isDeposit: 1,
      deposit_max_num: 100000,
      deposit_min_num: 0.5,
      coinInfoUrl: 'https://usdtapi.anyswap.exchange/rpc'
    },
  },
  '46688': {
    ANY: {
      dec: 18,
      name: 'Anyswap',
      token: '0xC20b5E92E1ce63Af6FE537491f75C19016ea5fb4',
      exchange: '0x4dee5f0705ff478b452419375610155b5873ef5b',
      isSwitch: 1,
      isRedeem: 0,
      redeem_max_num: 1000000,
      redeem_min_num: 20,
      fee: 0.001,
      maxFee: 50,
      minFee: 1,
      deposit: '',
      isDeposit: 0,
      deposit_max_num: 100000,
      deposit_min_num: 0.5,
      coinInfoUrl: ''
    },
    [USDT]: {
      dec: 6,
      name: 'ANY Tether',
      token: '0x3368e6012066bc08ece5f2b2582c883cca1424e5',
      exchange: '0xe7fcfac393216739267f46b35b81e2e0fcea3448',
      isSwitch: 1,
      isRedeem: 1,
      redeem_max_num: 1000000,
      redeem_min_num: 20,
      fee: 0.001,
      maxFee: 50,
      minFee: 1,
      deposit: '0x06CAdD991f2EC8e156c0Ae66116C5604fdCdC5b5',
      isDeposit: 1,
      deposit_max_num: 100000,
      deposit_min_num: 0.5,
      coinInfoUrl: 'https://testusdtapi.anyswap.exchange/rpc'
    },
  }
}