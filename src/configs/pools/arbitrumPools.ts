import erc20Abi from "@/abis/farm/erc20Abi";
import { useImage } from "@/helpers/useImage";
import BlastMagicLpAbi from "@/abis/BlastMagicLP";
import type { PoolConfig } from "@/configs/pools/types";

const arbitrumPools: Array<PoolConfig> = [
  {
    id: 1,
    chainId: 42161,
    name: "WETH / WBTC",
    icon: useImage(`assets/images/tokens/WETH.png`),
    decimals: 18,
    contract: {
      address: "0x5895bff185127a01a333cbea8e53dcf172c13f35",
      abi: BlastMagicLpAbi,
    },
    baseToken: {
      name: "WETH",
      icon: useImage(`assets/images/tokens/WETH.png`),
      decimals: 18,
      contract: {
        address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        abi: erc20Abi,
      },
      mainColor: "#C9E5FF",
      isPopular: true,
    },
    quoteToken: {
      name: "WBTC",
      icon: useImage(`assets/images/tokens/WBTC.png`),
      contract: {
        address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
        abi: erc20Abi,
      },
      decimals: 8,
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

export default arbitrumPools;
