import { optimism } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";

console.log("1111", optimism.rpcUrls.default.http[0]);

export const optimismConfig = {
  ...optimism,
  rpcUrls: {
    public: {
      http: [
        optimism.rpcUrls.default.http[0],
        "https://optimism.llamarpc.com",
        "https://optimism-mainnet.public.blastapi.io",
        "https://rpc.ankr.com/optimism",
        "https://1rpc.io/op",
      ],
    },
    default: {
      http: [
        optimism.rpcUrls.default.http[0],
        "https://optimism.llamarpc.com",
        "https://optimism-mainnet.public.blastapi.io",
        "https://rpc.ankr.com/optimism",
        "https://1rpc.io/op",
      ],
    },
  },
  chainId: optimism.id,
  chainName: "Optimism",
  symbol: "OP",
  icon: useImage("assets/images/networks/optimism-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  networkIcon: useImage(`assets/images/networks/optimism.svg`),
  lzChainId: 111,
};
