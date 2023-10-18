import type { PublicClient } from "viem";
import type { Address } from "@wagmi/core";
import type { UserTokensInfo } from "@/types/cauldron";
import { userTokensInfoEmptyState } from "@/helpers/cauldron/emptyState";
import type { CauldronConfig } from "@/utils/cauldronsConfig/configTypes";

export const getUserTokensInfoViem = async (
  config: CauldronConfig,
  account: Address | undefined,
  publicClient: PublicClient
): Promise<UserTokensInfo> => {
  if (!account) return userTokensInfoEmptyState;
  const { collateralInfo, mimInfo, wrapInfo } = config;

  const bentoBoxAddress: any = await publicClient.readContract({
    ...config.contract,
    functionName: "bentoBox",
    args: [],
  });

  const contracts = [
    {
      address: collateralInfo.address,
      abi: collateralInfo.abi,
      functionName: "balanceOf",
      args: [account],
    },
    {
      address: collateralInfo.address,
      abi: collateralInfo.abi,
      functionName: "allowance",
      args: [account, bentoBoxAddress],
    },
    {
      address: mimInfo.address,
      abi: mimInfo.abi,
      functionName: "balanceOf",
      args: [account],
    },
    {
      address: mimInfo.address,
      abi: mimInfo.abi,
      functionName: "allowance",
      args: [account, bentoBoxAddress],
    },
  ];

  if (wrapInfo?.unwrappedToken) {
    contracts.push({
      address: wrapInfo.unwrappedToken.address,
      abi: wrapInfo.unwrappedToken.abi,
      functionName: "balanceOf",
      args: [account],
    });
    contracts.push({
      address: wrapInfo.unwrappedToken.address,
      abi: wrapInfo.unwrappedToken.abi,
      functionName: "allowance",
      args: [account, bentoBoxAddress],
    });
  }

  const nativeTokenBalance = await publicClient.getBalance({
    address: account,
  });

  const [
    collateralBalance,
    collateralAllowance,
    mimBalance,
    mimAllowance,
    unwrappedTokenBalance = { result: 0n },
    unwrappedTokenAllowance = { result: 0n },
  ]: any = await publicClient.multicall({
    contracts,
  });

  return {
    collateralBalance: collateralBalance.result,
    mimBalance: mimBalance.result,
    nativeTokenBalance: nativeTokenBalance,
    collateralAllowance: collateralAllowance.result,
    mimAllowance: mimAllowance.result,
    unwrappedTokenBalance: unwrappedTokenBalance.result,
    unwrappedTokenAllowance: unwrappedTokenAllowance.result,
  };
};
