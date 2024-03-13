import { useImage } from "@/helpers/useImage";
import erc20Abi from "@/abis/farm/erc20Abi";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import type { PoolConfig } from "@/configs/pools/types";

const blastPools: Array<PoolConfig> = [
  {
    id: 1,
    chainId: 81457,
    name: "MIM / WETH",
    icon: useImage(`assets/images/tokens/MIM-WETH.png`),
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
        address: "0x0eb13D9C49C31B57e896c1637766E9EcDC1989CD",
        abi: erc20Abi,
      },
    },
    quoteToken: {
      name: "WETH",
      icon: useImage(`assets/images/tokens/WETH.png`),
      contract: {
        address: "0x4200000000000000000000000000000000000023",
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

export default blastPools;
