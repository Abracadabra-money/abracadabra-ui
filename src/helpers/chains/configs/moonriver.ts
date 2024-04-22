import { useImage } from "@/helpers/useImage";
import { moonriver } from "@wagmi/core/chains";
import { filterRpcUrls } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";
import { initStaticJsonRpcProvider } from "@/helpers/chains/initStaticJsonRpcProvider";

const rpcList = filterRpcUrls(moonriver, [
  "https://moonriver-rpc.publicnode.com	",
  "https://rpc.api.moonriver.moonbeam.network",
  "https://moonriver.public.blastapi.io",
  "https://moonriver-rpc.dwellir.com",
]);

const viemConfig = {
  ...moonriver,
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
const ethersProvider = await initStaticJsonRpcProvider(moonriver.id);

export const moonriverConfig = {
  publicClient,
  ethersProvider,
  viemConfig: viemConfig,
  chainId: moonriver.id,
  chainName: "Moonriver",
  symbol: "Moonriver",
  icon: useImage("assets/images/networks/moonriver.svg"),
  baseTokenIcon: useImage("assets/images/tokens/MOVR.png"),
  baseTokenSymbol: "MOVR",
  networkIcon: useImage(`assets/images/networks/moonriver.svg`),
  lzChainId: 167,
};
