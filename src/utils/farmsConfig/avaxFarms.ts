import SorbettiereAbi from "@/utils/abi/farm/SorbettiereAbi";
import erc20Abi from "@/utils/abi/farm/erc20Abi";
import crvStakeTokenAbi from "@/utils/abi/farm/crvStakeTokenAbi";
import { useImage } from "@/helpers/useImage";
import type { FarmConfig } from "@/utils/farmsConfig/types";

const avaxFarms: FarmConfig[] = [
  {
    name: "3PoolV2",
    icon: useImage(`assets/images/tokens/CRV.png`),
    // nameSubtitle: "avax.curve.fi",
    contractChain: 43114,
    id: 3,
    farmId: 0,
    // stakingTokenType: "LP",
    // stakingTokenIcon: "curve",
    stakingTokenLink: "https://avax.curve.fi/factory/4/deposit",
    stakingTokenName: "3PoolV2",
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

export default avaxFarms;
