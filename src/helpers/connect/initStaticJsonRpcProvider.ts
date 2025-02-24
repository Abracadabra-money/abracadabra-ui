import { providers } from "ethers";
import { MAINNET_CHAIN_ID } from "@/constants/global";
import { getRpcByChainId } from "@/helpers/connect/configs";

export const initStaticJsonRpcProvider = (chainId: number) => {
  try {
    return new providers.StaticJsonRpcProvider(getRpcByChainId(chainId));
  } catch (error) {
    console.log("Error initialising provider");
    return new providers.StaticJsonRpcProvider(
      getRpcByChainId(MAINNET_CHAIN_ID)
    );
  }
};
