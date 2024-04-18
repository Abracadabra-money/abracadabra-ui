import { TENDERLY_FORK_DATA } from "@/constants/tenderly";

export const checkUseTenderlyFork = (chainId: number) => {
  const localForkData = localStorage.getItem(TENDERLY_FORK_DATA);

  const tenderlyForkData: any = localForkData ? JSON.parse(localForkData) : [];

  const activeForkData = tenderlyForkData.find((forkData: any) => {
    if (forkData.useFork) return forkData;
  });

  if (!activeForkData || activeForkData.forkChainId !== +chainId) return null;

  return activeForkData.rpcUrl;
};
