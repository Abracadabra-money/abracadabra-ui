import { getWalletClient } from "@wagmi/core";
import { chainsList } from "@/helpers/chains/index";
import type { LocalForkData } from "@/types/tenderly";
import { TENDERLY_FORK_URL } from "@/constants/tenderly";

export const addAndSwitchForkOnWallet = async ({
  forkChainId,
  forkId,
}: LocalForkData): Promise<boolean> => {
  try {
    const walletClient = await getWalletClient();

    if (walletClient) {
      const baseChainConfig =
        chainsList[forkChainId as keyof typeof chainsList];
      const { name } = baseChainConfig;
      const tenderlyForkId = `${forkId.slice(0, 6)}...${forkId.slice(-6)}`;
      const forkChainConfig = JSON.parse(JSON.stringify(baseChainConfig));
      forkChainConfig.name = `Fork (${name}) - ${tenderlyForkId}`;
      forkChainConfig.rpcUrls.default.http = [`${TENDERLY_FORK_URL}${forkId}`];
      forkChainConfig.rpcUrls.public.http = [`${TENDERLY_FORK_URL}${forkId}`];
      await walletClient.addChain({ chain: forkChainConfig });
      await walletClient.switchChain({ id: forkChainId });
    } else {
      localStorage.setItem("MAGIC_MONEY_CHAIN_ID", forkChainId.toString());
    }

    return true;
  } catch (error) {
    console.log("Add Fork To Metamask Error:", error);
    return false;
  }
};
