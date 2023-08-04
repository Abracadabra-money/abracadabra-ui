import SorbettiereAbi from "@/utils/abi/farm/SorbettiereAbi";
import erc20Abi from "@/utils/abi/farm/erc20Abi";
import crvStakeTokenAbi from "@/utils/abi/farm/crvStakeTokenAbi";
import { useImage } from "@/helpers/useImage";

import type { FarmConfig } from "@/utils/farmsConfig/types";

const ethereumFarms: FarmConfig[] = [
  {
    name: "ETH-SPELL",
    icon: useImage(`assets/images/tokens/ETH-Spell.png`),
    // nameSubtitle: "Sushiswap",
    contractChain: 1,
    id: 2,
    farmId: 0,
    // stakingTokenType: "SLP",
    // stakingTokenIcon: "ETH-SPELL",
    stakingTokenLink:
      "https://app.sushi.com/add/ETH/0x090185f2135308BaD17527004364eBcC2D37e5F6",
    stakingTokenName: "SLP",
    depositedBalance: {
      token0: {
        name: "SPELL",
        icon: useImage("assets/images/tokens/SPELL.png"),
      },
      token1: {
        name: "ETH",
        icon: useImage("assets/images/tokens/ETH.png"),
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
    icon: useImage(`assets/images/tokens/MIM-ETH.png`),
    // nameSubtitle: "Sushiswap",
    contractChain: 1,
    id: 1,
    farmId: 2,
    // stakingTokenType: "SLP",
    // stakingTokenIcon: "MIM-ETH",
    stakingTokenLink:
      "https://app.sushi.com/add/ETH/0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3",
    stakingTokenName: "SLP",
    depositedBalance: {
      token0: {
        name: "MIM",
        icon: useImage("assets/images/tokens/MIM.png"),
      },
      token1: {
        name: "ETH",
        icon: useImage("assets/images/tokens/ETH.png"),
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
    icon: useImage(`assets/images/tokens/Curve-MIM.png`),
    // nameSubtitle: "crv.finance",
    contractChain: 1,
    id: 3,
    farmId: 1,
    // stakingTokenType: "LP",
    // stakingTokenIcon: "MIM-3LP3CRV-f-2",
    stakingTokenLink: "https://crv.to/pool",
    stakingTokenAbi: crvStakeTokenAbi,
    stakingTokenName: "MIM-3LP3CRV-f-2",
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

export default ethereumFarms;
