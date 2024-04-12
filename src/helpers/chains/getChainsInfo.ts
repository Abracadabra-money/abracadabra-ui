import { MAINNET_CHAIN_ID } from "@/constants/global";
import { chainsConfigs } from "@/helpers/chains/configs";

export const getPublicClient = (chainId: number) => {
  return chainsConfigs.find((chain) => chain.viemConfig.id === Number(chainId))
    ?.publicClient;
};

export const getChainConfig = (chainId: number) => {
  return chainsConfigs.find((chain) => chain.viemConfig.id === Number(chainId));
};

export const getEthersProvider = (chainId = 1) => {
  const ethersProvider = chainsConfigs.find(
    (chain) => chain.viemConfig.id === Number(chainId)
  )?.ethersProvider;

  if (ethersProvider) return ethersProvider;

  return chainsConfigs.find((chain) => chain.viemConfig.id === MAINNET_CHAIN_ID)
    ?.ethersProvider!;
};
