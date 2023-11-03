import type { Chain } from "viem";
import { chains } from "@/helpers/chains";
import type { ChainsConfigs, LocalForkData } from "@/types/tenderly";
import { TENDERLY_FORK_DATA, TENDERLY_FORK_URL } from "@/constants/tenderly";

export const getChainsConfigs = (): ChainsConfigs => {
  const localForkData = localStorage.getItem(TENDERLY_FORK_DATA);
  const tenderlyForkData: LocalForkData[] | null = localForkData
    ? JSON.parse(localForkData)
    : null;

  if (!tenderlyForkData?.length) return { chains: chains, rpcUrls: null };

  const activeForkData = tenderlyForkData.find((forkData: LocalForkData) => {
    if (forkData.useFork) return forkData;
  });

  if (!activeForkData) return { chains: chains, rpcUrls: null };

  const { forkChainId, forkId } = activeForkData;
  const rpcUrls = [`${TENDERLY_FORK_URL}${forkId}`];

  chains.map((chain: Chain) => {
    if (chain.id === forkChainId) {
      chain.rpcUrls.default.http = rpcUrls;
      chain.rpcUrls.public.http = rpcUrls;
    }

    return chain;
  });

  return { chains: chains, rpcUrls };
};
