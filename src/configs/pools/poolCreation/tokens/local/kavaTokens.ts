import erc20Abi from "@/abis/farm/erc20Abi";
import { useImage } from "@/helpers/useImage";
import type { PoolCreationTokenConfig } from "@/configs/pools/poolCreation/types";
import { KAVA_CHAIN_ID } from "@/constants/global";

const kavaTokens: Array<PoolCreationTokenConfig> = [
  {
    chainId: KAVA_CHAIN_ID,
    address: "0x471EE749bA270eb4c1165B5AD95E614947f6fCeb",
    name: "Magic Internet Money",
    symbol: "MIM",
    icon: useImage(`assets/images/tokens/MIM.png`),
    decimals: 18,
    abi: erc20Abi,
  },
  {
    chainId: KAVA_CHAIN_ID,
    address: "0x919C1c267BC06a7039e03fcc2eF738525769109c",
    name: "Tether USD",
    symbol: "USDT",
    icon: useImage("assets/images/tokens/USDT.png"),
    decimals: 6,
    abi: erc20Abi,
  },
  {
    chainId: KAVA_CHAIN_ID,
    address: "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b",
    name: "Wrapped Kava",
    symbol: "wKAVA",
    icon: useImage("assets/images/tokens/KAVA.png"),
    decimals: 18,
    abi: erc20Abi,
  },
];

export default kavaTokens;
