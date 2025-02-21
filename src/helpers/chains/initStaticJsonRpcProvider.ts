import { providers } from "ethers";
import { defaultRpc } from "@/helpers/chains";
import { checkUseTenderlyFork } from "@/helpers/tenderly/checkUseTenderlyFork";

export const initStaticJsonRpcProvider = async (chainId: number) => {
  try {
    const { unsupportedChain } = checkUnSupportedChain(chainId);

    if (unsupportedChain) {
      return new providers.StaticJsonRpcProvider(defaultRpc[1]);
    }

    const useForkRpc = checkUseTenderlyFork(chainId);

    if (useForkRpc) {
      return new providers.StaticJsonRpcProvider(useForkRpc);
    }

    const currentRpc = defaultRpc[chainId as keyof typeof defaultRpc];
    return new providers.StaticJsonRpcProvider(currentRpc);
  } catch (error) {
    console.log("Error initialising provider");
    return new providers.StaticJsonRpcProvider(defaultRpc[1]);
  }
};

const checkUnSupportedChain = (chainId = 1) => {
  const unsupportedChain = !defaultRpc[chainId as keyof typeof defaultRpc];

  if (unsupportedChain) {
    localStorage.setItem("MAGIC_MONEY_CHAIN_ID", chainId.toString());
  }

  return { unsupportedChain };
};
