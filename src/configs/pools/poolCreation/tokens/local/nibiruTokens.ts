import erc20Abi from "@/abis/farm/erc20Abi";
import { useImage } from "@/helpers/useImage";
import type { PoolCreationTokenConfig } from "@/configs/pools/poolCreation/types";
import { NIBIRU_CHAIN_ID } from "@/constants/global";
import { ZERO_ADDRESS } from "@/constants/gm";

const nibiruTokens: Array<PoolCreationTokenConfig> = [
  {
    chainId: NIBIRU_CHAIN_ID,
    name: "Nibiru",
    symbol: "NIBI",
    address: ZERO_ADDRESS,
    //todo: add token own icon
    icon: useImage(`assets/images/networks/nibiru.svg`),
    isNative: true,
    decimals: 18,
    abi: erc20Abi,
  },
  {
    chainId: NIBIRU_CHAIN_ID,
    address: "0xfCfc58685101e2914cBCf7551B432500db84eAa8",
    name: "Magic Internet Money",
    symbol: "MIM",
    icon: useImage(`assets/images/tokens/MIM.png`),
    decimals: 18,
    abi: erc20Abi,
  },
];

export default nibiruTokens;
