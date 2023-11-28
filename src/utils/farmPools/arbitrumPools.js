import SorbettiereAbi from "./abi/SorbettiereAbi";
import erc20Abi from "./abi/erc20Abi";
import crvStakeTokenAbi from "./abi/crvStakeTokenAbi";
import MultiRewardsStakingAbi from "./abi/MultiRewardsStakingAbi";

import { useImage } from "@/helpers/useImage";

export default [
  {
    name: "MIM-2Crv",
    icon: useImage(`assets/images/tokens/Curve-MIM.png`),
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
  {
    name: "MIM-2Crv",
    icon: useImage(`assets/images/tokens/Curve-MIM.png`),
    nameSubtitle: "crv.finance",
    contractChain: 42161,
    id: 4,
    stakingTokenType: "LP",
    stakingTokenName: "MIM-2Crv",
    stakingTokenIcon: "MIM-2Crv",
    stakingTokenLink: "https://arbitrum.curve.fi/factory/0/deposit",
    stakingTokenAbi: crvStakeTokenAbi,
    contract: {
      name: "MultiRewardsStaking",
      address: "0x6d2070b13929Df15B13D96cFC509C574168988Cd",
      abi: MultiRewardsStakingAbi,
    },
    earnedTokens: [
      {
        name: "Spell",
        icon: useImage(`assets/images/tokens/SPELL.png`),
        address: "0x3E6648C5a70A150A88bCE65F4aD4d506Fe15d2AF",
        decimals: 18,
        abi: erc20Abi,
        oracle: "0x383b3624478124697bef675f07ca37570b73992f",
      },
      {
        name: "Arbitrum",
        icon: useImage(`assets/images/tokens/SPELL.png`), // TODO change icon
        address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
        decimals: 18,
        abi: erc20Abi,
        oracle: "0xb2a824043730fe05f3da2efafa1cbbe83fa548d6",
      },
    ],
  },
];
