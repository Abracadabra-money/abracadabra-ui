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
    name: "Kava",
    symbol: "KAVA",
    icon: useImage(`assets/images/tokens/KAVA.png`),
    isNative: true,
    decimals: 18,
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
  {
    chainId: KAVA_CHAIN_ID,
    address: "0x15932E26f5BD4923d46a2b205191C4b5d5f43FE3",
    name: "ATOM",
    symbol: "ATOM",
    //todo new token icon
    icon: useImage("assets/images/base_token_icon.png"),
    decimals: 6,
    abi: erc20Abi,
  },
  {
    chainId: KAVA_CHAIN_ID,
    address: "0xfa9343c3897324496a05fc75abed6bac29f8a40f",
    name: "USD Coin",
    symbol: "USDC",
    icon: useImage(`assets/images/tokens/USDC.png`),
    decimals: 6,
    abi: erc20Abi,
  },
  {
    chainId: KAVA_CHAIN_ID,
    address: "0xE1da44C0dA55B075aE8E2e4b6986AdC76Ac77d73",
    name: "Vara",
    symbol: "VARA",
    //todo new token icon
    icon: useImage("assets/images/base_token_icon.png"),
    decimals: 18,
    abi: erc20Abi,
  },
  {
    chainId: KAVA_CHAIN_ID,
    address: "0xaf20f5f19698f1d19351028cd7103b63d30de7d7",
    name: "Wagmi",
    symbol: "WAGMI",
    //todo new token icon
    icon: useImage("assets/images/base_token_icon.png"),
    decimals: 18,
    abi: erc20Abi,
  },
];

export default kavaTokens;
