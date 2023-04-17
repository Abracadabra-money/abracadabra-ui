import { BigNumber, utils } from "ethers";
import moment from "moment";

export const getTotalBorrow = async (cauldron) => {
  const totalBorrow = await cauldron.totalBorrow();
  const { lastAccrued, INTEREST_PER_SECOND } = await cauldron.accrueInfo();

  if (!lastAccrued || !INTEREST_PER_SECOND) return utils.formatUnits(totalBorrow.elastic);

  const startTimestamp = moment.unix(lastAccrued);
  const currentTimestamp = moment.unix(new Date().getTime() / 1000);

  const duration = Math.floor(
    moment.duration(currentTimestamp.diff(startTimestamp)).asSeconds()
  );

  if (!duration) {
    return utils.formatUnits(totalBorrow.elastic);
  }

  return utils.formatUnits(totalBorrow.elastic.add(totalBorrow.elastic.mul(INTEREST_PER_SECOND).mul(duration).div(BigNumber.from("1000000000000000000"))))
};
