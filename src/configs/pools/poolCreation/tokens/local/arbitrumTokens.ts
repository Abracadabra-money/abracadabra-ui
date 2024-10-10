import erc20Abi from "@/abis/farm/erc20Abi";
import { useImage } from "@/helpers/useImage";
import type { PoolCreationTokenConfig } from "@/configs/pools/poolCreation/types";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";

const arbitrumTokens: Array<PoolCreationTokenConfig> = [
  {
    chainId: ARBITRUM_CHAIN_ID,
    address: "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
    name: "Magic Internet Money",
    symbol: "MIM",
    icon: useImage(`assets/images/tokens/MIM.png`),
    decimals: 18,
    abi: erc20Abi,
  },
  {
    chainId: ARBITRUM_CHAIN_ID,
    address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    name: "Tether USD",
    symbol: "USDT",
    icon: useImage(`assets/images/tokens/USDT.png`),
    decimals: 6,
    abi: erc20Abi,
  },
  {
    chainId: ARBITRUM_CHAIN_ID,
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    name: "Wrapped Ether",
    symbol: "WETH",
    icon: useImage(`assets/images/tokens/WETH.png`),
    decimals: 18,
    abi: erc20Abi,
  },
  {
    chainId: ARBITRUM_CHAIN_ID,
    address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
    name: "Arbitrum",
    symbol: "ARB",
    icon: useImage(`assets/images/tokens/AETH.png`),
    decimals: 18,
    abi: erc20Abi,
  },
  {
    chainId: ARBITRUM_CHAIN_ID,
    name: "USD Coin",
    symbol: "USDC",
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    icon: useImage(`assets/images/tokens/USDC.png`),
    decimals: 6,
    abi: erc20Abi,
  },
  {
    chainId: ARBITRUM_CHAIN_ID,
    name: "Spell Token",
    symbol: "SPELL",
    address: "0x3E6648C5a70A150A88bCE65F4aD4d506Fe15d2AF",
    icon: useImage(`assets/images/tokens/SPELL.png`),
    decimals: 18,
    abi: erc20Abi,
  },
  {
    chainId: ARBITRUM_CHAIN_ID,
    name: "Wrapped BTC",
    symbol: "WBTC",
    address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    icon: useImage(`assets/images/tokens/WBTC.png`),
    decimals: 8,
    abi: erc20Abi,
  },
];

export default arbitrumTokens;
