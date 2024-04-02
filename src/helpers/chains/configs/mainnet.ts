import { mainnet } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { filterRpcUrls } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

const rpcList = filterRpcUrls(mainnet, [
  "https://eth.llamarpc.com",
  "https://ethereum.publicnode.com",
  "https://eth.drpc.org",
  "https://rpc.ankr.com/eth",
]);

const viemConfig = {
  ...mainnet,
  rpcUrls: {
    public: {
      http: rpcList,
    },
    default: {
      http: rpcList,
    },
  },
};

const publicClient = initPublicClient(viemConfig);

export const mainnetConfig = {
  publicClient,
  viemConfig: viemConfig,
  chainId: mainnet.id,
  chainName: "Ethereum",
  symbol: "ETH",
  icon: useImage("assets/images/networks/ethereum-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  networkIcon: useImage(`assets/images/networks/ethereum.svg`),
  lzChainId: 101,
};
