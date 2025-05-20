import mLpV2Abi from "@/abis/lp/mLpV2";
import erc20Abi from "@/abis/farm/erc20Abi";
import { useImage } from "@/helpers/useImage";
import { NIBIRU_CHAIN_ID } from "@/constants/global";
import type { PoolConfig, AdditionalPoolConfig } from "@/configs/pools/types";

const nibiruPools: Array<PoolConfig | AdditionalPoolConfig> = [
  {
    id: "0x9fcc214DDD8aBb02e401e63d12872A84E504d77B",
    chainId: NIBIRU_CHAIN_ID,
    name: "MIM / WNIBI",
    icon: useImage(`assets/images/tokens/MIM-USDT.png`),
    decimals: 18,
    contract: {
      address: "0x9fcc214DDD8aBb02e401e63d12872A84E504d77B",
      abi: mLpV2Abi,
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
      mlpVersion: 2,
    },
    initialParameters: {
      I: 59000000000000000000n,
      K: 100000000000000n,
      lpFeeRate: 400000000000000n,
    },
  },
  {
    id: "0xF63fCFcd000af6401dc1848E7e147AeDf56f9355",
    chainId: NIBIRU_CHAIN_ID,
    name: "MIM / USDC",
    icon: useImage(`assets/images/tokens/MIM-USDC.png`),
    decimals: 18,
    contract: {
      address: "0xF63fCFcd000af6401dc1848E7e147AeDf56f9355",
      abi: mLpV2Abi,
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
      name: "USDC",
      icon: useImage(`assets/images/tokens/USDT.png`),
      decimals: 6,
      contract: {
        address: "0x0829F361A05D993d5CEb035cA6DF3446b060970b",
        abi: erc20Abi,
      },
      isPopular: true,
    },
    settings: {
      isNew: false,
      isDeprecated: false,
      isMim: false,
      mlpVersion: 2,
    },
    initialParameters: {
      I: 1000000n,
      K: 250000000000000n,
      lpFeeRate: 500000000000000n,
    },
  },
];

export default nibiruPools;
