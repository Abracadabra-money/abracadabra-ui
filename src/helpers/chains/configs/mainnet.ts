import { mainnet } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { getRpcListByChainId } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";
import type { Address } from "viem";

const rpcList = getRpcListByChainId(mainnet.id);

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
  viemConfig,
  publicClient,
  chainId: mainnet.id,
  chainName: "Ethereum",
  symbol: "ETH",
  icon: useImage("assets/images/networks/ethereum-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  wrappedNativeTokenAddress:
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as Address,
  networkIcon: useImage(`assets/images/networks/ethereum.svg`),
  lzChainId: 101,
};
