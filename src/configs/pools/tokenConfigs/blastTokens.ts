import { useImage } from "@/helpers/useImage";

export const blastTokens = [
  {
    name: "MIM",
    chainId: 81457,
    address: "0x76DA31D7C9CbEAE102aff34D3398bC450c8374c1",
    icon: useImage("assets/images/tokens/MIM.png"),
  },
  {
    name: "USDB",
    chainId: 81457,
    address: "0x4300000000000000000000000000000000000003",
    icon: useImage("assets/images/tokens/USDB.png"),
  },
  {
    chainId: 81457,
    name: "USDT",
    address: "0x0be9A0e280962213bF85C4F8669359291b2E404A",
    icon: useImage("assets/images/tokens/USDT.png"),
  },
];
