import SorbettiereAbi from "@/utils/abi/farm/SorbettiereAbi";
import erc20Abi from "@/utils/abi/farm/erc20Abi";
import crvStakeTokenAbi from "@/utils/abi/farm/crvStakeTokenAbi";
import { useImage } from "@/helpers/useImage";
import type { FarmConfig } from "@/utils/farmConfig/types";

const fantomFarms: FarmConfig[] = [
  {
    name: "3PoolV2",
    icon: useImage(`assets/images/tokens/Curve-MIM.png`),
    nameSubtitle: "ftm.curve.fi",
    contractChain: 250,
    id: 3,
    poolId: 0,
    stakingTokenType: "LP",
    stakingTokenName: "3PoolV2",
    stakingTokenIcon: "3PoolV2",
    stakingTokenLink: "https://ftm.curve.fi/factory/1/deposit",
    stakingTokenAbi: crvStakeTokenAbi,
    contract: {
      name: "Sorbettiere",
      address: "0x37Cf490255082ee50845EA4Ff783Eb9b6D1622ce",
      abi: SorbettiereAbi,
    },
    earnedToken: {
      name: "Spell",
      abi: erc20Abi,
    },
  },
];

export default fantomFarms;
