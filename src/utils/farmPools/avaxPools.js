import SorbettiereAbi from "./abi/SorbettiereAbi";
import erc20Abi from "./abi/erc20Abi";
import crvStakeTokenAbi from "./abi/crvStakeTokenAbi";

export default [
  {
    name: "3PoolV2",
    icon: require(`@/assets/images/farmIcons/Token_3Curve.svg`),
    nameSubtitle: "avax.curve.fi",
    contractChain: 43114,
    id: 3,
    poolId: 0,
    stakingTokenType: "LP",
    stakingTokenName: "3PoolV2",
    stakingTokenIcon: "curve",
    stakingTokenLink: "https://avax.curve.fi/factory/4/deposit",
    stakingTokenAbi: crvStakeTokenAbi,
    contract: {
      name: "Sorbettiere",
      address: "0x06408571E0aD5e8F52eAd01450Bde74E5074dC74",
      abi: SorbettiereAbi,
    },
    earnedToken: {
      name: "Spell",
      abi: erc20Abi,
    },
  },
];
