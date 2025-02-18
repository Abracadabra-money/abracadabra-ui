import { useImage } from "@/helpers/useImage";
import { BERA_CHAIN_ID } from "@/constants/global";
import { initPublicClient } from "@/helpers/chains/initPublicClient";
import { initStaticJsonRpcProvider } from "@/helpers/chains/initStaticJsonRpcProvider";

const rpcList = ["https://rpc.berachain.com"];

const viemConfig = {
  id: BERA_CHAIN_ID,
  name: "Berachain Bartio",
  network: "berachain",
  nativeCurrency: { name: "Berachain", symbol: "BERA", decimals: 18 },
  rpcUrls: {
    public: {
      http: rpcList,
    },
    default: {
      http: rpcList,
    },
  },
  blockExplorers: {
    etherscan: { name: "Berascan", url: "https://berascan.com/" },
    default: { name: "Berascan", url: "https://berascan.com/" },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 0,
    },
  },
};

const publicClient = initPublicClient(viemConfig);
const ethersProvider = await initStaticJsonRpcProvider(BERA_CHAIN_ID);

export const beraConfig = {
  publicClient,
  ethersProvider,
  viemConfig: viemConfig,
  chainId: BERA_CHAIN_ID,
  chainName: "Berachain",
  symbol: "BERA",
  icon: useImage("assets/images/networks/bera.png"),
  baseTokenIcon: useImage("assets/images/tokens/BERA.png"),
  baseTokenSymbol: "BERA",
  networkIcon: useImage("assets/images/networks/bera.png"),
  //   lzChainId: 184,
};
