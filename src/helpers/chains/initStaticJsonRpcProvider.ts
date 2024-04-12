import { providers } from "ethers";
import { defaultRpc } from "@/helpers/chains";
import { checkUnSupportedChain } from "@/plugins/walletConnect/utils";
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

// export const initStaticJsonRpcProvider = async (endpoints: any) => {
//   let isAlive = null;
//   let retries = 0;

//   while (!isAlive) {
//     if (retries > endpoints.length) break;

//     try {
//       const provider = new providers.StaticJsonRpcProvider(endpoints[retries]);
//       const network = await provider.getNetwork();
//       const blockNumber = await provider.getBlockNumber();
//       isAlive = network && blockNumber;
//       console.log("Create provider", network);
//       return provider;
//     } catch (error) {
//       retries++;
//       console.error("Error initialising provider");
//     }
//   }
// };
