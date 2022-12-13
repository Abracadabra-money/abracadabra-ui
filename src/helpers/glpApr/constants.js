const { Wallet } = require("ethers");

module.exports.rpc = "https://arb1.arbitrum.io/rpc";

module.exports.glpManagerAddress = "0x321F653eED006AD1C29D174e17d96351BDe22649";
module.exports.rewardReaderAddress =
  "0x8BFb8e82Ee4569aee78D03235ff465Bd436D40E0";
module.exports.readerAddress = "0x2b43c90D1B727cEe1Df34925bcd5Ace52Ec37694";
module.exports.uniswapGmxEthPool = "0x80A9ae39310abf666A87C743d6ebBD0E8C42158E";
module.exports.vault = "0x489ee077994B6658eAfA855C308275EAd8097C4A";
module.exports.gmx = "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a";
module.exports.weth = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
module.exports.nativeToken = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
module.exports.GmxGlpWrapperAddress =
  "0x3477Df28ce70Cecf61fFfa7a95be4BEC3B3c7e75";

module.exports.rewardTrackersForStakingInfo = [
  "0x908C4D94D34924765f1eDc22A1DD098397c59dD4",
  "0x4d268a7d4C16ceB5a606c173Bd974984343fea13",
  "0xd2D1162512F927a7e282Ef43a362659E4F2a728F",
  "0x1aDDD80E6039594eE970E5872D247bf0414C8903",
  "0x4e971a87900b931fF39d1Aad67697F49835400b6",
];

module.exports.walletTokens = [
  "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
  "0xf42Ae1D54fd613C9bb14810b0588FaAa09a426cA",
  "0x4277f8F2c384827B5273592FF7CeBd9f2C1ac258",
  "0x908C4D94D34924765f1eDc22A1DD098397c59dD4",
];

module.exports.BASIS_POINTS_DIVISOR = 10000;
module.exports.GLP_DECIMALS = 18;
module.exports.SECONDS_PER_YEAR = 31536000;

module.exports.address = Wallet.createRandom().address;
