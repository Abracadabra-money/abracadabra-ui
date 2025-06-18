import { type Address, defineChain } from "viem";
import { useImage } from "@/helpers/useImage";
import { NIBIRU_CHAIN_ID } from "@/constants/global";
import { getRpcListByChainId } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

const rpcList = getRpcListByChainId(NIBIRU_CHAIN_ID);

const viemConfig = defineChain({
  id: NIBIRU_CHAIN_ID,
  name: "Nibiru",
  nativeCurrency: {
    decimals: 18,
    name: "NIBI",
    symbol: "NIBI",
  },
  rpcUrls: {
    public: { http: rpcList },
    default: { http: rpcList },
  },
  blockExplorers: {
    default: {
      name: "NibiScan",
      url: "https://nibiscan.io",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 19587573,
    },
  },
});

const publicClient = initPublicClient(viemConfig);

export const nibiruConfig = {
  viemConfig,
  publicClient,
  chainId: NIBIRU_CHAIN_ID,
  chainName: "Nibiru",
  symbol: "NIBI",
  icon: useImage("assets/images/networks/nibiru.svg"),
  baseTokenIcon: useImage("assets/images/networks/nibiru.svg"),
  baseTokenSymbol: "NIBI",
  wrappedNativeTokenAddress:
    "0x1429B38e58b97de646ACd65fdb8a4502c2131484" as Address,
  networkIcon: useImage("assets/images/networks/nibiru.svg"),
};
