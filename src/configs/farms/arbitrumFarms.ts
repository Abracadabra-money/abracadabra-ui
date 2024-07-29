import SorbettiereAbi from "@/abis/farm/SorbettiereAbi";
import erc20Abi from "@/abis/farm/erc20Abi";
import crvStakeTokenAbi from "@/abis/farm/crvStakeTokenAbi";
import { useImage } from "@/helpers/useImage";
import type { FarmConfig } from "@/configs/farms/types";
import MultiRewardsStakingAbi from "@/abis/farm/MultiRewardsStakingAbi.js";

const arbitrumFarms: FarmConfig[] = [
  {
    name: "MIM-2Crv",
    icon: useImage(`assets/images/tokens/Curve-MIM.png`),
    contractChain: 42161,
    id: 1,
    poolId: 0,
    stakingToken: {
      name: "MIM-2Crv",
      type: "LP",
      decimals: 18,
      link: "https://arbitrum.curve.fi/factory/0/deposit",
      abi: crvStakeTokenAbi,
    },
    earnedToken: {
      name: "Spell",
      abi: erc20Abi,
    },
    contract: {
      name: "Sorbettiere",
      address: "0x839De324a1ab773F76a53900D70Ac1B913d2B387",
      abi: SorbettiereAbi,
    },
  },
  {
    name: "MIM-2Crv STIP Boosted",
    icon: useImage(`assets/images/tokens/Curve-MIM.png`),
    contractChain: 42161,
    id: 4,
    isMultiReward: true,
    isNew: false,
    isDeprecated: true,
    stakingToken: {
      name: "MIM-2Crv",
      type: "LP",
      decimals: 18,
      link: "https://curve.fi/#/arbitrum/pools/factory-v2-0/deposit",
      address: "0x30dF229cefa463e991e29D42DB0bae2e122B2AC7",
      abi: crvStakeTokenAbi,
    },
    contract: {
      name: "MultiRewardsStaking",
      address: "0x6d2070b13929Df15B13D96cFC509C574168988Cd",
      abi: MultiRewardsStakingAbi,
    },
    rewardTokens: [
      {
        name: "SPELL",
        icon: useImage(`assets/images/tokens/SPELL.png`),
        address: "0x3E6648C5a70A150A88bCE65F4aD4d506Fe15d2AF",
        decimals: 18,
        abi: erc20Abi,
        oracle: "0x383b3624478124697bef675f07ca37570b73992f",
      },
      {
        name: "ARB",
        icon: useImage(`assets/images/tokens/AETH.png`),
        address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
        decimals: 18,
        abi: erc20Abi,
        oracle: "0xb2a824043730fe05f3da2efafa1cbbe83fa548d6",
      },
    ],
  },
];

export default arbitrumFarms;
