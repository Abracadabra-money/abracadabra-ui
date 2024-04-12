import { useImage } from "@/helpers/useImage";
import { initPublicClient } from "@/helpers/chains/initPublicClient";
import { initStaticJsonRpcProvider } from "@/helpers/chains/initStaticJsonRpcProvider";

const rpcList = [
  "https://artio.rpc.berachain.com/",
  "https://rpc.ankr.com/berachain_testnet",
];

const viemConfig = {
  id: 80085,
  name: "Berachain Artio",
  network: "berachain-testnet",
  nativeCurrency: { name: "BERA", symbol: "BERA", decimals: 18 },
  rpcUrls: {
    public: {
      http: rpcList,
    },
    default: {
      http: rpcList,
    },
  },
  blockExplorers: {
    etherscan: { name: "Berascan", url: "https://artio.beratrail.io/" },
    default: { name: "Berascan", url: "https://artio.beratrail.io/" },
  },
  //   contracts: {
  //     multicall3: {
  //       address: "0xcA11bde05977b3631167028862bE2a173976CA11",
  //       blockCreated: 5022,
  //     },
  //   },
};

const publicClient = initPublicClient(viemConfig);
const ethersProvider = await initStaticJsonRpcProvider(80085);

export const berachainConfig = {
  publicClient,
  ethersProvider,
  viemConfig: viemConfig,
  chainId: 80085,
  chainName: "Berachain Artio",
  symbol: "BERA",
  icon: useImage("assets/images/networks/bera.png"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "BERA",
  networkIcon: useImage(`assets/images/networks/bera.png`),
  //   lzChainId: 184,
};
