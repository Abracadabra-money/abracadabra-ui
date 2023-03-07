import { BigNumber } from "ethers";
const getSusdtDeLevSwapAmount = async (pool, amount) => {
  const totalLiquidity = await pool.collateralToken.contract.totalLiquidity();
  const totalSupply = await pool.collateralToken.contract.totalSupply();
  return BigNumber.from(amount).div(totalLiquidity.div(totalSupply)).toString();
};

export { getSusdtDeLevSwapAmount };
