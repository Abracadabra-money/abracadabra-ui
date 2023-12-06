import { mainnet } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { RPC_ETH } from "@/constants/rpc";

const config = JSON.parse(JSON.stringify(mainnet));
config.rpcUrls.default.http = [RPC_ETH];
config.rpcUrls.public.http = [RPC_ETH];

export const mainnetConfig = {
  ...config,
  rpcUrls: {
    public: {
      http: [RPC_ETH],
    },
    default: {
      http: [RPC_ETH],
    },
  },
  chainId: config.id,
  symbol: "ETH",
  icon: useImage("assets/images/networks/ethereum-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  networkIcon: useImage(`assets/images/networks/ethereum.svg`),
  lzChainId: 101,
};
