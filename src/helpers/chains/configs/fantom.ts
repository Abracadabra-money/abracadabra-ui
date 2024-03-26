import { fantom } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";

export const fantomConfig = {
  ...fantom,
  rpcUrls: {
    public: {
      http: [
        "https://fantom-mainnet.public.blastapi.io",
        "https://rpc.ankr.com/fantom",
        "https://rpcapi.fantom.network",
        "https://fantom.drpc.org",
        "https://fantom-rpc.publicnode.com",
      ],
    },
    default: {
      http: [
        "https://fantom-mainnet.public.blastapi.io",
        "https://rpc.ankr.com/fantom",
        "https://rpcapi.fantom.network",
        "https://fantom.drpc.org",
        "https://fantom-rpc.publicnode.com",
      ],
    },
  },
  chainId: fantom.id,
  chainName: "Fantom",
  symbol: "FTM",
  icon: useImage("assets/images/networks/fantom-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/FTM2.png"),
  baseTokenSymbol: "FTM",
  networkIcon: useImage(`assets/images/networks/fantom.svg`),
  lzChainId: 112,
};
