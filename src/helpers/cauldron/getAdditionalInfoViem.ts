import { parseUnits } from "viem";
import type { providers } from "ethers";
import bentoBoxAbi from "@/utils/abi/bentoBox";
import type { Address, PublicClient } from "viem";
import type { AdditionalInfo } from "@/types/cauldron";
import { additionalInfoEmptyState } from "@/helpers/cauldron/emptyState";
import { getFeePercentViem } from "@/helpers/cauldron/getFeePercentViem";
import type { CauldronConfig } from "@/utils/cauldronsConfig/configTypes";
import { getWhiteListedInfoViem } from "@/helpers/cauldron/getWhiteListedInfoViem";
import { checkIsUserCollateralLockedViem } from "@/helpers/cauldron/check/checkIsUserCollateralLockedViem";

export const getAdditionalInfoViem = async (
  config: CauldronConfig,
  account: Address | undefined,
  publicClient: PublicClient,
  contractProvider: providers.BaseProvider | providers.JsonRpcSigner
): Promise<AdditionalInfo> => {
  const { collateralInfo, contract, cauldronSettings } = config;
  const { decimals } = collateralInfo;

  if (!account) {
    additionalInfoEmptyState.tokensRate = parseUnits("1", decimals);
    return additionalInfoEmptyState;
  }

  const [bentoBoxAddress, masterContractAddress] = await publicClient.multicall(
    {
      contracts: [
        {
          address: contract.address,
          abi: contract.abi,
          functionName: "bentoBox",
          args: [],
        },
        {
          address: contract.address,
          abi: contract.abi,
          functionName: "masterContract",
          args: [],
        },
      ],
    }
  );

  const contracts: any = [
    {
      address: bentoBoxAddress.result,
      abi: bentoBoxAbi,
      functionName: "masterContractApproved",
      args: [masterContractAddress.result, account],
    },
    {
      address: collateralInfo.address,
      abi: collateralInfo.abi,
      functionName: "convertToAssets",
      args: [parseUnits("1", collateralInfo.decimals)],
    },
    {
      address: collateralInfo.address,
      abi: collateralInfo.abi,
      functionName: "toAmount",
      args: [parseUnits("1", collateralInfo.decimals)],
    },
  ];

  if (cauldronSettings.hasWithdrawableLimit) {
    contracts.push({
      address: collateralInfo.address,
      abi: collateralInfo.abi,
      functionName: "balanceOf",
      args: [bentoBoxAddress.result],
    });
  }

  const additionalInfo: any = await publicClient.multicall({ contracts });

  const tokensRate: any = additionalInfo[1]?.error
    ? additionalInfo[2]?.error
      ? parseUnits("1", decimals)
      : additionalInfo[2]?.result
    : additionalInfo[1]?.result;

  const whitelistedInfo = await getWhiteListedInfoViem(
    config,
    publicClient.chain!.id,
    account,
    publicClient,
    contractProvider
  );

  const isCollateralLocked = await checkIsUserCollateralLockedViem(
    config,
    account,
    publicClient.chain!.id
  );

  const feePercent = await getFeePercentViem(
    config,
    publicClient,
    publicClient.chain!.id
  );

  return {
    isMasterContractApproved: additionalInfo[0]?.result || false,
    tokensRate,
    maxWithdrawAmount: additionalInfo[3]?.result || 0n,
    whitelistedInfo,
    isCollateralLocked,
    feePercent,
  };
};
