import { useImage } from "@/helpers/useImage";
import erc20Abi from "@/abis/farm/erc20Abi";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import type { PoolConfig } from "@/configs/pools/types";

const blastPools: Array<PoolConfig> = [
  {
    id: 1,
    chainId: 81457,
    name: "MIM / USDB",
    icon: useImage(`assets/images/tokens/MIM-USDB.png`),
    decimals: 18,
    contract: {
      address: "0xd9F58d32d3F89B56112269718317DB94c27d34c4",
      abi: BlastMIMSwapRouterAbi,
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
    settings: {
      isNew: true,
      isDeprecated: false,
      isMim: true,
    },
  },
];

export default blastPools;
