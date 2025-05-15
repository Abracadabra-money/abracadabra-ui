import erc20Abi from "@/abis/farm/erc20Abi";
import { useImage } from "@/helpers/useImage";
import BlastMagicLpAbi from "@/abis/BlastMagicLP";
import type { PoolConfig, AdditionalPoolConfig } from "@/configs/pools/types";
import { NIBIRU_CHAIN_ID } from "@/constants/global";
import { ZERO_ADDRESS } from "@/constants/gm";

const nibiruPools: Array<PoolConfig | AdditionalPoolConfig> = [
  {
    id: "0x099c9bA29F57C2F4fC8d1d8431942121C87aB507",
    chainId: NIBIRU_CHAIN_ID,
    name: "WNIBI / MIM",
    icon: useImage(`assets/images/tokens/MIM-USDT.png`),
    decimals: 18,
    contract: {
      address: "0x099c9bA29F57C2F4fC8d1d8431942121C87aB507",
      abi: BlastMagicLpAbi,
    },
    baseToken: {
      name: "WNIBI",
      icon: useImage(`assets/images/tokens/USDT.png`),
      decimals: 18,
      contract: {
        address: "0x1429b38e58b97de646acd65fdb8a4502c2131484",
        abi: erc20Abi,
      },
      isPopular: true,
    },
    quoteToken: {
      name: "MIM",
      icon: useImage(`assets/images/tokens/MIM.png`),
      decimals: 18,
      contract: {
        address: "0xfCfc58685101e2914cBCf7551B432500db84eAa8",
        abi: erc20Abi,
      },
      isPopular: true,
    },
    settings: {
      isNew: false,
      isDeprecated: false,
      isMim: true,
    },
    initialParameters: {
      I: 59000000000000000000n,
      K: 100000000000000n,
      lpFeeRate: 400000000000000n,
    },
  },

  {
    id: "0x9fcc214DDD8aBb02e401e63d12872A84E504d77B",
    chainId: NIBIRU_CHAIN_ID,
    name: "MIM / WNIBI",
    icon: useImage(`assets/images/tokens/MIM-USDT.png`),
    decimals: 18,
    contract: {
      address: "0x099c9bA29F57C2F4fC8d1d8431942121C87aB507",
      abi: BlastMagicLpAbi,
    },
    baseToken: {
      name: "MIM",
      icon: useImage(`assets/images/tokens/MIM.png`),
      decimals: 18,
      contract: {
        address: "0xfCfc58685101e2914cBCf7551B432500db84eAa8",
        abi: erc20Abi,
      },
      isPopular: true,
    },
    quoteToken: {
      name: "WNIBI",
      icon: useImage(`assets/images/tokens/USDT.png`),
      decimals: 18,
      contract: {
        address: "0x1429B38e58b97de646ACd65fdb8a4502c2131484",
        abi: erc20Abi,
      },
      isPopular: true,
    },
    settings: {
      isNew: false,
      isDeprecated: false,
      isMim: true,
    },
    initialParameters: {
      I: 59000000000000000000n,
      K: 100000000000000n,
      lpFeeRate: 400000000000000n,
    },
  },
];

export default nibiruPools;
