import { useImage } from "@/helpers/useImage";
import { BERA_BARTIO_CHAIN_ID } from "@/constants/global";
import { initPublicClient } from "@/helpers/chains/initPublicClient";
import { initStaticJsonRpcProvider } from "@/helpers/chains/initStaticJsonRpcProvider";

const rpcList = ["https://bartio.rpc.berachain.com/"];

const viemConfig = {
  id: BERA_BARTIO_CHAIN_ID,
  name: "Berachain Bartio",
  network: "berachain-bartio",
  nativeCurrency: { name: "Berachain Bartio", symbol: "BERA", decimals: 18 },
  rpcUrls: {
    public: {
      http: rpcList,
    },
    default: {
      http: rpcList,
    },
  },
  blockExplorers: {
    etherscan: { name: "Berascan", url: "https://bartio.beratrail.io/" },
    default: { name: "Berascan", url: "https://bartio.beratrail.io/" },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 5022,
    },
  },
};

const publicClient = initPublicClient(viemConfig);
const ethersProvider = await initStaticJsonRpcProvider(BERA_BARTIO_CHAIN_ID);

export const beraBartioConfig = {
  publicClient,
  ethersProvider,
  viemConfig: viemConfig,
  chainId: BERA_BARTIO_CHAIN_ID,
  chainName: "Berachain Bartio",
  symbol: "BERA",
  icon: useImage("assets/images/networks/bera.png"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "BERA",
  networkIcon: useImage(`assets/images/networks/bera.png`),
  //   lzChainId: 184,
};
