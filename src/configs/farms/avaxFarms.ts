import SorbettiereAbi from "@/abis/farm/SorbettiereAbi";
import erc20Abi from "@/abis/farm/erc20Abi";
import crvStakeTokenAbi from "@/abis/farm/crvStakeTokenAbi";
import { useImage } from "@/helpers/useImage";
import type { FarmConfig } from "@/configs/farms/types";

const avaxFarms: FarmConfig[] = [
  {
    name: "3PoolV2",
    icon: useImage(`assets/images/tokens/CRV.png`),
    contractChain: 43114,
    id: 1,
    poolId: 0,
    stakingToken: {
      name: "3PoolV2",
      type: "LP",
      decimals: 18,
      link: "https://avax.curve.finance/factory/4/deposit",
      abi: crvStakeTokenAbi,
    },
    earnedToken: {
      name: "Spell",
      abi: erc20Abi,
    },
    contract: {
      name: "Sorbettiere",
      address: "0x06408571E0aD5e8F52eAd01450Bde74E5074dC74",
      abi: SorbettiereAbi,
    },
  },
];

export default avaxFarms;
