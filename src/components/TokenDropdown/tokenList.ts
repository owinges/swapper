export interface Token {
  address: string;
  chainId: number;
  coingeckoId: string;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
}

// Only contains tokens that pair with WETH [TOKEN-WETH]
// i.e. filters out [WETH-TOKEN]
export const tokens: Token[] = [
  {
    address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    chainId: 1,
    coingeckoId: 'aave',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110',
    name: 'Aave',
    symbol: 'AAVE',
  },
  {
    address: '0x960b236A07cf122663c4303350609A66A7B288C0',
    chainId: 1,
    coingeckoId: 'aragon',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x960b236A07cf122663c4303350609A66A7B288C0/logo.png',
    name: 'Aragon Network Token',
    symbol: 'ANT',
  },
  {
    address: '0xba100000625a3754423978a60c9317c58a424e3D',
    chainId: 1,
    coingeckoId: 'balancer',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png',
    name: 'Balancer',
    symbol: 'BAL',
  },
  {
    address: '0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55',
    chainId: 1,
    coingeckoId: 'band-protocol',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/9545/thumb/band-protocol.png?1568730326',
    name: 'Band Protocol',
    symbol: 'BAND',
  },
  {
    address: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
    chainId: 1,
    coingeckoId: 'bancor',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C/logo.png',
    name: 'Bancor Network Token',
    symbol: 'BNT',
  },
  {
    address: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
    chainId: 1,
    coingeckoId: 'compound-governance-token',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png',
    name: 'Compound',
    symbol: 'COMP',
  },
  {
    address: '0x41e5560054824eA6B0732E656E3Ad64E20e94E45',
    chainId: 1,
    coingeckoId: 'civic',
    decimals: 8,
    logoURI: 'https://assets.coingecko.com/coins/images/788/thumb/civic.png?1547034556',
    name: 'Civic',
    symbol: 'CVC',
  },
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    chainId: 1,
    coingeckoId: 'dai',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
    name: 'Dai Stablecoin',
    symbol: 'DAI',
  },
  {
    address: '0x0AbdAce70D3790235af448C88547603b945604ea',
    chainId: 1,
    coingeckoId: 'district0x',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/849/thumb/district0x.png?1547223762',
    name: 'district0x',
    symbol: 'DNT',
  },
  {
    address: '0x6810e776880C02933D47DB1b9fc05908e5386b96',
    chainId: 1,
    coingeckoId: 'gnosis',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6810e776880C02933D47DB1b9fc05908e5386b96/logo.png',
    name: 'Gnosis Token',
    symbol: 'GNO',
  },
  {
    address: '0x85Eee30c52B0b379b046Fb0F85F4f3Dc3009aFEC',
    chainId: 1,
    coingeckoId: 'keep-network',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/3373/thumb/IuNzUb5b_400x400.jpg?1589526336',
    name: 'Keep Network',
    symbol: 'KEEP',
  },
  {
    address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    chainId: 1,
    coingeckoId: 'chainlink',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png',
    name: 'ChainLink Token',
    symbol: 'LINK',
  },
  {
    address: '0xA4e8C3Ec456107eA67d3075bF9e3DF3A75823DB0',
    chainId: 1,
    coingeckoId: 'loom-network',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA4e8C3Ec456107eA67d3075bF9e3DF3A75823DB0/logo.png',
    name: 'Loom Network',
    symbol: 'LOOM',
  },
  {
    address: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD',
    chainId: 1,
    coingeckoId: 'loopring',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD/logo.png',
    name: 'LoopringCoin V2',
    symbol: 'LRC',
  },
  {
    address: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942',
    chainId: 1,
    coingeckoId: 'decentraland',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/878/thumb/decentraland-mana.png?1550108745',
    name: 'Decentraland',
    symbol: 'MANA',
  },
  {
    address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    chainId: 1,
    coingeckoId: 'matic-network',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png?1624446912',
    name: 'Polygon',
    symbol: 'MATIC',
  },
  {
    address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
    chainId: 1,
    coingeckoId: 'maker',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png',
    name: 'Maker',
    symbol: 'MKR',
  },
  {
    address: '0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671',
    chainId: 1,
    coingeckoId: 'numeraire',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671/logo.png',
    name: 'Numeraire',
    symbol: 'NMR',
  },
  {
    address: '0x4fE83213D56308330EC302a8BD641f1d0113A4Cc',
    chainId: 1,
    coingeckoId: 'nucypher',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/3318/thumb/photo1198982838879365035.jpg?1547037916',
    name: 'NuCypher',
    symbol: 'NU',
  },
  {
    address: '0x4575f41308EC1483f3d399aa9a2826d74Da13Deb',
    chainId: 1,
    coingeckoId: 'orchid-protocol',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4575f41308EC1483f3d399aa9a2826d74Da13Deb/logo.png',
    name: 'Orchid',
    symbol: 'OXT',
  },
  {
    address: '0x408e41876cCCDC0F92210600ef50372656052a38',
    chainId: 1,
    coingeckoId: 'republic-protocol',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x408e41876cCCDC0F92210600ef50372656052a38/logo.png',
    name: 'Republic Token',
    symbol: 'REN',
  },
  {
    address: '0x221657776846890989a759BA2973e427DfF5C9bB',
    chainId: 1,
    coingeckoId: 'augur',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x221657776846890989a759BA2973e427DfF5C9bB/logo.png',
    name: 'Reputation Augur v2',
    symbol: 'REPv2',
  },
  {
    address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
    chainId: 1,
    coingeckoId: 'havven',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png',
    name: 'Synthetix Network Token',
    symbol: 'SNX',
  },
  {
    address: '0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC',
    chainId: 1,
    coingeckoId: 'storj',
    decimals: 8,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC/logo.png',
    name: 'Storj Token',
    symbol: 'STORJ',
  },
  {
    address: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
    chainId: 1,
    coingeckoId: 'nusd',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/5013/thumb/sUSD.png?1616150765',
    name: 'Synth sUSD',
    symbol: 'sUSD',
  },
  {
    address: '0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa',
    chainId: 1,
    coingeckoId: 'tbtc',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/11224/thumb/tBTC.png?1589620754',
    name: 'tBTC',
    symbol: 'TBTC',
  },
  {
    address: '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828',
    chainId: 1,
    coingeckoId: 'uma',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828/logo.png',
    name: 'UMA Voting Token v1',
    symbol: 'UMA',
  },
  {
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    chainId: 1,
    coingeckoId: 'uniswap',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png?1600306604',
    name: 'Uniswap',
    symbol: 'UNI',
  },
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    chainId: 1,
    coingeckoId: 'usd-coin',
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    name: 'USDCoin',
    symbol: 'USDC',
  },
  {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    chainId: 1,
    coingeckoId: 'wrapped-bitcoin',
    decimals: 8,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
    name: 'Wrapped BTC',
    symbol: 'WBTC',
  },
  {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    chainId: 1,
    coingeckoId: 'weth',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    name: 'Wrapped Ether',
    symbol: 'WETH',
  },
  {
    address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
    chainId: 1,
    coingeckoId: 'yearn-finance',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/11849/thumb/yfi-192x192.png?1598325330',
    name: 'yearn finance',
    symbol: 'YFI',
  },
];
