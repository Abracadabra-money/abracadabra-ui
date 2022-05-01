import SorbettiereAbi from "./abi/SorbettiereAbi";
import erc20Abi from "./abi/erc20Abi";
import crvStakeTokenAbi from "./abi/crvStakeTokenAbi";

export default [
  {
    name: "MIM-2Crv",
    icon: require(`@/assets/images/tokens/Curve-MIM.png`),
    nameSubtitle: "crv.finance",
    contractChain: 42161,
    id: 3,
    poolId: 0,
    stakingTokenType: "LP",
    stakingTokenName: "MIM-2Crv",
    stakingTokenIcon: "MIM-2Crv",
    stakingTokenLink: "https://arbitrum.curve.fi/factory/0/deposit",
    stakingTokenAbi: crvStakeTokenAbi,
    contract: {
      name: "Sorbettiere",
      address: "0x839De324a1ab773F76a53900D70Ac1B913d2B387",
      abi: SorbettiereAbi,
    },
    earnedToken: {
      name: "Spell",
      abi: erc20Abi,
    },
  },
];
