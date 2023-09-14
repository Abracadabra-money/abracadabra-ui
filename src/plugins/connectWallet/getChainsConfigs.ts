import { fromHex } from "viem";
import { TENDERLY_FORK_URL } from "@/constants/tenderly";

export const getChainsConfigs = (chains: any) => {
  const localForkData: any = localStorage.getItem("tenderly_fork_data");
  const tenderlyForkData: any = JSON.parse(localForkData);

  if (!tenderlyForkData?.length) return { chains, rpcUrls: null };

  const currentChainId = fromHex(window.ethereum.chainId, "number");

  const activeForkData = tenderlyForkData.find((data: any) => {
    if (data.forkChainId === currentChainId && data.useFork) return data;
  });

  if (!activeForkData) return { chains, rpcUrls: null };

  const { forkChainId, forkId } = activeForkData;
  const rpcUrls = [`${TENDERLY_FORK_URL}${forkId}`];

  chains.map((chain: any) => {
    if (chain.id === forkChainId) {
      chain.rpcUrls.default.http = rpcUrls;
      chain.rpcUrls.public.http = rpcUrls;
    }

    return chain;
  });

  return { chains, rpcUrls };
};
