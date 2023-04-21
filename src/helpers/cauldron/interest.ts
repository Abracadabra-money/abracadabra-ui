import { BigNumber, Contract, utils } from "ethers";

const INTEREST_PRECISION = 1e2;

export const getInterest = async (cauldron: Contract): Promise<string> => {
  const { INTEREST_PER_SECOND }: {INTEREST_PER_SECOND: BigNumber} = await cauldron.accrueInfo();
  if (!INTEREST_PER_SECOND) return "0";

  const seconds = BigNumber.from("316880878")

  return utils.formatUnits(INTEREST_PER_SECOND.mul(INTEREST_PRECISION).div(seconds), 2);
};
