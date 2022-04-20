import SorbettiereAbi from "./abi/SorbettiereAbi";
import erc20Abi from "./abi/erc20Abi";
import crvStakeTokenAbi from "./abi/crvStakeTokenAbi";

export default [
  {
    name: "ETH-SPELL",
    iconName: "ETH-SPELL",
    nameSubtitle: "Sushiswap",
    contractChain: 1,
    id: 2,
    poolId: 0,
    stakingTokenType: "SLP",
    stakingTokenName: "SLP",
    stakingTokenIcon: "ETH-SPELL",
    stakingTokenLink:
      "https://app.sushi.com/add/ETH/0x090185f2135308BaD17527004364eBcC2D37e5F6",
    depositedBalance: {
      token0: {
        name: "SPELL",
      },
      token1: {
        name: "ETH",
      },
    },
    stakingTokenAbi: erc20Abi,
    contract: {
      name: "Sorbettiere",
      address: "0xF43480afE9863da4AcBD4419A47D9Cc7d25A647F",
      abi: SorbettiereAbi,
    },
    earnedToken: {
      name: "Spell",
      abi: erc20Abi,
    },
  },
  {
    name: "MIM-ETH",
    iconName: "MIM-ETH",
    nameSubtitle: "Sushiswap",
    contractChain: 1,
    id: 1,
    poolId: 2,
    stakingTokenType: "SLP",
    stakingTokenName: "SLP",
    stakingTokenIcon: "MIM-ETH",
    stakingTokenLink:
      "https://app.sushi.com/add/ETH/0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3",
    depositedBalance: {
      token0: {
        name: "MIM",
      },
      token1: {
        name: "ETH",
      },
    },
    stakingTokenAbi: erc20Abi,
    contract: {
      name: "Sorbettiere",
      address: "0xF43480afE9863da4AcBD4419A47D9Cc7d25A647F",
      abi: SorbettiereAbi,
    },
    earnedToken: {
      name: "Spell",
      abi: erc20Abi,
    },
  },
  {
    name: "MIM-3LP3CRV-f-2",
    iconName: "MIM-3LP3CRV-f-2",
    nameSubtitle: "crv.finance",
    contractChain: 1,
    id: 3,
    poolId: 1,
    stakingTokenType: "LP",
    stakingTokenName: "MIM-3LP3CRV-f-2",
    stakingTokenIcon: "MIM-3LP3CRV-f-2",
    stakingTokenLink: "https://crv.to/pool",
    stakingTokenAbi: crvStakeTokenAbi,
    contract: {
      name: "Sorbettiere",
      address: "0xF43480afE9863da4AcBD4419A47D9Cc7d25A647F",
      abi: SorbettiereAbi,
    },
    earnedToken: {
      name: "Spell",
      abi: erc20Abi,
    },
  },
];
