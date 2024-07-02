import SorbettiereAbi from "@/abis/farm/SorbettiereAbi";
import erc20Abi from "@/abis/farm/erc20Abi";
import crvStakeTokenAbi from "@/abis/farm/crvStakeTokenAbi";
import { useImage } from "@/helpers/useImage";
import type { FarmConfig } from "@/configs/farms/types";

const fantomFarms: FarmConfig[] = [
  {
    name: "3PoolV2",
    icon: useImage(`assets/images/tokens/Curve-MIM.png`),
    contractChain: 250,
    id: 1,
    poolId: 0,
    stakingToken: {
      name: "3PoolV2",
      type: "LP",
      decimals: 18,
      link: "https://ftm.curve.fi/factory/1/deposit",
      abi: crvStakeTokenAbi,
    },
    earnedToken: {
      name: "Spell",
      abi: erc20Abi,
    },
    contract: {
      name: "Sorbettiere",
      address: "0x37Cf490255082ee50845EA4Ff783Eb9b6D1622ce",
      abi: SorbettiereAbi,
    },
  },
];

export default fantomFarms;
