import { ethers } from "ethers";

const getTotalBorrow = async (cauldron, decimals) => {
  const totalBorrow = await cauldron.totalBorrow();
  const { lastAccrued, INTEREST_PER_SECOND } = await cauldron.accrueInfo();

  if (!lastAccrued || !INTEREST_PER_SECOND)
    return ethers.utils.formatUnits(totalBorrow.elastic, decimals);

  const timestamp = Math.floor(Date.now() / 1000);

  const elapsedTime = +timestamp - +lastAccrued;

  const elastic = ethers.utils.formatUnits(totalBorrow.elastic, decimals);

  if (elapsedTime != 0 && totalBorrow.base != 0)
    return +elastic + (+elastic * +INTEREST_PER_SECOND * +elapsedTime) / 1e18;

  return 0;
};

export { getTotalBorrow };
