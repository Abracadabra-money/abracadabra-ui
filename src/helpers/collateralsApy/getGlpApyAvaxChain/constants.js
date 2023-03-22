const { Wallet } = require("ethers");

module.exports.rpc = "https://api.avax.network/ext/bc/C/rpc";

module.exports.rewardReaderAddress =
  "0x04Fc11Bd28763872d143637a7c768bD96E44c1b6";

module.exports.glpManagerAddress = "0xe1ae4d4b06A5Fe1fc288f6B4CD72f9F8323B107F";

module.exports.traderJoeGmxAvaxPool =
  "0x0c91a070f862666bbcce281346be45766d874d98";

module.exports.chainLinkAvaxAddress =
  "0x0a77230d17318075983913bc2145db16c7366156";

module.exports.nativeToken = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";

module.exports.vault = "0x9ab2De34A33fB459b538c43f251eB825645e8595";

module.exports.readerAddress = "0x2eFEE1950ededC65De687b40Fd30a7B5f4544aBd";

module.exports.MagicGlpHarvestorAddress =
  "0xDcB9Bd145B5A31DBbF30428247D1bE8659fa0bF1";

module.exports.rewardTrackersForStakingInfo = [
  "0x2bD10f8E93B3669b6d42E74eEedC65dd1B0a1342",
  "0x908C4D94D34924765f1eDc22A1DD098397c59dD4",
  "0x4d268a7d4C16ceB5a606c173Bd974984343fea13",
  "0x9e295B5B976a184B14aD8cd72413aD846C299660",
  "0xd2D1162512F927a7e282Ef43a362659E4F2a728F",
];

module.exports.walletTokens = [
  "0x62edc0692BD897D2295872a9FFCac5425011c661",
  "0xFf1489227BbAAC61a9209A08929E4c2a526DdD17",
  "0x01234181085565ed162a948b6a5e88758CD7c7b8",
  "0x2bD10f8E93B3669b6d42E74eEedC65dd1B0a1342",
];

module.exports.BASIS_POINTS_DIVISOR = 10000;
module.exports.GLP_DECIMALS = 18;
module.exports.SECONDS_PER_YEAR = 31536000;

module.exports.address = Wallet.createRandom().address;
