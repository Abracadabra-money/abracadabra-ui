import mimConfigs from "@/configs/tokens/mim";
import beamConfigs from "@/configs/beam/beamConfigs";
import type { Address } from "viem";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";

export const createBeamConfig = async (
  chainId: number,
  account: Address
): Promise<any> => {
  const mimConfig = mimConfigs.find((item) => item.chainId === chainId);

  const fromChainConfig = beamConfigs.find((item) => item.chainId === chainId);
  const destinationChainsConfig = filterDestinationChains(
    fromChainConfig,
    beamConfigs
  );

  const userInfo = await getUserInfo(mimConfig, fromChainConfig, account);

  return {
    config: fromChainConfig,
    destinationChainsConfig,
    tokenConfig: mimConfig,
    userInfo,
  };
};

const getUserInfo = async (
  tokenConfig: any,
  beamConfig: any,
  account: Address
): Promise<any> => {
  const publicClient = getPublicClient(beamConfig.chainId);

  const [balance, allowance] = await publicClient.multicall({
    contracts: [
      {
        address: tokenConfig.address,
        abi: tokenConfig.abi,
        functionName: "balanceOf",
        args: [account],
      },
      {
        address: tokenConfig.address,
        abi: tokenConfig.abi,
        functionName: "allowance",
        args: [account, beamConfig.contract.address],
      },
    ],
  });

  const nativeBalance = await publicClient.getBalance(account);

  return {
    balance: balance.response,
    allowance: allowance.response,
    nativeBalance,
  };
};

const filterDestinationChains = (fromChainConfig: any, beamConfigs: any) => {
  return beamConfigs.filter((chainConfig: any) => {
    const isFromChain = chainConfig.chainId === fromChainConfig.chainId;
    const isDisabled =
      fromChainConfig.settings.disabledDestinationChains.includes(
        chainConfig.chainId
      );

    return !isFromChain && !isDisabled;
  });
};
