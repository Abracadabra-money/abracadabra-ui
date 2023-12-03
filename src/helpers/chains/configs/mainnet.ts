import { mainnet } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { MAINNET_RPC_URLS } from "@/constants/chains";

const config = JSON.parse(JSON.stringify(mainnet));
config.rpcUrls.default.http = MAINNET_RPC_URLS;
config.rpcUrls.public.http = MAINNET_RPC_URLS;

export const mainnetConfig = {
  ...config,
  rpcUrls: {
    public: {
      http: ["https://ethereum.publicnode.com"],
    },
    default: {
      http: ["https://ethereum.publicnode.com"],
    },
  },
  chainId: config.id,
  symbol: "ETH",
  icon: useImage("assets/images/networks/ethereum-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  networkIcon: useImage(`assets/images/networks/ethereum.svg`),
  lzChainId: 101,
};
