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
      http: ["https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    },
    default: {
      http: ["https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    },
  },
  chainId: config.id,
  symbol: "ETH",
  icon: useImage("assets/images/networks/ethereum-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  networkIcon: useImage(`assets/images/networks/ethereum.svg`),
  lzChainId: 101,
};
