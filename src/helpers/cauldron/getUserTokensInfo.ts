import { BigNumber } from "ethers";
import type { Address } from "viem";
import type { ContractInfo } from "@/types/global";
import type { UserTokensInfo } from "@/helpers/cauldron/types";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import type { CauldronConfig } from "@/configs/cauldrons/configTypes";

const zeroValue = BigNumber.from("0");

const emptyTokensInfo = {
  collateralBalance: zeroValue,
  mimBalance: zeroValue,
  nativeTokenBalance: zeroValue,
  collateralAllowance: zeroValue,
  mimAllowance: zeroValue,
  unwrappedTokenBalance: zeroValue,
  unwrappedTokenAllowance: zeroValue,
};

export const getUserTokensInfo = async (
  chainId: number,
  account: Address | undefined,
  config: CauldronConfig,
  bentoBoxContract: ContractInfo
): Promise<UserTokensInfo> => {
  if (!account) return emptyTokensInfo;

  const publicClient = getPublicClient(chainId);

  const nativeTokenBalance = await publicClient.getBalance({
    address: account,
  });

  const { collateralInfo, mimInfo, wrapInfo } = config;

  const contracts = [
    {
      address: collateralInfo.address,
      abi: collateralInfo.abi,
      functionName: "balanceOf",
      args: [account],
    },
    {
      address: mimInfo.address as Address,
      abi: mimInfo.abi,
      functionName: "balanceOf",
      args: [account],
    },
    {
      address: collateralInfo.address,
      abi: collateralInfo.abi,
      functionName: "allowance",
      args: [account, bentoBoxContract.address],
    },
    {
      address: mimInfo.address as Address,
      abi: mimInfo.abi,
      functionName: "allowance",
      args: [account, bentoBoxContract.address],
    },
  ];

  if (wrapInfo?.unwrappedToken) {
    const { address, abi } = wrapInfo.unwrappedToken;
    contracts.push({
      address,
      abi,
      functionName: "balanceOf",
      args: [account],
    });

    contracts.push({
      address,
      abi,
      functionName: "allowance",
      args: [account, bentoBoxContract.address],
    });
  }

  const [
    collateralBalance,
    mimBalance,
    collateralAllowance,
    mimAllowance,
    unwrappedTokenBalance,
    unwrappedTokenAllowance,
  ] = await publicClient.multicall({
    contracts: contracts,
  });

  return {
    collateralBalance: BigNumber.from(collateralBalance.result),
    mimBalance: BigNumber.from(mimBalance.result),
    nativeTokenBalance: BigNumber.from(nativeTokenBalance),
    collateralAllowance: BigNumber.from(collateralAllowance.result),
    mimAllowance: BigNumber.from(mimAllowance.result),
    unwrappedTokenBalance: BigNumber.from(unwrappedTokenBalance?.result ?? 0),
    unwrappedTokenAllowance: BigNumber.from(
      unwrappedTokenAllowance?.result ?? 0
    ),
  };
};
