import erc20Abi from "@/abis/farm/erc20Abi";
import { useImage } from "@/helpers/useImage";
import BlastMagicLpAbi from "@/abis/BlastMagicLP";
import type { PoolConfig } from "@/configs/pools/types";

import BlastLockingMultiRewardsAbi from "@/abis/BlastLockingMultiRewards";

const blastPools: Array<PoolConfig> = [
  {
    id: 1,
    chainId: 81457,
    name: "MIM / USDB",
    icon: useImage(`assets/images/tokens/MIM-USDB.png`),
    decimals: 18,
    contract: {
      address: "0x163B234120aaE59b46b228d8D88f5Bc02e9baeEa",
      abi: BlastMagicLpAbi,
    },
    baseToken: {
      name: "MIM",
      icon: useImage(`assets/images/tokens/MIM.png`),
      decimals: 18,
      contract: {
        address: "0x76DA31D7C9CbEAE102aff34D3398bC450c8374c1",
        abi: erc20Abi,
      },
      mainColor: "#C9E5FF",
      isPopular: true,
    },
    quoteToken: {
      name: "USDB",
      icon: useImage(`assets/images/tokens/USDB.png`),
      contract: {
        address: "0x4300000000000000000000000000000000000003",
        abi: erc20Abi,
      },
      decimals: 18,
      mainColor: "#FCFC03",
      isPopular: true,
    },
    lockContract: {
      address: "0xf1ed28fa139f2df5cf3ed140aa9f803c79554519",
      abi: BlastLockingMultiRewardsAbi,
    },
    settings: {
      isNew: true,
      isDeprecated: false,
      isMim: true,
      isPointsLogic: true,
    },
    initialParameters: {
      I: 1000000000000000000n,
      K: 250000000000000n,
      lpFeeRate: 500000000000000n
    }
  },
];

export default blastPools;
