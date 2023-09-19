import { toHex } from "viem";
import { TENDERLY_FORK_URL } from "@/constants/tenderly";
import type { AddAndSwitchForkOnWallet, LocalForkData } from "@/types/tenderly";

export const addAndSwitchForkOnWallet = async (
  { forkChainId, forkId }: LocalForkData,
  { nativeCurrency, blockExplorerUrls, chainName }: any
): Promise<AddAndSwitchForkOnWallet> => {
  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: toHex(forkChainId),
          rpcUrls: [`${TENDERLY_FORK_URL}${forkId}`],
          chainName: `Fork (${chainName}) - ${forkId}`,
          nativeCurrency: { ...nativeCurrency },
          blockExplorerUrls: [...blockExplorerUrls],
        },
      ],
    });

    return { success: true };
  } catch (error) {
    console.log("Add Fork To Metamask Error:", error);
    return { error };
  }
};
