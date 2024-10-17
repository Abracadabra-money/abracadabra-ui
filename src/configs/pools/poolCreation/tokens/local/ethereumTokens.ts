import erc20Abi from "@/abis/farm/erc20Abi";
import { useImage } from "@/helpers/useImage";
import type { PoolCreationTokenConfig } from "@/configs/pools/poolCreation/types";
import { MAINNET_CHAIN_ID } from "@/constants/global";

const ethereumTokens: Array<PoolCreationTokenConfig> = [
  {
    chainId: MAINNET_CHAIN_ID,
    address: "0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3",
    name: "Magic Internet Money",
    symbol: "MIM",
    icon: useImage(`assets/images/tokens/MIM.png`),
    decimals: 18,
    abi: erc20Abi,
  },
  {
    chainId: MAINNET_CHAIN_ID,
    address: "0x15700B564Ca08D9439C58cA5053166E8317aa138",
    name: "deUSD",
    symbol: "deUSD",
    icon: useImage("assets/images/tokens/deUSD.png"),
    decimals: 18,
    abi: erc20Abi,
  },
  {
    chainId: MAINNET_CHAIN_ID,
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    name: "Tether USD",
    symbol: "USDT",
    icon: useImage(`assets/images/tokens/USDT.png`),
    decimals: 6,
    abi: erc20Abi,
  },
  {
    chainId: MAINNET_CHAIN_ID,
    name: "USD Coin",
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    icon: useImage(`assets/images/tokens/USDC.png`),
    decimals: 6,
    abi: erc20Abi,
  },
];

export default ethereumTokens;
