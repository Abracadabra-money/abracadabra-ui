import { PERCENT_PRESITION } from "@/helpers/cauldron/utils";
import { BigNumber, utils } from "ethers";

export const actionConfig = {
  useLeverage: false,
  useDeleverage: false,
  useNativeToken: false,
  useUnwrapToken: false,
  amounts: {
    depositAmounts: {
      inputAmount: BigNumber.from(0),
      collateralTokenAmount: BigNumber.from(0),
      unwrapTokenAmount: BigNumber.from(0),
    },
    borrowAmount: BigNumber.from(0),
    leverageAmounts: {
      amountFrom: BigNumber.from(0),
      amountToMin: BigNumber.from(0),
    },
    deleverageAmounts: {
      amountFrom: BigNumber.from(0),
      amountToMin: BigNumber.from(0),
    },
    repayAmount: BigNumber.from(0),
    withdrawAmount: BigNumber.from(0),
    slippage: utils.parseUnits("1", PERCENT_PRESITION),
  },
};
