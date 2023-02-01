const expandDecimals = require('./utils/expand-decimals');
// const ethers = require('ethers');

const tokens = [
    // {
    //     name: "Ethereum",
    //     symbol: "ETH",
    //     decimals: 18,
    //     address: ethers.constants.AddressZero,
    //     isNative: true,
    //     isShortable: true,
    //     imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    // },
    // {
    //     name: "Wrapped Ethereum",
    //     symbol: "WETH",
    //     decimals: 18,
    //     address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    //     isWrapped: true,
    //     baseSymbol: "ETH",
    //     imageUrl: "https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1628852295",
    // },
    // {
    //     name: "Bitcoin (WBTC)",
    //     symbol: "BTC",
    //     decimals: 8,
    //     address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    //     isShortable: true,
    //     imageUrl: "https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png?1548822744",
    // },
    // {
    //     name: "Chainlink",
    //     symbol: "LINK",
    //     decimals: 18,
    //     address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
    //     isStable: false,
    //     isShortable: true,
    //     imageUrl: "https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png?1547034700",
    // },
    // {
    //     name: "Uniswap",
    //     symbol: "UNI",
    //     decimals: 18,
    //     address: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
    //     isStable: false,
    //     isShortable: true,
    //     imageUrl: "https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png?1600306604",
    // },
    {
        name: "USD Coin",
        symbol: "USDC",
        decimals: 6,
        address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        isStable: true,
        imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
    },
    // {
    //     name: "Tether",
    //     symbol: "USDT",
    //     decimals: 6,
    //     address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    //     isStable: true,
    //     imageUrl: "https://assets.coingecko.com/coins/images/325/thumb/Tether-logo.png?1598003707",
    // },
    // {
    //     name: "Dai",
    //     symbol: "DAI",
    //     decimals: 18,
    //     address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    //     isStable: true,
    //     imageUrl: "https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734",
    // },
    // {
    //     name: "Frax",
    //     symbol: "FRAX",
    //     decimals: 18,
    //     address: "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F",
    //     isStable: true,
    //     imageUrl: "https://assets.coingecko.com/coins/images/13422/small/frax_logo.png?1608476506",
    // },
    // {
    //     name: "Magic Internet Money",
    //     symbol: "MIM",
    //     decimals: 18,
    //     address: "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
    //     isStable: true,
    //     isTempHidden: true,
    //     imageUrl: "https://assets.coingecko.com/coins/images/16786/small/mimlogopng.png",
    // },
];

const GLP_DECIMALS = 18;
const PRECISION = expandDecimals(1, 30);
const BASIS_POINTS_DIVISOR = 10000;
const TAX_BASIS_POINTS = 50;
const MINT_BURN_FEE_BASIS_POINTS = 25;
const ARB_URL = "https://endpoints.omniatech.io/v1/arbitrum/one/public";
const USD_DECIMALS = 30;
const MAX_PRICE_DEVIATION_BASIS_POINTS = 750;
const DEFAULT_MAX_USDG_AMOUNT = expandDecimals(200 * 1000 * 1000, 18);

module.exports = { 
    tokens,
    GLP_DECIMALS, 
    PRECISION, 
    BASIS_POINTS_DIVISOR, 
    TAX_BASIS_POINTS, 
    MINT_BURN_FEE_BASIS_POINTS,
    ARB_URL,
    USD_DECIMALS,
    MAX_PRICE_DEVIATION_BASIS_POINTS,
    DEFAULT_MAX_USDG_AMOUNT
};