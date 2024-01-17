import { providers } from "ethers";
import { defaultRpc } from "@/helpers/chains";
import { markRaw } from "vue";

export const getProviderByChainId = (chainId: number) => {
  return markRaw(
    new providers.StaticJsonRpcProvider(
      defaultRpc[chainId as keyof typeof defaultRpc]
    )
  );
};
