import { chainsConfigs } from "@/helpers/chains/configs";
import { initPublicClient } from "@/helpers/connect/initPublicClient";
import { initStaticJsonRpcProvider } from "@/helpers/connect/initStaticJsonRpcProvider";

export const getPublicClient = (chainId: number): any => {
  return initPublicClient(chainId);
};

export const getChainConfig = (chainId: number) => {
  return chainsConfigs.find((chain) => chain.viemConfig.id === Number(chainId));
};

export const getEthersProvider = (chainId = 1): any => {
  return initStaticJsonRpcProvider(chainId);
};
