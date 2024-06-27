import erc20Abi from "@/abis/farm/erc20Abi";
import { useImage } from "@/helpers/useImage";
import BlastMagicLpAbi from "@/abis/BlastMagicLP";
import type { PoolConfig } from "@/configs/pools/types";
import MultiRewardsAbi from "@/abis/MultiRewards";

const arbitrumPools: Array<PoolConfig> = [
  // {
  //   id: 1,
  //   chainId: 42161,
  //   name: "WETH / WBTC",
  //   icon: useImage(`assets/images/tokens/BTC-WETH.png`),
  //   decimals: 18,
  //   contract: {
  //     address: "0x5895bff185127a01a333cbea8e53dcf172c13f35",
  //     abi: BlastMagicLpAbi,
  //   },
  //   baseToken: {
  //     name: "WETH",
  //     icon: useImage(`assets/images/tokens/WETH.png`),
  //     decimals: 18,
  //     contract: {
  //       address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  //       abi: erc20Abi,
  //     },
  //     mainColor: "#FE95C0",
  //     isPopular: true,
  //   },
  //   quoteToken: {
  //     name: "WBTC",
  //     icon: useImage(`assets/images/tokens/WBTC.png`),
  //     contract: {
  //       address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
  //       abi: erc20Abi,
  //     },
  //     decimals: 8,
  //     mainColor: "#F9AA4B",
  //     isPopular: true,
  //   },
  //   settings: {
  //     isNew: true,
  //     isDeprecated: false,
  //     isMim: true,
  //   },
  // },
  {
    id: 1,
    chainId: 42161,
    name: "MIM / USDT",
    icon: useImage(`assets/images/tokens/MIM-USDT.png`),
    decimals: 18,
    contract: {
      address: "0x236b9ee6f185dc8b70d8bd3649f40ec37688c1ab",
      abi: BlastMagicLpAbi,
    },
    baseToken: {
      name: "MIM",
      icon: useImage(`assets/images/tokens/MIM.png`),
      decimals: 18,
      contract: {
        address: "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
        abi: erc20Abi,
      },
      mainColor: "#C9E5FF",
      isPopular: true,
    },
    quoteToken: {
      name: "USDt",
      icon: useImage(`assets/images/tokens/USDT.png`),
      contract: {
        address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        abi: erc20Abi,
      },
      decimals: 6,
      mainColor: "#53AE94",
      isPopular: true,
    },
    stakeContract: {
      address: "0xc30911b52b5752447aB08615973e434c801CD652",
      abi: MultiRewardsAbi,
    },
    settings: {
      isNew: true,
      isDeprecated: false,
      isMim: true,
    },
  },
];

export default arbitrumPools;
