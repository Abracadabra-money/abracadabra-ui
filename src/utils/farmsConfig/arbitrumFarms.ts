import SorbettiereAbi from "@/utils/abi/farm/SorbettiereAbi";
import erc20Abi from "@/utils/abi/farm/erc20Abi";
import crvStakeTokenAbi from "@/utils/abi/farm/crvStakeTokenAbi";
import { useImage } from "@/helpers/useImage";
import type { FarmConfig } from "@/utils/farmsConfig/types";

const arbitrumFarms: FarmConfig[] = [
  {
    name: "MIM-2Crv",
    icon: useImage(`assets/images/tokens/Curve-MIM.png`),
    contractChain: 42161,
    id: 3,
    farmId: 0,
    stakingToken: {
      name: "MIM-2Crv",
      type: "LP",
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
];

export default arbitrumFarms;
