const data = {
  DEFI赛道: ['DYDX', 'GMX', 'RDNT', 'SSV', 'LRC'],
  AI赛道: ['WLD', 'ARKM', 'AGIX', 'FET', 'RNDR'],
  Web3: ['GAL', 'ENS', 'MASK', 'GRT', 'LPT', 'ANKR', 'API3'],
  L2公链: ['STRK', 'OP', 'ARB', 'METIS', 'LRC'],
  OP生态: ['SNX'],
  ARB生态: ['GMX', 'GNS', 'RDNT', 'MAGIC'],
  ZK系列: ['IMX', 'MINA', 'METIS', 'LRC'],
  底层公链: ['ETH', 'BNB', 'DOT'],
  链游: ['FLOW', 'IMX', 'MAGIC', 'GALA', 'YGG', 'GMT', 'bigtime'],
  元宇宙: ['SAND', 'MANA', 'APE', 'ALICE'],
  NFT赛道: ['BULR', 'APE', 'BEND'],
  社交赛道: ['RLY', 'CYBER', 'HOOK', 'ID'],
  RWA板块: ['CFG', 'POLYX', 'SNX'],
  隐私与匿名: ['ZEN', 'ZEC'],
  去中心化交易: ['DYDX', 'UNI', '1INCH', 'SUSHI'],
  新公链: ['APT', 'SEI', 'KAS'],
  POW板块: ['KAS', 'TAO', 'DNX'],
  比特币生态: [
    'BTCS',
    'STX',
    'RIF',
    'SPACE',
    'ORDI',
    'SATS',
    'RATS',
    'MUBI',
    'TURT',
  ],
  存储板块: ['AR', 'BLZ'],
  香港概念: ['CFX', 'ACH', 'LRC'],
  DWF概念: ['METIS', 'AGLD', 'CYBER'],
  币AN首次交易所发行: ['HOOK', 'GAL', 'ID', 'EDU'],
  质押板块: ['LDO', 'SSV', 'RPL'],
};

console.log(Object.entries(data));

const entries = Object.entries(data);
const result = {};

entries.forEach(([type, coinList]) => {
  coinList.forEach((coin) => {
    result[coin] = result[coin] || [];
    result[coin].push(type);
  });
});

console.log(result);
