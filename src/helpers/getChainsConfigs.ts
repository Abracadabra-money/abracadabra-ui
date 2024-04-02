import type { LocalForkData } from "@/types/tenderly";
import { chainsConfigs } from "@/helpers/chains/configs";
import { TENDERLY_FORK_DATA, TENDERLY_FORK_URL } from "@/constants/tenderly";

export const getChainsConfigs = (): any => {
  const localForkData = localStorage.getItem(TENDERLY_FORK_DATA);
  const tenderlyForkData: LocalForkData[] | null = localForkData
    ? JSON.parse(localForkData)
    : null;

  const viemConfigs = chainsConfigs.map((chain) => {
    return chain.viemConfig;
  });

  if (!tenderlyForkData?.length) {
    return {
      chains: viemConfigs,
      rpcUrls: null,
    };
  }

  const activeForkData = tenderlyForkData.find((forkData: LocalForkData) => {
    if (forkData.useFork) return forkData;
  });

  if (!activeForkData) return { chains: viemConfigs, rpcUrls: null };

  const { forkChainId, forkId } = activeForkData;
  const rpcUrls = [`${TENDERLY_FORK_URL}${forkId}`];

  chainsConfigs.map((chain: any) => {
    if (chain.chainId === forkChainId) {
      chain.viemConfig.rpcUrls.default.http = rpcUrls;
      chain.viemConfig.rpcUrls.public.http = rpcUrls;
    }

    return chain;
  });

  return {
    chains: chainsConfigs.map((chain) => {
      return chain.viemConfig;
    }),
    rpcUrls,
  };
};
