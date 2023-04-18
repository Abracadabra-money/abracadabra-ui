import { Wallet } from "ethers";

export const rpc = "https://api.avax.network/ext/bc/C/rpc";

export const rewardReaderAddress =
  "0x04Fc11Bd28763872d143637a7c768bD96E44c1b6";

export const glpManagerAddress = "0xe1ae4d4b06A5Fe1fc288f6B4CD72f9F8323B107F";

export const traderJoeGmxAvaxPool =
  "0x0c91a070f862666bbcce281346be45766d874d98";

export const chainLinkAvaxAddress =
  "0x0a77230d17318075983913bc2145db16c7366156";

export const nativeToken = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";

export const vault = "0x9ab2De34A33fB459b538c43f251eB825645e8595";

export const readerAddress = "0x2eFEE1950ededC65De687b40Fd30a7B5f4544aBd";

export const MagicGlpHarvestorAddress =
  "0x05b3b96df07b4630373ae7506e51777b547335b0";

export const rewardTrackersForStakingInfo = [
  "0x2bD10f8E93B3669b6d42E74eEedC65dd1B0a1342",
  "0x908C4D94D34924765f1eDc22A1DD098397c59dD4",
  "0x4d268a7d4C16ceB5a606c173Bd974984343fea13",
  "0x9e295B5B976a184B14aD8cd72413aD846C299660",
  "0xd2D1162512F927a7e282Ef43a362659E4F2a728F",
];

export const walletTokens = [
  "0x62edc0692BD897D2295872a9FFCac5425011c661",
  "0xFf1489227BbAAC61a9209A08929E4c2a526DdD17",
  "0x01234181085565ed162a948b6a5e88758CD7c7b8",
  "0x2bD10f8E93B3669b6d42E74eEedC65dd1B0a1342",
];

export const BASIS_POINTS_DIVISOR = 10000;
export const GLP_DECIMALS = 18;
export const SECONDS_PER_YEAR = 31536000;

export const address = Wallet.createRandom().address;
