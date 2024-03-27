import { kava } from "@wagmi/core/chains";
import { RPC_KAVA } from "@/constants/rpc";
import { useImage } from "@/helpers/useImage";

export const kavaConfig = {
  ...kava,
  rpcUrls: {
    public: {
      http: [
        kava.rpcUrls.default.http[0],
        RPC_KAVA,
        "https://evm.kava.io",
        "https://rpc.ankr.com/kava_evm",
        "https://evm.kava.chainstacklabs.com",
      ],
    },
    default: {
      http: [
        kava.rpcUrls.default.http[0],
        RPC_KAVA,
        "https://evm.kava.io",
        "https://rpc.ankr.com/kava_evm",
        "https://evm.kava.chainstacklabs.com",
      ],
    },
  },
  chainId: kava.id,
  chainName: "KAVA",
  symbol: "Kava EVM",
  icon: useImage("assets/images/networks/kava.png"),
  baseTokenIcon: useImage("assets/images/tokens/KAVA.png"),
  baseTokenSymbol: "Kava",
  networkIcon: useImage(`assets/images/networks/kava.png`),
  lzChainId: 177,
};
