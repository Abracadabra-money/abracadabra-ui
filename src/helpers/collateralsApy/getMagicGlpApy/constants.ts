import rewardReaderAbi from "@/helpers/collateralsApy/getMagicGlpApy/abi/RewardReader";
import glpManagerAbi from "@/helpers/collateralsApy/getMagicGlpApy/abi/GlpManager";
import readerV2Abi from "@/helpers/collateralsApy/getMagicGlpApy/abi/ReaderV2";
import uniPoolAbi from "@/helpers/collateralsApy/getMagicGlpApy/abi/UniPool";
import vaultAbi from "@/helpers/collateralsApy/getMagicGlpApy/abi/Vault";
import aggregatorAbi from "@/helpers/collateralsApy/getMagicGlpApy/abi/AbraWsGlp";
import magicGlpHarvestorAbi from "@/helpers/collateralsApy/getMagicGlpApy/abi/MagicGlpHarvestor";
import chainLinkAvaxAbi from "@/helpers/collateralsApy/getMagicGlpApy/abi/chainLinkAvax";
import JoePairAbi from "@/helpers/collateralsApy/getMagicGlpApy/abi/JoePair";

export const SECONDS_PER_YEAR = 31536000;
export const BASIS_POINTS_DIVISOR = 10000;
export const GLP_DECIMALS = 18;

export const contracts = {
  42161: {
    glpManager: {
      address: "0x321F653eED006AD1C29D174e17d96351BDe22649",
      abi: glpManagerAbi,
    },
    rewardReader: {
      address: "0x8BFb8e82Ee4569aee78D03235ff465Bd436D40E0",
      abi: rewardReaderAbi,
    },
    reader: {
      address: "0x2b43c90D1B727cEe1Df34925bcd5Ace52Ec37694",
      abi: readerV2Abi,
    },
    gmxPool: {
      address: "0x80A9ae39310abf666A87C743d6ebBD0E8C42158E",
      abi: uniPoolAbi,
    },
    vault: {
      address: "0x489ee077994B6658eAfA855C308275EAd8097C4A",
      abi: vaultAbi,
    },
    aggregator: {
      address: "0x3477Df28ce70Cecf61fFfa7a95be4BEC3B3c7e75",
      abi: aggregatorAbi,
    },
    magicGlpHarvestor: {
      address: "0x588d402C868aDD9053f8F0098c2DC3443c991d17",
      abi: magicGlpHarvestorAbi,
    },
  },
  43114: {
    glpManager: {
      address: "0xe1ae4d4b06A5Fe1fc288f6B4CD72f9F8323B107F",
      abi: glpManagerAbi,
    },
    rewardReader: {
      address: "0x04Fc11Bd28763872d143637a7c768bD96E44c1b6",
      abi: rewardReaderAbi,
    },
    reader: {
      address: "0x2eFEE1950ededC65De687b40Fd30a7B5f4544aBd",
      abi: readerV2Abi,
    },
    gmxPool: {
      address: "0x0c91a070f862666bbcce281346be45766d874d98",
      abi: JoePairAbi,
    },
    vault: {
      address: "0x9ab2De34A33fB459b538c43f251eB825645e8595",
      abi: vaultAbi,
    },
    aggregator: {
      address: "0x0a77230d17318075983913bc2145db16c7366156",
      abi: chainLinkAvaxAbi,
    },
    magicGlpHarvestor: {
      address: "0x05b3b96df07b4630373ae7506e51777b547335b0",
      abi: magicGlpHarvestorAbi,
    },
  },
};

export const rpc = {
  42161: "https://rpc.ankr.com/arbitrum",
  43114: "https://api.avax.network/ext/bc/C/rpc",
};

export const stakingDataKeys = [
  "stakedGmxTracker",
  "bonusGmxTracker",
  "feeGmxTracker",
  "stakedGlpTracker",
  "feeGlpTracker",
];

export const tokens = {
  42161: {
    gmx: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
    nativeToken: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  },
  43114: {
    gmx: "",
    nativeToken: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
  },
};

export const rewardTrackers = {
  42161: [
    "0x908C4D94D34924765f1eDc22A1DD098397c59dD4",
    "0x4d268a7d4C16ceB5a606c173Bd974984343fea13",
    "0xd2D1162512F927a7e282Ef43a362659E4F2a728F",
    "0x1aDDD80E6039594eE970E5872D247bf0414C8903",
    "0x4e971a87900b931fF39d1Aad67697F49835400b6",
  ],
  43114: [
    "0x2bD10f8E93B3669b6d42E74eEedC65dd1B0a1342",
    "0x908C4D94D34924765f1eDc22A1DD098397c59dD4",
    "0x4d268a7d4C16ceB5a606c173Bd974984343fea13",
    "0x9e295B5B976a184B14aD8cd72413aD846C299660",
    "0xd2D1162512F927a7e282Ef43a362659E4F2a728F",
  ],
};

export const walletTokens = {
  42161: [
    "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
    "0xf42Ae1D54fd613C9bb14810b0588FaAa09a426cA",
    "0x4277f8F2c384827B5273592FF7CeBd9f2C1ac258",
    "0x908C4D94D34924765f1eDc22A1DD098397c59dD4",
  ],
  43114: [
    "0x62edc0692BD897D2295872a9FFCac5425011c661",
    "0xFf1489227BbAAC61a9209A08929E4c2a526DdD17",
    "0x01234181085565ed162a948b6a5e88758CD7c7b8",
    "0x2bD10f8E93B3669b6d42E74eEedC65dd1B0a1342",
  ],
};
