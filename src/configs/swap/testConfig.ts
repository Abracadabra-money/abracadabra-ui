// @ts-ignore
import erc20Abi from "@/abis/farm/erc20Abi";
import { useImage } from "@/helpers/useImage";

export const testTokensList = [
  {
    chainId: 81457,
    name: "MIM",
    icon: useImage("assets/images/tokens/MIM.png"),
    balance: 10_000_000000000000000000n,
    price: 10_000000000000000000n,
    decimals: 18,
    approvedAmount: 1_000_000000000000000000,
    contract: {
      address: "0x76DA31D7C9CbEAE102aff34D3398bC450c8374c1",
      abi: erc20Abi,
    },
    rate: 1000000000000000000n,
    isPopular: true,
  },
  {
    chainId: 81457,
    name: "SPELL",
    icon: useImage("assets/images/tokens/SPELL.png"),
    balance: 30_000_000000000000000000n,
    price: 20_000000000000000000n,
    decimals: 18,
    approvedAmount: 2_000_000000000000000000,
    contract: {
      address: "0x76DA31D7C9CbEAE102aff34D3398bC450c8374c1",
      abi: erc20Abi,
    },
    rate: 1424905120000000n,
    isPopular: true,
  },
  {
    chainId: 81457,
    name: "ETH",
    icon: useImage("assets/images/tokens/ETH.png"),
    balance: 70_000_000000000000000000n,
    price: 30_000000000000000000n,
    decimals: 18,
    approvedAmount: 3_000_000000000000000000,
    contract: {
      address: "0x76DA31D7C9CbEAE102aff34D3398bC450c8374c1",
      abi: erc20Abi,
    },
    rate: 3773000000000000000000n,
  },
];
