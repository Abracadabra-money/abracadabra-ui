import { chainsList } from "../chains";
import type { Address } from "@wagmi/core";
import { fromHex, type PublicClient } from "viem";
import type { UserTokensInfo } from "@/types/cauldron";
import { MAX_ALLOWANCE_VALUE } from "@/constants/cauldron";
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

  const collateralIcon = config.icon;
  const collateralName = collateralInfo.name;
  const collateralDecimals = collateralInfo.decimals;

  const { symbol, baseTokenIcon } =
    chainsList[publicClient.chain!.id as keyof typeof chainsList];

  const unwrappedToken = wrapInfo
    ? {
        name: wrapInfo?.unwrappedToken.name,
        icon: wrapInfo?.unwrappedToken.icon,
        balance: unwrappedTokenBalance.result,
        decimals: collateralInfo.decimals,
        allowance: unwrappedTokenAllowance.result,
        isHiddenWrap: !!wrapInfo?.isHiddenWrap,
      }
    : null;

  const { name: borrowTokenName, icon: borrowTokenIcon } = config.mimInfo;

  return {
    collateralToken: {
      icon: collateralIcon,
      name: collateralName,
      decimals: collateralDecimals,
      balance: collateralBalance.result,
      allowance: collateralAllowance.result,
      isHiddenWrap: !!wrapInfo?.isHiddenWrap,
    },
    nativeToken: {
      name: symbol,
      icon: baseTokenIcon,
      balance: nativeTokenBalance,
      decimals: 18,
      allowance: fromHex(MAX_ALLOWANCE_VALUE, "bigint"),
      isNative: true,
    },
    borrowToken: {
      name: borrowTokenName,
      icon: borrowTokenIcon,
      balance: mimBalance.result,
      decimals: 18,
      allowance: mimAllowance.result,
    },
    unwrappedToken,
  };
};
