import { BigNumber, Contract, utils } from "ethers";

const INTEREST_PRECISION = 1e2;

export const getInterest = async (config: any, cauldron: Contract): Promise<string> => {
  if (Object.prototype.hasOwnProperty.call(cauldron, "interest")) return config.interest; // WARN: remove all unnecessary keys from config

  const { INTEREST_PER_SECOND }: {INTEREST_PER_SECOND: BigNumber} = await cauldron.accrueInfo();
  if (!INTEREST_PER_SECOND) return "0";

  const seconds = BigNumber.from("316880878")

  return utils.formatUnits(INTEREST_PER_SECOND.mul(INTEREST_PRECISION).div(seconds), 2);
};
