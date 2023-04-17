import { BigNumber } from "ethers";

export const getInterest = async (config, cauldron) => {
  if (Object.prototype.hasOwnProperty.call(cauldron, "interest")) return config.interest; // WARN: remove all unnecessary keys from config
  if (!Object.prototype.hasOwnProperty.call(cauldron, "accrueInfo")) return false;

  const { INTEREST_PER_SECOND } = await cauldron.accrueInfo();
  if (!INTEREST_PER_SECOND) return 0;

  return INTEREST_PER_SECOND.div(BigNumber.from(316880878));
};
