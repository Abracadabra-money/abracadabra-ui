import { optimism } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";

export const optimismConfig = {
  ...optimism,
  rpcUrls: {
    public: {
      http: [
        "https://optimism-rpc.publicnode.com",
        "https://rpc.ankr.com/optimism",
        "https://op-pokt.nodies.app",
        "https://optimism.drpc.org",
        "https://endpoints.omniatech.io/v1/op/mainnet/public",
      ],
    },
    default: {
      http: [
        "https://optimism-rpc.publicnode.com",
        "https://rpc.ankr.com/optimism",
        "https://op-pokt.nodies.app",
        "https://optimism.drpc.org",
        "https://endpoints.omniatech.io/v1/op/mainnet/public",
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
