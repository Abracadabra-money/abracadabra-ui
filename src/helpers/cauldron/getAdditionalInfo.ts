import { utils, BigNumber } from "ethers";
import type { AdditionalInfo } from "@/helpers/cauldron/types";
import { getWhiteListedInfo } from "@/helpers/cauldron/getWhiteListedInfo";
import { checkIsUserCollateralLocked } from "@/helpers/cauldron/check/checkIsUserCollateralLocked";
import { getFeePercent } from "@/helpers/cauldron/getFeePercent";

const EMPTY_STATE = {
  isMasterContractApproved: false,
  tokensRate: utils.parseUnits("1", 18),
  maxWithdrawAmount: BigNumber.from("0"),
  whitelistedInfo: { isUserWhitelisted: false },
  isCollateralLocked: false,
  feePercent: null,
};

export const getAdditionalInfo = async (
  contracts: any,
  account: string | undefined,
  config: any,
  chainId: number,
  contractProvider: any
): Promise<AdditionalInfo> => {
  if (!account) return EMPTY_STATE;

  const { collateral, cauldron, bentoBox } = contracts;
  const { decimals } = config.collateralInfo;
  const masterContract = await cauldron.masterContract();

  const multicallArr = [
    bentoBox.masterContractApproved(masterContract, account),
  ];

  if (collateral.convertToAssets && config?.wrapInfo) {
    multicallArr.push(
      collateral.convertToAssets(utils.parseUnits("1", decimals))
    );
  } else if (collateral.toAmount && config?.wrapInfo) {
    multicallArr.push(collateral.toAmount(utils.parseUnits("1", decimals)));
  } else {
    multicallArr.push(utils.parseUnits("1", decimals));
  }

  if (config.cauldronSettings.hasWithdrawableLimit)
    multicallArr.push(collateral.balanceOf(bentoBox.address));

  const additionalInfo = await Promise.all(multicallArr);

  const whitelistedInfo = await getWhiteListedInfo(
    config,
    cauldron,
    account,
    chainId,
    contractProvider
  );

  const isCollateralLocked = await checkIsUserCollateralLocked(
    config,
    collateral,
    account,
    chainId
  );

  const feePercent = await getFeePercent(config, contractProvider, chainId);

  return {
    isMasterContractApproved: additionalInfo[0] || false,
    tokensRate: additionalInfo[1] || utils.parseUnits("1", decimals),
    maxWithdrawAmount: additionalInfo[2] || BigNumber.from("0"),
    whitelistedInfo,
    isCollateralLocked,
    feePercent,
  };
};
