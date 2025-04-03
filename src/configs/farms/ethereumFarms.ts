import SorbettiereAbi from "@/abis/farm/SorbettiereAbi";
import erc20Abi from "@/abis/farm/erc20Abi";
import crvStakeTokenAbi from "@/abis/farm/crvStakeTokenAbi";
import { useImage } from "@/helpers/useImage";

import type { FarmConfig } from "@/configs/farms/types";

const ethereumFarms: FarmConfig[] = [
  {
    name: "ETH-SPELL",
    icon: useImage(`assets/images/tokens/ETH-Spell.png`),
    contractChain: 1,
    id: 1,
    poolId: 0,
    stakingToken: {
      name: "SLP",
      type: "SLP",
      decimals: 18,
      link: "https://www.sushi.com/ethereum/pool/v2/0xb5De0C3753b6E1B4dBA616Db82767F17513E6d4E/add",
      abi: erc20Abi,
    },
    earnedToken: {
      name: "Spell",
      abi: erc20Abi,
    },
    contract: {
      name: "Sorbettiere",
      address: "0xF43480afE9863da4AcBD4419A47D9Cc7d25A647F",
      abi: SorbettiereAbi,
    },
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
  },
  {
    name: "MIM-ETH",
    icon: useImage(`assets/images/tokens/MIM-ETH.png`),
    contractChain: 1,
    id: 2,
    poolId: 2,
    stakingToken: {
      name: "SLP",
      type: "SLP",
      decimals: 18,
      link: "https://www.sushi.com/ethereum/pool/v2/0x07D5695a24904CC1B6e3bd57cC7780B90618e3c4/add",
      abi: erc20Abi,
    },
    earnedToken: {
      name: "Spell",
      abi: erc20Abi,
    },
    contract: {
      name: "Sorbettiere",
      address: "0xF43480afE9863da4AcBD4419A47D9Cc7d25A647F",
      abi: SorbettiereAbi,
    },
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
  },
  {
    name: "MIM-3LP3CRV-f-2",
    icon: useImage(`assets/images/tokens/Curve-MIM.png`),
    contractChain: 1,
    id: 3,
    poolId: 1,
    stakingToken: {
      name: "MIM-3LP3CRV-f-2",
      type: "LP",
      decimals: 18,
      link: "https://crv.to/pool",
      abi: crvStakeTokenAbi,
    },
    earnedToken: {
      name: "Spell",
      abi: erc20Abi,
    },
    contract: {
      name: "Sorbettiere",
      address: "0xF43480afE9863da4AcBD4419A47D9Cc7d25A647F",
      abi: SorbettiereAbi,
    },
  },
];

export default ethereumFarms;
