import SorbettiereAbi from "./abi/SorbettiereAbi";
import erc20Abi from "./abi/erc20Abi";
import crvStakeTokenAbi from "./abi/crvStakeTokenAbi";

export default [
  {
    name: "3PoolV2",
    iconName: "3PoolV2",
    nameSubtitle: "ftm.curve.fi",
    contractChain: 250,
    id: 3,
    poolId: 0,
    stakingTokenType: "LP",
    stakingTokenName: "3PoolV2",
    stakingTokenIcon: "3PoolV2",
    stakingTokenLink: "https://ftm.curve.fi/factory/1/deposit",
    stakingTokenAbi: crvStakeTokenAbi,
    contract: {
      name: "Sorbettiere",
      address: "0x37Cf490255082ee50845EA4Ff783Eb9b6D1622ce",
      abi: SorbettiereAbi,
    },
    earnedToken: {
      name: "Spell",
      abi: erc20Abi,
    },
  },
];
