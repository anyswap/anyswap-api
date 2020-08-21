const PREFIX = 'a'

const USDT = PREFIX + 'USDT'
const BTC = PREFIX + 'BTC'
const ETH = PREFIX + 'ETH'
const XRP = PREFIX + 'XRP'
const LTC = PREFIX + 'LTC'
module.exports = {
  ANY: {
    dec: 18,
    token: '0x0c74199D22f732039e843366a236Ff4F61986B32',
    exchange: '0x049ddc3cd20ac7a2f6c867680f7e21de70aca9c3'
  },
  [USDT]: {
    dec: 6,
    token: '0xc7c64ac6d46be3d6ea318ec6276bb55291f8e496',
    exchange: '0x78917333bec47cee1022b31a136d31feff90d6fb'
  },
}