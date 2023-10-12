import { getWalletClient } from "@wagmi/core";
import { chainsList } from "@/helpers/chains/index";
import { TENDERLY_FORK_URL } from "@/constants/tenderly";
import type { AddAndSwitchForkOnWallet, LocalForkData } from "@/types/tenderly";

export const addAndSwitchForkOnWallet = async ({
  forkChainId,
  forkId,
}: LocalForkData): Promise<AddAndSwitchForkOnWallet> => {
  try {
    const baseChainConfig = chainsList[forkChainId as keyof typeof chainsList];
    const { name } = baseChainConfig;
    const tenderlyForkId = `${forkId.slice(0, 6)}...${forkId.slice(-6)}`;
    const forkChainConfig = JSON.parse(JSON.stringify(baseChainConfig));
    forkChainConfig.name = `Fork (${name}) - ${tenderlyForkId}`;
    forkChainConfig.rpcUrls.default.http = [`${TENDERLY_FORK_URL}${forkId}`];
    forkChainConfig.rpcUrls.public.http = [`${TENDERLY_FORK_URL}${forkId}`];

    const walletClient = await getWalletClient();
    await walletClient!.addChain({ chain: forkChainConfig });

    return { success: true };
  } catch (error) {
    console.log("Add Fork To Metamask Error:", error);
    return { error };
  }
};
