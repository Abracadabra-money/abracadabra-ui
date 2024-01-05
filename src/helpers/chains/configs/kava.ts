import { RPC_KAVA } from "@/constants/rpc";
import { useImage } from "@/helpers/useImage";

export const kavaConfig = {
  id: 2222,
  chainId: 2222,
  name: "Kava EVM",
  network: "Kava EVM",
  nativeCurrency: {
    decimals: 18,
    name: "Kava EVM",
    symbol: "Kava",
  },
  rpcUrls: {
    public: { http: [RPC_KAVA] },
    default: { http: [RPC_KAVA] },
  },
  blockExplorers: {
    etherscan: { name: "Kava", url: "https://explorer.kava.io" },
    default: { name: "Kava", url: "https://explorer.kava.io" },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 3661165,
    },
  },
  symbol: "Kava EVM",
  icon: useImage("assets/images/networks/kava.png"),
  baseTokenIcon: useImage("assets/images/tokens/KAVA.png"),
  baseTokenSymbol: "Kava",
  networkIcon: useImage(`assets/images/networks/kava.png`),
  lzChainId: 177,
};
