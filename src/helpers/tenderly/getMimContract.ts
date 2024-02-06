import { providers, Contract } from "ethers";
import type { MimConfig } from "@/types/tenderly";
import mimConfigs from "@/utils/contracts/mimToken";
import anySwapERC20Abi from "@/abis/tokensAbi/anySwapERC20Abi";

export const getMimContract = async (
  chainId: number,
  provider: providers.BaseProvider
): Promise<Contract | null> => {
  const mimConfig: MimConfig | undefined = mimConfigs.find(
    (item) => item.chainId === chainId
  );

  if (!mimConfig) return null;

  return await new Contract(
    mimConfig?.address,
    chainId === 1 ? mimConfig.abi : anySwapERC20Abi,
    provider
  );
};
