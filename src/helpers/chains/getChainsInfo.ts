import { chainsConfigs } from "@/helpers/chains/configs";

export const getPublicClient = (chainId: number) => {
  return chainsConfigs.find((chain) => chain.viemConfig.id === chainId)
    ?.publicClient;
};

export const getChainConfig = (chainId: number) => {
  return chainsConfigs.find((chain) => chain.viemConfig.id === +chainId);
};
