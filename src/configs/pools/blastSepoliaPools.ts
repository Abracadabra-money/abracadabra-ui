import { useImage } from "@/helpers/useImage";
import erc20Abi from "@/abis/farm/erc20Abi";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import type { PoolConfig } from "@/configs/pools/types";

const blastSepoliaPools: Array<PoolConfig> = [
  {
    id: 1,
    chainId: 168587773,
    name: "MIM / WETH",
    icon: useImage(`assets/images/tokens/WETH.png`),
    decimals: 18,
    contract: {
      address: "0x06894D4b33565dF998E80dE5D1718Ac5425DA216",
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
    },
    quoteToken: {
      name: "WETH",
      icon: useImage(`assets/images/tokens/WETH.png`),
      contract: {
        address: "0x4300000000000000000000000000000000000004",
        abi: erc20Abi,
      },
      decimals: 18,
    },
    settings: {
      isNew: true,
      isDeprecated: false,
      isMim: true,
    },
  },
];

export default blastSepoliaPools;
