import { utils, BigNumber } from "ethers";
import type { AdditionalInfo } from "@/helpers/cauldron/types";

export const getAdditionalInfo = async (
  contracts: any,
  account: string | undefined,
  config: any
): Promise<AdditionalInfo> => {
  const { collateral, cauldron, bentoBox } = contracts;
  const { decimals } = config.collateralInfo;
  const masterContract = await cauldron.masterContract();

  const multicallArr = [
    bentoBox.masterContractApproved(masterContract, account),
  ];

  if (collateral.convertToAssets && config?.wrapInfo)
    multicallArr.push(
      collateral.convertToAssets(utils.parseUnits("1", decimals))
    );

  const additionalInfo = await Promise.all(multicallArr);

  return {
    isMasterContractApproved: additionalInfo[0] || false,
    tokensRate: additionalInfo[1] || BigNumber.from("1"),
  };
};
