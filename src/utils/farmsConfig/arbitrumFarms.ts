import SorbettiereAbi from "@/utils/abi/farm/SorbettiereAbi";
import erc20Abi from "@/utils/abi/farm/erc20Abi";
import crvStakeTokenAbi from "@/utils/abi/farm/crvStakeTokenAbi";
import { useImage } from "@/helpers/useImage";
import type { FarmConfig } from "@/utils/farmsConfig/types";

const arbitrumFarms: FarmConfig[] = [
  {
    name: "MIM-2Crv",
    icon: useImage(`assets/images/tokens/Curve-MIM.png`),
    // nameSubtitle: "crv.finance",
    contractChain: 42161,
    id: 3,
    farmId: 0,
    // stakingTokenType: "LP",
    // stakingTokenIcon: "MIM-2Crv",
    stakingTokenLink: "https://arbitrum.curve.fi/factory/0/deposit",
    stakingTokenName: "MIM-2Crv",
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

export default arbitrumFarms;
